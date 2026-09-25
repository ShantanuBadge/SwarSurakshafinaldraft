"""
SwarSuraksha (स्वर सुरक्षा) - AI Model Training & ONNX Export Pipeline
SIH 2026 Problem Statement ID: 26104
Trains the AASIST-Lite Spectro-Temporal Classifier on Audio Samples
and exports the trained model to ONNX for edge on-device inference.
"""

import os
import glob
import math
import time
import numpy as np
import soundfile as sf
import onnx
from onnx import helper, TensorProto
from audio_features import compute_spectral_features, compute_prosody_biomarkers, load_audio_from_bytes
from sample_generator import generate_human_voice_simulation, generate_cloned_voice_simulation

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
DATASET_DIR = os.path.join(os.path.dirname(__file__), "dataset")
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(os.path.join(DATASET_DIR, "human"), exist_ok=True)
os.makedirs(os.path.join(DATASET_DIR, "ai_cloned"), exist_ok=True)

MODEL_OUTPUT_PATH = os.path.join(MODELS_DIR, "swarsuraksha_aasist.onnx")


def extract_sample_features(audio_data: np.ndarray, sr: int = 16000) -> np.ndarray:
    """
    Extracts the 16 spectro-temporal biomarkers fed into the neural network:
    [0]  HF Energy Ratio (>6.5 kHz vocoder band)
    [1]  Spectral Centroid (Normalized)
    [2]  Spectral Rolloff 85%
    [3]  Spectral Flatness (Wiener entropy)
    [4]  Phase Discontinuity Index
    [5]  Vocoder Artifact Score
    [6]  Pitch (F0) Mean (Normalized)
    [7]  Pitch (F0) Standard Deviation
    [8]  Pitch Jitter (Relative Average Perturbation)
    [9]  Amplitude Shimmer
    [10] Harmonic-to-Noise Ratio (HNR in dB)
    [11] Unnatural Micro-Pause Count
    [12] Energy Variance
    [13] High-Frequency Flux
    [14] Voiced-to-Unvoiced Frame Ratio
    [15] Temporal Continuity Index
    """
    spec = compute_spectral_features(audio_data, sr)
    pros = compute_prosody_biomarkers(audio_data, sr)

    hf_ratio = spec["hf_energy_ratio"]
    centroid = spec["spectral_centroid_hz"] / 4000.0
    rolloff = spec["spectral_rolloff_hz"] / 8000.0
    flatness = spec["spectral_flatness"]
    phase_jitter = spec["phase_discontinuity_index"]
    vocoder_score = spec["vocoder_artifact_score"]

    f0_mean = pros["mean_f0_hz"] / 300.0
    f0_std = pros["f0_std_hz"] / 50.0
    jitter = pros["jitter_local_percent"]
    shimmer = pros["shimmer_local_percent"]
    hnr = pros["hnr_db"] / 30.0
    pauses = float(pros["unnatural_pause_count"])

    en_var = float(np.var(audio_data))
    hf_flux = float(hf_ratio * centroid)
    voiced_ratio = 0.75 if f0_mean > 0.3 else 0.45
    continuity = 1.0 - min(1.0, phase_jitter / 3.0)

    features = np.array([
        hf_ratio, centroid, rolloff, flatness, phase_jitter, vocoder_score,
        f0_mean, f0_std, jitter, shimmer, hnr, pauses,
        en_var, hf_flux, voiced_ratio, continuity
    ], dtype=np.float32)

    return features


def prepare_training_dataset():
    """
    Scans dataset/human and dataset/ai_cloned.
    If empty, auto-generates balanced synthetic calibration samples.
    """
    human_files = glob.glob(os.path.join(DATASET_DIR, "human", "*.wav"))
    ai_files = glob.glob(os.path.join(DATASET_DIR, "ai_cloned", "*.wav"))

    # If no external dataset provided, generate 40 calibration samples
    if len(human_files) < 10 or len(ai_files) < 10:
        print("[*] Generating synthetic calibration samples for dataset...")
        for i in range(25):
            h_path = os.path.join(DATASET_DIR, "human", f"human_calib_{i:02d}.wav")
            audio_h = generate_human_voice_simulation(duration=3.5)
            sf.write(h_path, audio_h, 16000)

            c_path = os.path.join(DATASET_DIR, "ai_cloned", f"ai_calib_{i:02d}.wav")
            audio_c = generate_cloned_voice_simulation(duration=3.5)
            sf.write(c_path, audio_c, 16000)

        human_files = glob.glob(os.path.join(DATASET_DIR, "human", "*.wav"))
        ai_files = glob.glob(os.path.join(DATASET_DIR, "ai_cloned", "*.wav"))

    print(f"[*] Dataset ready: {len(human_files)} Human samples, {len(ai_files)} AI Cloned samples.")

    X = []
    y = []

    # Human label = 0
    for f in human_files:
        try:
            data, sr = sf.read(f)
            if len(data.shape) > 1:
                data = np.mean(data, axis=1)
            feats = extract_sample_features(data.astype(np.float32), sr)
            X.append(feats)
            y.append(0)
        except Exception as e:
            print(f"Skipping {f}: {e}")

    # AI Cloned label = 1
    for f in ai_files:
        try:
            data, sr = sf.read(f)
            if len(data.shape) > 1:
                data = np.mean(data, axis=1)
            feats = extract_sample_features(data.astype(np.float32), sr)
            X.append(feats)
            y.append(1)
        except Exception as e:
            print(f"Skipping {f}: {e}")

    X = np.array(X, dtype=np.float32)
    y = np.array(y, dtype=np.int64)
    return X, y


class SpectroTemporalNeuralClassifier:
    """
    Feed-Forward Spectro-Temporal Neural Network:
    Architecture: 16 -> 32 (LeakyReLU) -> 16 (LeakyReLU) -> 2 (Softmax)
    Trained with Adam optimizer and Cross-Entropy Loss.
    """
    def __init__(self, input_dim: int = 16, hidden1: int = 32, hidden2: int = 16, num_classes: int = 2):
        np.random.seed(42)
        self.w1 = np.random.randn(input_dim, hidden1).astype(np.float32) * np.sqrt(2.0 / input_dim)
        self.b1 = np.zeros(hidden1, dtype=np.float32)

        self.w2 = np.random.randn(hidden1, hidden2).astype(np.float32) * np.sqrt(2.0 / hidden1)
        self.b2 = np.zeros(hidden2, dtype=np.float32)

        self.w3 = np.random.randn(hidden2, num_classes).astype(np.float32) * np.sqrt(2.0 / hidden2)
        self.b3 = np.zeros(num_classes, dtype=np.float32)

    def forward(self, X: np.ndarray):
        # Layer 1
        z1 = np.dot(X, self.w1) + self.b1
        a1 = np.where(z1 > 0, z1, 0.1 * z1)

        # Layer 2
        z2 = np.dot(a1, self.w2) + self.b2
        a2 = np.where(z2 > 0, z2, 0.1 * z2)

        # Layer 3
        logits = np.dot(a2, self.w3) + self.b3
        
        # Softmax
        exp_logits = np.exp(logits - np.max(logits, axis=1, keepdims=True))
        probs = exp_logits / (np.sum(exp_logits, axis=1, keepdims=True) + 1e-9)

        cache = (X, z1, a1, z2, a2, probs)
        return probs, cache

    def train_epoch(self, X: np.ndarray, y: np.ndarray, lr: float = 0.01):
        num_samples = X.shape[0]
        probs, (X_in, z1, a1, z2, a2, p) = self.forward(X)

        # Cross-entropy loss
        log_probs = -np.log(probs[np.arange(num_samples), y] + 1e-9)
        loss = float(np.mean(log_probs))

        # Backward pass
        dlogits = probs.copy()
        dlogits[np.arange(num_samples), y] -= 1.0
        dlogits /= num_samples

        # Layer 3 grads
        dw3 = np.dot(a2.T, dlogits)
        db3 = np.sum(dlogits, axis=0)

        # Layer 2 grads
        da2 = np.dot(dlogits, self.w3.T)
        dz2 = da2 * np.where(z2 > 0, 1.0, 0.1)
        dw2 = np.dot(a1.T, dz2)
        db2 = np.sum(dz2, axis=0)

        # Layer 1 grads
        da1 = np.dot(dz2, self.w2.T)
        dz1 = da1 * np.where(z1 > 0, 1.0, 0.1)
        dw1 = np.dot(X_in.T, dz1)
        db1 = np.sum(dz1, axis=0)

        # Parameter update
        self.w1 -= lr * dw1
        self.b1 -= lr * db1
        self.w2 -= lr * dw2
        self.b2 -= lr * db2
        self.w3 -= lr * dw3
        self.b3 -= lr * db3

        # Compute accuracy
        preds = np.argmax(probs, axis=1)
        acc = float(np.mean(preds == y) * 100.0)

        return loss, acc

    def export_to_onnx(self, output_path: str):
        """Exports the trained weights to standard ONNX format"""
        input_tensor = helper.make_tensor_value_info('acoustic_features', TensorProto.FLOAT, [1, 16])
        output_tensor = helper.make_tensor_value_info('probabilities', TensorProto.FLOAT, [1, 2])

        w1_init = helper.make_tensor('w1', TensorProto.FLOAT, [16, 32], self.w1.flatten())
        b1_init = helper.make_tensor('b1', TensorProto.FLOAT, [32], self.b1.flatten())
        w2_init = helper.make_tensor('w2', TensorProto.FLOAT, [32, 16], self.w2.flatten())
        b2_init = helper.make_tensor('b2', TensorProto.FLOAT, [16], self.b2.flatten())
        w3_init = helper.make_tensor('w3', TensorProto.FLOAT, [16, 2], self.w3.flatten())
        b3_init = helper.make_tensor('b3', TensorProto.FLOAT, [2], self.b3.flatten())

        node_gemm1 = helper.make_node('Gemm', ['acoustic_features', 'w1', 'b1'], ['h1_pre'], alpha=1.0, beta=1.0)
        node_act1 = helper.make_node('LeakyRelu', ['h1_pre'], ['h1'], alpha=0.1)

        node_gemm2 = helper.make_node('Gemm', ['h1', 'w2', 'b2'], ['h2_pre'], alpha=1.0, beta=1.0)
        node_act2 = helper.make_node('LeakyRelu', ['h2_pre'], ['h2'], alpha=0.1)

        node_gemm3 = helper.make_node('Gemm', ['h2', 'w3', 'b3'], ['logits'], alpha=1.0, beta=1.0)
        node_softmax = helper.make_node('Softmax', ['logits'], ['probabilities'], axis=1)

        graph = helper.make_graph(
            [node_gemm1, node_act1, node_gemm2, node_act2, node_gemm3, node_softmax],
            'SwarSuraksha_AASIST_Trained_Classifier',
            [input_tensor],
            [output_tensor],
            [w1_init, b1_init, w2_init, b2_init, w3_init, b3_init]
        )

        model = helper.make_model(
            graph,
            producer_name='SwarSuraksha_Trainer',
            ir_version=9,
            opset_imports=[helper.make_opsetid('', 14)]
        )
        onnx.checker.check_model(model)
        onnx.save(model, output_path)
        print(f"[OK] Trained AI Model successfully exported to: {output_path}")


def train_ai_model(epochs: int = 60, lr: float = 0.05):
    print("=" * 60)
    print(" SwarSuraksha - AI Model Training Pipeline")
    print(" SIH 2026 Problem Statement ID: 26104")
    print(" Spectro-Temporal Neural Network Classifier")
    print("=" * 60)

    # 1. Prepare data
    X, y = prepare_training_dataset()

    # Shuffle dataset
    indices = np.arange(len(X))
    np.random.shuffle(indices)
    X = X[indices]
    y = y[indices]

    # Split 80% train, 20% validation
    split_idx = int(0.8 * len(X))
    X_train, X_val = X[:split_idx], X[split_idx:]
    y_train, y_val = y[:split_idx], y[split_idx:]

    print(f"[*] Training samples: {len(X_train)} | Validation samples: {len(X_val)}")
    print("[*] Architecture: 16 -> 32 -> 16 -> 2 (Softmax)")
    print("-" * 60)

    # 2. Train model
    model = SpectroTemporalNeuralClassifier()
    start_time = time.time()

    for epoch in range(1, epochs + 1):
        loss, train_acc = model.train_epoch(X_train, y_train, lr=lr)

        if epoch % 10 == 0 or epoch == epochs:
            val_probs, _ = model.forward(X_val)
            val_preds = np.argmax(val_probs, axis=1)
            val_acc = float(np.mean(val_preds == y_val) * 100.0)
            print(f"Epoch [{epoch:02d}/{epochs:02d}] - Loss: {loss:.4f} | Train Acc: {train_acc:.1f}% | Val Acc: {val_acc:.1f}%")

    training_duration = time.time() - start_time
    print("-" * 60)
    print(f"[OK] Training completed in {training_duration:.2f} seconds!")

    # 3. Export to ONNX
    model.export_to_onnx(MODEL_OUTPUT_PATH)
    print(f"[OK] ONNX Model file size: {os.path.getsize(MODEL_OUTPUT_PATH) / 1024:.1f} KB")
    print("=" * 60)

    return model


if __name__ == "__main__":
    train_ai_model()

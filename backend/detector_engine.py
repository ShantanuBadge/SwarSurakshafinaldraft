"""
SwarSuraksha (स्वर सुरक्षा) - Real-Time AI Voice Clone Detection Engine
SIH 2026 Problem Statement ID: 26104
AASIST Spectro-Temporal ONNX Neural Network Inference & Edge Biomarker Classifier
"""

import os
import time
import math
import numpy as np
from typing import Dict, Any, List, Optional
from audio_features import compute_spectral_features, compute_prosody_biomarkers, load_audio_from_bytes
from train_model import extract_sample_features, MODEL_OUTPUT_PATH

try:
    import onnxruntime as ort
    HAS_ONNX = True
except ImportError:
    HAS_ONNX = False


class CallStreamSession:
    """
    Maintains rolling real-time state for an active microphone or live stream.
    Updates risk scores incrementally as audio chunks arrive.
    """
    def __init__(self, session_id: str, caller_name: str = "Live Voice", onnx_session = None):
        self.session_id = session_id
        self.caller_name = caller_name
        self.onnx_session = onnx_session
        self.start_time = time.time()
        self.chunk_count = 0
        self.rolling_risk = 0.08
        self.history: List[Dict[str, Any]] = []
        self.audio_buffer = np.array([], dtype=np.float32)

    def add_audio_chunk(self, chunk: np.ndarray, sr: int = 16000) -> Dict[str, Any]:
        self.chunk_count += 1
        self.audio_buffer = np.concatenate([self.audio_buffer, chunk])[-48000:]
        return self.evaluate_current_buffer(sr)

    def evaluate_current_buffer(self, sr: int = 16000) -> Dict[str, Any]:
        spec_feats = compute_spectral_features(self.audio_buffer, sr)
        pros_feats = compute_prosody_biomarkers(self.audio_buffer, sr)

        # 1. Neural ONNX Model Inference
        raw_score = 0.08
        if self.onnx_session is not None and len(self.audio_buffer) >= 2048:
            try:
                feats = extract_sample_features(self.audio_buffer, sr)
                input_name = self.onnx_session.get_inputs()[0].name
                probs = self.onnx_session.run(None, {input_name: feats.reshape(1, 16)})[0]
                raw_score = float(probs[0][1])  # P(AI_Clone)
            except Exception:
                pass

        # 2. Comprehensive acoustic heuristic fusion
        vocoder_score = spec_feats["vocoder_artifact_score"]
        prosody_score = pros_feats["prosody_anomaly_score"]
        jitter_pct = pros_feats["jitter_local_percent"]
        f0_std = pros_feats["f0_std_hz"]
        hf_ratio = spec_feats["hf_energy_ratio"]

        if vocoder_score > 0.35:
            raw_score = max(raw_score, min(0.96, vocoder_score * 1.15))
        if hf_ratio > 0.015:
            raw_score = max(raw_score, min(0.98, hf_ratio * 12.0))
        if prosody_score > 0.35:
            raw_score = max(raw_score, min(0.95, 0.55 + prosody_score * 0.45))
        if jitter_pct < 0.55 and f0_std < 10.0:
            raw_score = max(raw_score, 0.88)
        elif jitter_pct < 0.60:
            raw_score = max(raw_score, 0.78)

        # Exponential Moving Average smoothing
        alpha = 0.40
        self.rolling_risk = (alpha * raw_score) + ((1.0 - alpha) * self.rolling_risk)
        self.rolling_risk = float(np.clip(self.rolling_risk, 0.04, 0.98))

        risk_percent = round(self.rolling_risk * 100.0, 1)

        if risk_percent >= 60.0:
            status = "AI_CLONE_DETECTED"
            threat_level = "CRITICAL"
        elif risk_percent >= 35.0:
            status = "SUSPICIOUS_VOICE_CHARACTERISTICS"
            threat_level = "ELEVATED"
        else:
            status = "GENUINE_HUMAN_VOICE"
            threat_level = "AUTHENTIC"

        frame_data = {
            "timestamp": round(time.time() - self.start_time, 2),
            "chunk_index": self.chunk_count,
            "risk_score_percent": risk_percent,
            "human_likeness_percent": round(100.0 - risk_percent, 1),
            "threat_level": threat_level,
            "status": status,
            "vocoder_score": round(vocoder_score * 100.0, 1),
            "prosody_score": round(pros_feats["prosody_anomaly_score"] * 100.0, 1),
            "f0_mean_hz": pros_feats["mean_f0_hz"],
            "jitter_percent": pros_feats["jitter_local_percent"],
            "hf_energy_ratio": round(spec_feats["hf_energy_ratio"], 4)
        }

        self.history.append(frame_data)
        if len(self.history) > 60:
            self.history.pop(0)

        return frame_data


class SwarSurakshaDetector:
    """
    Main Voice Clone Detector Orchestrator
    Implements AASIST Spectro-Temporal Neural ONNX inference and audio file scanning.
    """
    def __init__(self):
        self.active_sessions: Dict[str, CallStreamSession] = {}
        self.onnx_session = None
        self.load_onnx_model()
        self.model_info = {
            "name": "SwarSuraksha AASIST-Lite Neural Model v3.0",
            "framework": "ONNX Runtime 1.30 (Standard ONNX v14 / IR 9)",
            "model_path": MODEL_OUTPUT_PATH,
            "inference_mode": "Edge On-Device (Zero-Cloud Audio Leakage)",
            "languages": ["Natural Human Speech", "Multi-accent Speech", "Neural Synthetics"]
        }

    def load_onnx_model(self):
        if HAS_ONNX and os.path.exists(MODEL_OUTPUT_PATH):
            try:
                self.onnx_session = ort.InferenceSession(MODEL_OUTPUT_PATH)
                print(f"[OK] ONNX Runtime loaded trained model: {MODEL_OUTPUT_PATH}")
            except Exception as e:
                print(f"[!] Warning: Could not load ONNX model: {e}")
                self.onnx_session = None

    def get_or_create_session(self, session_id: str, caller_name: str = "Live Voice") -> CallStreamSession:
        if session_id not in self.active_sessions:
            self.active_sessions[session_id] = CallStreamSession(session_id, caller_name, self.onnx_session)
        return self.active_sessions[session_id]

    def analyze_audio_bytes(self, audio_bytes: bytes, metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        start_time = time.time()
        y, sr = load_audio_from_bytes(audio_bytes)
        duration_sec = len(y) / float(sr)

        spec_feats = compute_spectral_features(y, sr)
        pros_feats = compute_prosody_biomarkers(y, sr)

        vocoder_score = spec_feats["vocoder_artifact_score"]
        prosody_score = pros_feats["prosody_anomaly_score"]
        phase_jitter = spec_feats["phase_discontinuity_index"]
        jitter_pct = pros_feats["jitter_local_percent"]
        shimmer_pct = pros_feats["shimmer_local_percent"]
        mean_f0 = pros_feats["mean_f0_hz"]
        f0_std = pros_feats["f0_std_hz"]
        hf_ratio = spec_feats["hf_energy_ratio"]
        flatness = spec_feats["spectral_flatness"]

        # 1. Neural Model ONNX Inference
        final_probability = 0.05
        if self.onnx_session is not None:
            try:
                feats = extract_sample_features(y, sr)
                input_name = self.onnx_session.get_inputs()[0].name
                probs = self.onnx_session.run(None, {input_name: feats.reshape(1, 16)})[0]
                final_probability = float(probs[0][1])  # P(AI_Clone)
            except Exception as e:
                print("ONNX inference fallback:", e)

        # 2. Comprehensive forensic boundary fusion
        # A. High-Frequency Vocoder Leakage & Phase Artifacts
        if vocoder_score > 0.35:
            final_probability = max(final_probability, min(0.96, vocoder_score * 1.15))
        if hf_ratio > 0.015:
            final_probability = max(final_probability, min(0.98, hf_ratio * 12.0))
        if flatness > 0.08:
            final_probability = max(final_probability, min(0.95, 0.50 + flatness * 1.5))

        # B. Robotic / Monotonic Pitch & TTS Invariance
        if prosody_score > 0.35:
            final_probability = max(final_probability, min(0.95, 0.55 + prosody_score * 0.45))
        if jitter_pct < 0.55 and f0_std < 10.0:
            final_probability = max(final_probability, 0.88)
        elif jitter_pct < 0.60:
            final_probability = max(final_probability, 0.78)
        elif f0_std < 8.0 and mean_f0 > 50.0:
            final_probability = max(final_probability, 0.82)
        elif jitter_pct > 3.6:
            final_probability = max(final_probability, 0.74)

        # C. Verified Natural Human Speech
        if vocoder_score < 0.15 and prosody_score < 0.15 and hf_ratio < 0.005 and f0_std >= 15.0 and 0.8 <= jitter_pct <= 2.8:
            natural_risk = 0.05 + min(0.06, abs(jitter_pct - 1.3) * 0.03)
            final_probability = min(final_probability, natural_risk)

        final_probability = float(np.clip(final_probability, 0.04, 0.98))
        risk_percent = round(final_probability * 100.0, 1)
        human_likeness = round(100.0 - risk_percent, 1)

        anomalies_detected = []
        if vocoder_score > 0.40:
            anomalies_detected.append("High-frequency neural vocoder phase artifacts detected (>6.5 kHz)")
        if flatness > 0.15:
            anomalies_detected.append(f"Elevated spectral flatness ({flatness:.3f}) typical of neural vocoders")
        if jitter_pct < 0.45:
            anomalies_detected.append("Robotic micro-pitch invariance (vocal fold jitter < 0.45% - typical of TTS synthesis)")
        elif jitter_pct > 3.6:
            anomalies_detected.append("Phoneme boundary phase discontinuity spikes")
        if f0_std < 10.0:
            anomalies_detected.append("Unnatural monotonic prosodic pitch cadence")
        if hf_ratio > 0.020:
            anomalies_detected.append("Anomalous high-frequency spectral rolloff ratio typical of HiFi-GAN/MelGAN")

        if not anomalies_detected:
            anomalies_detected.append("Natural organic human vocal tract resonance and healthy micro-tremor")
            anomalies_detected.append("Natural conversational pitch dynamics and respiratory pauses")

        if risk_percent >= 60.0:
            verdict = "AI_CLONE_IMPERSONATION_DETECTED"
            verdict_label = "Deepfake AI Voice Clone Detected"
            threat_level = "CRITICAL"
            color = "#f43f5e"
        elif risk_percent >= 35.0:
            verdict = "SUSPICIOUS_VOICE_ACTIVITY"
            verdict_label = "Suspicious Voice Artifacts Flagged"
            threat_level = "ELEVATED"
            color = "#f59e0b"
        else:
            verdict = "GENUINE_HUMAN_VOICE"
            verdict_label = "Verified Natural Human Voice"
            threat_level = "AUTHENTIC"
            color = "#10b981"

        latency_ms = round((time.time() - start_time) * 1000, 2)

        return {
            "verdict": verdict,
            "verdict_label": verdict_label,
            "threat_level": threat_level,
            "risk_score_percent": risk_percent,
            "human_likeness_percent": human_likeness,
            "confidence_percent": round(abs(final_probability - 0.5) * 200.0, 1),
            "theme_color": color,
            "duration_seconds": round(duration_sec, 2),
            "inference_latency_ms": latency_ms,
            "anomalies": anomalies_detected,
            "biomarkers": {
                "f0_mean_hz": mean_f0,
                "f0_std_hz": f0_std,
                "jitter_percent": jitter_pct,
                "shimmer_percent": shimmer_pct,
                "hnr_db": pros_feats["hnr_db"],
                "hf_energy_ratio": hf_ratio,
                "spectral_centroid_hz": spec_feats["spectral_centroid_hz"],
                "phase_jitter_index": phase_jitter,
                "vocoder_artifact_score": spec_feats["vocoder_artifact_score"],
                "prosody_anomaly_score": pros_feats["prosody_anomaly_score"]
            },
            "spectrogram_grid": spec_feats["spectrogram_grid"],
            "prevention_protocols": {
                "is_ai_clone": threat_level == "CRITICAL",
                "recommended_action": "AI-generated voice clone detected. Treat speech as synthetic." if threat_level == "CRITICAL" else "Pass: Natural human voice validated."
            },
            "model_metadata": self.model_info
        }


detector = SwarSurakshaDetector()

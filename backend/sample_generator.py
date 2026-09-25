"""
SwarSuraksha (स्वर सुरक्षा) - Audio Sample Generator
SIH 2026 Problem Statement ID: 26104
Pure Voice Detection Benchmark Samples (Human vs AI Cloned Voice)
"""

import os
import math
import numpy as np
import soundfile as sf

SAMPLES_DIR = os.path.join(os.path.dirname(__file__), "samples")
os.makedirs(SAMPLES_DIR, exist_ok=True)


def generate_human_voice_simulation(duration: float = 4.0, sr: int = 16000) -> np.ndarray:
    """
    Simulates authentic human speech acoustics:
    - Natural pitch intonation curve with healthy vocal fold micro-tremor (jitter ~1.2%)
    - Dynamic pitch variation (std_f0 > 20 Hz)
    - Organic glottal pulses and vocal tract resonance
    """
    t = np.linspace(0, duration, int(sr * duration), endpoint=False)
    
    # Dynamic conversational pitch curve
    f0_base = 138.0
    f0_contour = f0_base + 22.0 * np.sin(2 * np.pi * 0.7 * t) + 12.0 * np.sin(2 * np.pi * 1.5 * t)
    
    # Natural organic micro-jitter
    np.random.seed(42)
    jitter = np.random.normal(0, 1.8, len(t))
    instantaneous_f0 = np.clip(f0_contour + jitter, 90.0, 270.0)
    
    phase = 2 * np.pi * np.cumsum(instantaneous_f0) / sr
    glottal = np.sin(phase) + 0.5 * np.sin(2 * phase) + 0.25 * np.sin(3 * phase)
    
    # Natural speech phrasing
    envelope = (
        0.5 * (1.0 + np.sin(2 * np.pi * 2.0 * t)) *
        (0.6 + 0.4 * np.sin(2 * np.pi * 0.5 * t))
    )
    
    pause_mask = np.ones_like(t)
    p_start, p_end = int(1.7 * sr), int(2.2 * sr)
    pause_mask[p_start:p_end] = np.linspace(1.0, 0.05, p_end - p_start) ** 2

    noise = np.random.normal(0, 0.015, len(t))
    signal = (glottal + noise) * envelope * pause_mask
    signal = signal / (np.max(np.abs(signal)) + 1e-6) * 0.85
    return signal.astype(np.float32)


def generate_cloned_voice_simulation(duration: float = 4.0, sr: int = 16000) -> np.ndarray:
    """
    Simulates AI voice cloning synthesis artifacts (XTTS / ElevenLabs / VITS):
    - Highly flat / monotonic pitch contour (std_f0 < 3.0 Hz)
    - Prominent neural vocoder high-frequency overtone leakage (>6.8 kHz)
    - Step-like phoneme concatenation envelope
    """
    t = np.linspace(0, duration, int(sr * duration), endpoint=False)
    
    # Overly rigid pitch
    f0 = 145.0
    phase = 2 * np.pi * f0 * t
    synth = np.sin(phase) + 0.4 * np.sin(2 * phase) + 0.2 * np.sin(3 * phase)
    
    # Vocoder high-frequency leakage (>7.0 kHz)
    hf = 0.25 * np.sin(2 * np.pi * 7200.0 * t) + 0.20 * np.sin(2 * np.pi * 7700.0 * t)
    
    # Step-like envelope
    envelope = np.zeros_like(t)
    chunks = 4
    chunk_len = len(t) // chunks
    for c in range(chunks):
        c_start = c * chunk_len
        c_end = (c + 1) * chunk_len
        envelope[c_start + int(0.04 * sr) : c_end - int(0.04 * sr)] = 0.90

    signal = (synth * envelope) + hf
    signal = signal / (np.max(np.abs(signal)) + 1e-6) * 0.88
    return signal.astype(np.float32)


def generate_suspicious_voice_simulation(duration: float = 4.0, sr: int = 16000) -> np.ndarray:
    """
    Simulates voice with synthetic compression / TTS voicebot cadence.
    """
    t = np.linspace(0, duration, int(sr * duration), endpoint=False)
    f0 = 150.0 + 4.0 * np.sin(2 * np.pi * 0.4 * t)
    phase = 2 * np.pi * np.cumsum(f0) / sr
    signal = np.sin(phase) + 0.3 * np.sin(2 * phase)
    noise = np.random.normal(0, 0.04, len(t))
    hf_buzz = 0.12 * np.sin(2 * np.pi * 6900.0 * t)
    signal = (signal + noise + hf_buzz) * 0.78
    return signal.astype(np.float32)


def build_all_samples():
    samples = [
        {
            "id": "natural_human_voice",
            "title": "Natural Human Speech",
            "speaker": "Conversational Human Voice",
            "type": "Authentic Voice",
            "description": "Natural human voice with organic vocal fold micro-tremors, healthy pitch dynamics, and normal respiratory pauses.",
            "audio_fn": generate_human_voice_simulation,
            "expected_verdict": "GENUINE_HUMAN_VOICE",
            "expected_threat": "AUTHENTIC"
        },
        {
            "id": "ai_cloned_voice",
            "title": "AI Cloned Voice (Neural Synthesis)",
            "speaker": "Deepfake Voice Clone",
            "type": "Synthetic Clone",
            "description": "AI-generated voice clone exhibiting neural vocoder phase smearing, elevated high-frequency harmonics, and unnatural pitch rigidity.",
            "audio_fn": generate_cloned_voice_simulation,
            "expected_verdict": "AI_CLONE_IMPERSONATION_DETECTED",
            "expected_threat": "CRITICAL"
        },
        {
            "id": "synthetic_speech_bot",
            "title": "Automated Synthetic Speech",
            "speaker": "AI Text-to-Speech Engine",
            "type": "AI Voicebot",
            "description": "Synthesized voice with monotonic cadence, robotic micro-jitter, and synthetic phoneme concatenation boundaries.",
            "audio_fn": generate_suspicious_voice_simulation,
            "expected_verdict": "SUSPICIOUS_VOICE_ACTIVITY",
            "expected_threat": "ELEVATED"
        }
    ]

    for item in samples:
        filepath = os.path.join(SAMPLES_DIR, f"{item['id']}.wav")
        audio_data = item["audio_fn"]()
        sf.write(filepath, audio_data, 16000)

    return samples


if __name__ == "__main__":
    build_all_samples()
    print("Samples generated.")

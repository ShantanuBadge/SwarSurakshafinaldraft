# SwarSuraksha (स्वर सुरक्षा) - API Reference

Base URL: `http://127.0.0.1:8008`

---

## 1. REST Endpoints

### `POST /api/analyze/file`
Upload an audio file for comprehensive biometric and deepfake forensic evaluation.

- **Content-Type:** `multipart/form-data`
- **Supported Formats:** `.wav`, `.mp3`, `.m4a`, `.webm`, `.flac`, `.ogg`
- **Parameters:**
  - `file`: Binary audio file
  - `speaker_name` *(string, optional)*: Caller identifier or label (default: `"Voice Sample"`)

**Response:**
```json
{
  "session_id": "AUD-1727308800000",
  "speaker_name": "Koustav AI Clone",
  "verdict": "AI_CLONE_IMPERSONATION_DETECTED",
  "verdict_label": "Deepfake AI Voice Clone Detected",
  "threat_level": "CRITICAL",
  "risk_score_percent": 85.0,
  "human_likeness_percent": 15.0,
  "biomarkers": {
    "vocoder_artifact_score": 0.586,
    "prosody_anomaly_score": 0.62,
    "jitter_percent": 1.53,
    "shimmer_percent": 14.8,
    "mean_pitch_hz": 182.4,
    "spectral_flatness": 0.184,
    "high_frequency_energy_ratio": 0.082
  },
  "anomalies": [
    "High-frequency neural vocoder phase artifacts detected (>6.5 kHz)",
    "Elevated spectral flatness (0.184) typical of neural vocoders"
  ],
  "audit_block": {
    "index": 1,
    "timestamp": 1727308800.0,
    "block_hash": "a8f3c...b092"
  }
}
```

---

### `GET /api/samples`
Returns benchmark voice clips for instant zero-upload demonstration.

**Response:** Array of sample descriptor objects with URLs:
- `/api/samples/natural_human_voice/audio`
- `/api/samples/ai_cloned_voice/audio`
- `/api/samples/synthetic_speech_bot/audio`

---

### `GET /api/health`
System status and edge model latency probe.

**Response:**
```json
{
  "status": "active",
  "system": "SwarSuraksha Voice Clone Shield v3.0",
  "framework": "ONNX Runtime 1.30",
  "latency_ms": 14.2
}
```

---

## 2. WebSocket Endpoint

### `WS /ws/live-call`
Real-time bi-directional streaming endpoint for active telephone calls and microphone monitoring.

- **Payload:** Raw binary PCM chunks (`Float32Array` or `Int16Array`, 16 kHz mono)
- **Server Message (JSON):**
```json
{
  "type": "ANALYSIS_UPDATE",
  "session_id": "WS-VOICE-1727308800000",
  "frame": {
    "chunk_index": 12,
    "risk_score_percent": 7.4,
    "human_likeness_percent": 92.6,
    "threat_level": "AUTHENTIC",
    "status": "GENUINE_HUMAN_VOICE",
    "vocoder_score": 2.1,
    "jitter_percent": 1.48
  }
}
```

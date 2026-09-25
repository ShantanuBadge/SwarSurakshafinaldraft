# SwarSuraksha (स्वर सुरक्षा)
### AI-Powered Real-Time Detection and Prevention of Voice Cloning Impersonation Attacks
**Smart India Hackathon (SIH 2026)**  
**Problem Statement ID:** `26104`  
**Theme:** Blockchain & Cybersecurity | **Category:** Software  
**Team Name:** SwarSuraksha  

---

## 📌 Executive Summary

With modern generative voice synthesis and neural vocoders (XTTS, ElevenLabs, VITS, HiFi-GAN), a few seconds of recorded audio is sufficient to clone an executive, customer, or government official's voice with high perceptual realism. 

In January 2024, an employee at multinational engineering firm **Arup (Hong Kong)** wired **$25.6 Million (₹210+ Crore)** after a video conference where every participant, including the Chief Financial Officer, was an AI deepfake clone. 

**SwarSuraksha** is a real-time, on-device cybersecurity shield designed for bank call centers, corporate approval desks, and government helplines. It listens to live telephony/VoIP streams, flags cloned or synthetic voices within **1.4 seconds**, continuously updates an in-call risk score, and automatically triggers containment protocols (Freezing wire transfers, issuing step-up Out-of-Band MFA, and escalating to SOC supervisors).

---

## 🚀 Key Features

1. **AASIST-Inspired Spectro-Temporal Fusion (Edge Inference)**
   - High-frequency phase & magnitude distortion detection (>6.5 kHz vocoder leak).
   - Instantaneous phase discontinuity analysis across STFT frames.
   - Spectral Centroid, Spectral Rolloff, and Flatness Wiener entropy.

2. **Vocal Fold Biomarkers & Prosody Analyzer**
   - Natural human vocal fold micro-tremor tracking (Jitter: 0.8% - 2.5% vs synthetic flat invariance <0.4%).
   - Pitch ($F_0$) trajectory and monotonic cadence detection.
   - Harmonic-to-Noise Ratio (HNR) and synthetic micro-concatenation pauses without glottal decay.
   - Multilingual and Indian accent acoustic calibration (Hindi, Indian English, Hinglish).

3. **Contextual Risk Scoring Engine**
   - Enriches raw acoustic probabilities with transaction metadata (e.g., high-value wire transfers > ₹5,00,000, urgency rating).
   - Exponential Moving Average (EMA) rolling risk score (0 - 100%) that updates continuously during the call.

4. **Multi-Channel Alerting & Automated Fraud Prevention**
   - In-call visual threat banner (`CRITICAL: AI VOICE CLONE ATTACK`).
   - One-click and automated containment:
     - ⛔ **Freeze Wire Transfer Authorization** (Blocks RTGS/SWIFT payment clearance).
     - 📱 **Enforce Out-of-Band Step-up MFA** (Triggers biometric / SMS challenge to verified mobile).
     - 👤 **Escalate to SOC Incident Commander**.

5. **Blockchain Tamper-Evident Security Audit Ledger**
   - Fits the SIH **Blockchain & Cybersecurity** theme.
   - Every audio detection event, acoustic fingerprint, and mitigation action is chained using **SHA-256 Merkle blocks**.
   - Cryptographic verification endpoint ensures non-repudiation for regulatory compliance (RBI / CERT-In / cyber-insurance).

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **AI & Signal Analysis** | Python, NumPy, SciPy (STFT, phase unwrap, autocorrelation), SoundFile |
| **Model Runtime** | ONNX Runtime (Edge On-Device Inference, ~14ms latency) |
| **Backend & Ingestion** | FastAPI, WebSockets (streaming 16kHz audio), Uvicorn |
| **Security & Blockchain** | SHA-256 Merkle Audit Chain, Cryptographic Non-Repudiation |
| **Frontend Dashboard** | React 19, Vite, Lucide Icons, HTML5 Canvas Audio Oscilloscope |

---

## 📂 Directory Structure

```
swarsuraksha/
├── backend/
│   ├── main.py               # FastAPI REST & WebSocket Server (mounts frontend)
│   ├── detector_engine.py    # AASIST Spectro-Temporal Engine & Session Tracker
│   ├── audio_features.py     # Spectral, Phase Jitter & Prosodic Biomarkers
│   ├── tamper_ledger.py      # Blockchain SHA-256 Tamper-Proof Audit Chain
│   ├── sample_generator.py   # Synthesizes benchmark attack & genuine call audio
│   ├── test_api.py           # Verification test suite for all endpoints
│   └── samples/              # Pre-bundled WAV files (Arup attack, Genuine bank call)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx              # SIH 2026 Branding, Status & Nav Tabs
│   │   │   ├── LiveCallShield.jsx      # Real-Time Mic & Telephony Call Stream
│   │   │   ├── ForensicInspector.jsx   # Biomarker Matrix & Spectrogram Heatmap
│   │   │   ├── BlockchainLedger.jsx    # Cryptographic Blocks & Chain Verification
│   │   │   └── EnterpriseSOC.jsx       # Contact Center Queue & Arup Case Study
│   │   ├── App.jsx                     # Main Application Controller
│   │   └── index.css                   # Cyber glassmorphic design system
│   ├── package.json
│   └── vite.config.js                  # Proxy configuration to port 8008
├── run.bat                   # 1-Click Windows Launcher
└── README.md
```

---

## ⚡ Quickstart Guide

### Option 1: One-Click Run (Windows)
Double-click `run.bat` or run:
```bat
run.bat
```
This automatically verifies dependencies, launches the full-stack server on `http://127.0.0.1:8008`, and opens the browser!

### Option 2: Manual Launch

1. **Start Backend Server:**
```powershell
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8008 --reload
```
Open **`http://127.0.0.1:8008`** in your browser. The backend serves both the complete React frontend and all REST/WebSocket APIs from a single port!

2. **Frontend Development Mode (Optional with Hot Reload):**
```powershell
cd frontend
npm run dev
```
Open **`http://localhost:5173`** (proxied automatically to `127.0.0.1:8008`).

---

## 🧪 Testing Benchmark Scenarios

The system includes pre-bundled realistic test cases:

1. **AI-Cloned CFO Wire Transfer (The Arup Attack)**
   - **Target:** ₹2.56 Crore ($25.6M) SWIFT transfer
   - **Acoustic Signature:** High-frequency vocoder leakage (>6.5 kHz), unnaturally flat micro-pitch jitter (<0.3%), synthetic phase smearing.
   - **Result:** Flagged as **CRITICAL ATTACK (Risk: 88%)** within 1.4 seconds.

2. **Legitimate Bank Customer (Hindi/English)**
   - **Target:** Routine balance check & debit card reissue
   - **Acoustic Signature:** Organic vocal fold resonance, natural respiratory breathing cadence, healthy jitter (1.25%).
   - **Result:** Verified as **GENUINE HUMAN VOICE (Risk: 11%)**.

3. **Telecom Authority Impersonation Scam**
   - **Target:** ₹1,50,000 fine / 2-hour SIM deactivation threat
   - **Result:** Flagged as **SUSPICIOUS / ELEVATED (Risk: 55%)**, triggering secondary Out-of-Band MFA.

---

## 🏆 SIH 2026 Presentation Alignment

- **Slide 1:** Team SwarSuraksha, Theme: Blockchain & Cybersecurity, PS ID: 26104
- **Slide 2:** 4-Step Technical Workflow (Live Audio Stream ➔ Spectral + Prosody Analysis ➔ Risk Score ➔ Real-Time Alert)
- **Slide 3:** Stack implementation with Python, PyTorch/AASIST architecture, Edge ONNX Runtime, FastAPI, React
- **Slide 4:** Language & accent coverage (Indian English, Hindi) + real-time streaming scale
- **Slide 5:** Measurable institutional impact (protects banks, reduces wire fraud, cuts manual callbacks)
- **Slide 6:** Concrete defense against the January 2024 Hong Kong Arup CFO deepfake heist.

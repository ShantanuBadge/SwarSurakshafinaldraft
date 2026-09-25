# SwarSuraksha Model Architecture

File: `swarsuraksha_aasist.onnx`

## Specifications
- **Model Type:** AASIST-Lite Spectro-Temporal Neural Network
- **IR Version:** ONNX IR v9 / Opset 14
- **Input Dimension:** `[1, 16]` (Standardized spectro-temporal and biomarker acoustic features)
- **Output Dimension:** `[1, 2]` (Softmax Logits: `[P(Human), P(AI_Clone)]`)
- **Latency:** ~12.8 ms (Edge CPU)
- **Deployment Footprint:** < 5 KB

## Feature Inputs (16-D Vector)
1. High-Frequency Spectral Energy Ratio (>6500 Hz)
2. Normalized Spectral Centroid
3. Spectral Rolloff (85% power threshold)
4. Wiener Entropy (Spectral Flatness)
5. Phase Discontinuity Index
6. Autocorrelation Pitch ($F_0$ Mean)
7. Pitch Variation ($F_0$ Standard Deviation)
8. Pitch Range ($F_0$ Max - Min)
9. Local Pitch Micro-Jitter (% cycle-to-cycle perturbation)
10. Jitter Absolute Perturbation
11. Local Energy Shimmer (% amplitude perturbation)
12. Shimmer dB
13. Harmonic-to-Noise Ratio (HNR)
14. Temporal Zero-Crossing Rate
15. Root Mean Square (RMS) Energy Dynamic Range
16. Spectral Flux

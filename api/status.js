export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    status: "ONLINE",
    system: "SwarSuraksha Voice Detector",
    engine: "AASIST Spectro-Temporal Model (Edge & Serverless)",
    models: [
      "Neural Vocoder Phase Detector (>6.5 kHz)",
      "Vocal Fold Jitter & Prosody Biomarker Tracker",
      "Spectro-Temporal Graph Anomaly Classifier"
    ],
    deployment: "Vercel Edge / Serverless Cloud"
  });
}

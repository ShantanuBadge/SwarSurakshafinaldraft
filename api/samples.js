export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const samples = [
    {
      id: "natural_human_voice",
      title: "Natural Human Speech",
      speaker: "Conversational Human Voice",
      type: "Authentic Voice",
      description: "Organic human voice with natural vocal fold micro-tremor, dynamic pitch variation, and healthy breathing rhythm.",
      audio_url: "/samples/natural_human_voice.wav",
      expected_verdict: "GENUINE_HUMAN_VOICE",
      expected_threat: "AUTHENTIC",
      risk_score: 4.0,
      human_likeness: 96.0,
      vocoder_artifact: 0.02,
      jitter: 1.02
    },
    {
      id: "ai_cloned_voice",
      title: "AI Cloned Voice (Neural Synthesis)",
      speaker: "Deepfake Voice Clone",
      type: "Synthetic Clone",
      description: "AI voice clone exhibiting neural vocoder phase smearing, elevated high-frequency harmonics, and unnatural pitch micro-invariance.",
      audio_url: "/samples/ai_cloned_voice.wav",
      expected_verdict: "AI_CLONE_IMPERSONATION_DETECTED",
      expected_threat: "CRITICAL",
      risk_score: 98.0,
      human_likeness: 2.0,
      vocoder_artifact: 0.80,
      jitter: 0.99
    },
    {
      id: "synthetic_speech_bot",
      title: "Automated Synthetic Speech",
      speaker: "AI Text-to-Speech Engine",
      type: "AI Voicebot",
      description: "Synthesized voice with monotonic cadence, robotic micro-jitter, and synthetic phoneme concatenation boundaries.",
      audio_url: "/samples/synthetic_speech_bot.wav",
      expected_verdict: "SUSPICIOUS_VOICE_ACTIVITY",
      expected_threat: "ELEVATED",
      risk_score: 68.0,
      human_likeness: 32.0,
      vocoder_artifact: 0.45,
      jitter: 0.41
    },
    {
      id: "koustav_voice_clone",
      title: "Real Voice Clone (Mobile)",
      speaker: "Koustav AI Clone",
      type: "Synthetic Clone",
      description: "Real-world mobile voice clone exhibiting neural vocoder high-frequency overtone leaks and phase smearing.",
      audio_url: "/samples/koustav_voice_clone.mp3",
      expected_verdict: "AI_CLONE_IMPERSONATION_DETECTED",
      expected_threat: "CRITICAL",
      risk_score: 85.0,
      human_likeness: 15.0,
      vocoder_artifact: 0.586,
      jitter: 1.53
    },
    {
      id: "natural_recording_human",
      title: "Natural Voice Memo (M4A)",
      speaker: "Real Human Voice",
      type: "Authentic Voice",
      description: "Authentic voice recording with natural acoustic vocal tract resonance and healthy vocal fold micro-tremors.",
      audio_url: "/samples/natural_recording_human.m4a",
      expected_verdict: "GENUINE_HUMAN_VOICE",
      expected_threat: "AUTHENTIC",
      risk_score: 4.0,
      human_likeness: 96.0,
      vocoder_artifact: 0.02,
      jitter: 1.56
    }
  ];

  return res.status(200).json(samples);
}

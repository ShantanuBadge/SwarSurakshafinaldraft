import urllib.request
import json
import os

boundary = "----TestBoundary987"

def test_file(file_path, speaker_name):
    if not os.path.exists(file_path):
        print(f"[!] File not found: {file_path}")
        return
    audio_bytes = open(file_path, "rb").read()
    body = (
        f"--{boundary}\r\n"
        f"Content-Disposition: form-data; name=\"file\"; filename=\"{os.path.basename(file_path)}\"\r\n"
        f"Content-Type: audio/octet-stream\r\n\r\n"
    ).encode("utf-8") + audio_bytes + (
        f"\r\n--{boundary}\r\n"
        f"Content-Disposition: form-data; name=\"speaker_name\"\r\n\r\n"
        f"{speaker_name}\r\n"
        f"--{boundary}--\r\n"
    ).encode("utf-8")

    req = urllib.request.Request(
        "http://127.0.0.1:8008/api/analyze/file",
        data=body,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}
    )
    res = json.loads(urllib.request.urlopen(req).read())
    print(f"[OK] {os.path.basename(file_path)}:")
    print(f"    Verdict: {res['verdict_label']}")
    print(f"    AI Probability: {res['risk_score_percent']}% | Human Likeness: {res['human_likeness_percent']}%")
    print(f"    Vocoder Artifact: {(res['biomarkers']['vocoder_artifact_score']*100):.1f}% | Jitter: {res['biomarkers']['jitter_percent']}%")


print("=" * 60)
print("TESTING SWARSURAKSHA AI DETECTION ON REAL USER FILES:")
print("=" * 60)

backend_dir = os.path.dirname(__file__)
samples_dir = os.path.join(backend_dir, "samples")
root_dir = os.path.abspath(os.path.join(backend_dir, ".."))

# Test real-world samples from backend/samples
koustav_path = os.path.join(samples_dir, "koustav_voice_clone.mp3") if os.path.exists(os.path.join(samples_dir, "koustav_voice_clone.mp3")) else os.path.join(root_dir, "Koustav Voice Clone.mp3.mpeg")
m4a_path = os.path.join(samples_dir, "natural_recording_human.m4a") if os.path.exists(os.path.join(samples_dir, "natural_recording_human.m4a")) else os.path.join(root_dir, "Recording (5).m4a")

test_file(koustav_path, "Real Voice Clone (Koustav)")
test_file(m4a_path, "Natural Human Voice (Recording 5)")
test_file(os.path.join(samples_dir, "ai_cloned_voice.wav"), "Benchmark AI Clone (ElevenLabs)")
test_file(os.path.join(samples_dir, "natural_human_voice.wav"), "Benchmark Natural Human")
print("=" * 60)

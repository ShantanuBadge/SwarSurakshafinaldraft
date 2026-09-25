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

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
test_file(os.path.join(root_dir, "Koustav Voice Clone.mp3.mpeg"), "Koustav AI Clone")
test_file(os.path.join(root_dir, "Recording (5).m4a"), "Real Human Recording")
backend_dir = os.path.dirname(__file__)
test_file(os.path.join(backend_dir, "samples", "ai_cloned_voice.wav"), "Benchmark AI Clone")
test_file(os.path.join(backend_dir, "samples", "natural_human_voice.wav"), "Benchmark Natural Human")
print("=" * 60)

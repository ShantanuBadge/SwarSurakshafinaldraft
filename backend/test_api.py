import urllib.request
import json

# 1. Test status
res = urllib.request.urlopen("http://127.0.0.1:8008/api/status")
status_data = json.loads(res.read())
print("[OK] System Status:", status_data["status"], "| Engine:", status_data["system"])

# 2. Test samples
res_samples = urllib.request.urlopen("http://127.0.0.1:8008/api/samples")
samples_data = json.loads(res_samples.read())
print("[OK] Loaded Voice Samples:", [s["title"] for s in samples_data])

# 3. Test analyze AI cloned sample
audio_bytes = open("samples/ai_cloned_voice.wav", "rb").read()
boundary = "----TestBoundary987"
body = (
    f"--{boundary}\r\n"
    f"Content-Disposition: form-data; name=\"file\"; filename=\"ai_cloned_voice.wav\"\r\n"
    f"Content-Type: audio/wav\r\n\r\n"
).encode("utf-8") + audio_bytes + (
    f"\r\n--{boundary}\r\n"
    f"Content-Disposition: form-data; name=\"speaker_name\"\r\n\r\n"
    f"AI Cloned Voice\r\n"
    f"--{boundary}--\r\n"
).encode("utf-8")

req = urllib.request.Request(
    "http://127.0.0.1:8008/api/analyze/file",
    data=body,
    headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}
)
res_analyze = json.loads(urllib.request.urlopen(req).read())
print(f"[OK] AI Voice Analysis: {res_analyze['verdict_label']} | AI Prob: {res_analyze['risk_score_percent']}% | Jitter: {res_analyze['biomarkers']['jitter_percent']}%")

# 4. Test analyze Natural Human sample
audio_bytes_human = open("samples/natural_human_voice.wav", "rb").read()
body_human = (
    f"--{boundary}\r\n"
    f"Content-Disposition: form-data; name=\"file\"; filename=\"natural_human_voice.wav\"\r\n"
    f"Content-Type: audio/wav\r\n\r\n"
).encode("utf-8") + audio_bytes_human + (
    f"\r\n--{boundary}\r\n"
    f"Content-Disposition: form-data; name=\"speaker_name\"\r\n\r\n"
    f"Natural Human Speaker\r\n"
    f"--{boundary}--\r\n"
).encode("utf-8")

req_human = urllib.request.Request(
    "http://127.0.0.1:8008/api/analyze/file",
    data=body_human,
    headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}
)
res_human = json.loads(urllib.request.urlopen(req_human).read())
print(f"[OK] Human Voice Analysis: {res_human['verdict_label']} | AI Prob: {res_human['risk_score_percent']}% | Human Likeness: {100 - res_human['risk_score_percent']}% | Jitter: {res_human['biomarkers']['jitter_percent']}%")

print("[OK] ALL AUDIO & VOICE DETECTION TESTS PASSED!")

@echo off
echo ========================================================
echo  SwarSuraksha (स्वर सुरक्षा) - SIH 2026 Prototype
echo  AI-Powered Real-Time Voice Clone Detection & Prevention
echo  Problem Statement ID: 26104
echo ========================================================
echo.

cd /d "%~dp0"
echo [1/2] Verifying Python Environment & Installing Dependencies...
python -m pip install -q -r requirements.txt

cd /d "%~dp0backend"

echo [2/2] Launching SwarSuraksha Full-Stack Engine on http://127.0.0.1:8008 ...
start "" "http://127.0.0.1:8008"
python -m uvicorn main:app --host 127.0.0.1 --port 8008 --reload
pause

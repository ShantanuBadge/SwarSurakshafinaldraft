@echo off
echo ========================================================
echo  Pushing SwarSuraksha to GitHub:
echo  https://github.com/rriteshhkkumarr-del/SwarSuraksha.git
echo ========================================================
echo.

cd /d "%~dp0"
git remote remove origin 2>nul
git remote add origin https://github.com/rriteshhkkumarr-del/SwarSuraksha.git
git branch -M main
git push -u origin main

echo.
pause

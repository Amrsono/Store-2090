@echo off
REM Quick Save Script - Commits changes with WIP message
REM Use this when you want to save progress without a detailed message

echo.
echo ========================================
echo   Quick Save - Work In Progress
echo ========================================
echo.

git add .
git commit -m "WIP: Save progress - %date% %time%"
git push

if errorlevel 1 (
    echo ❌ Save failed!
) else (
    echo ✅ Progress saved to GitHub!
)

pause

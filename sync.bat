@echo off
REM Quick Git Sync Script for Cyber Fashion Store
REM This script will add, commit, and push all changes to GitHub

echo.
echo ========================================
echo   Cyber Fashion - Git Sync Tool
echo ========================================
echo.

REM Check if there are any changes
git status --short
if errorlevel 1 (
    echo Error: Not a git repository
    pause
    exit /b 1
)

echo.
echo Checking for changes...
git diff --quiet
if errorlevel 1 (
    echo Changes detected!
) else (
    echo No changes to commit.
    pause
    exit /b 0
)

echo.
set /p commit_msg="Enter commit message (or press Enter for default): "

if "%commit_msg%"=="" (
    set commit_msg=chore: Auto sync changes
)

echo.
echo Adding all changes...
git add .

echo.
echo Committing with message: %commit_msg%
git commit -m "%commit_msg%"

echo.
echo Pushing to GitHub...
git push

if errorlevel 1 (
    echo.
    echo ❌ Push failed! Please check your internet connection or resolve conflicts.
    pause
    exit /b 1
) else (
    echo.
    echo ✅ Successfully synced with GitHub!
    echo.
    echo Repository: https://github.com/Amrsono/Store-2090
    echo.
)

pause

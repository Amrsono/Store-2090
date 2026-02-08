@echo off
REM Check Git Status - See what files have changed

echo.
echo ========================================
echo   Git Status Check
echo ========================================
echo.

git status

echo.
echo ========================================
echo   Recent Commits
echo ========================================
echo.

git log --oneline -5

echo.
echo ========================================
echo   Branch Information
echo ========================================
echo.

git branch -vv

echo.
pause

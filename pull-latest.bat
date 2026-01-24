@echo off
REM Pull Latest Changes from GitHub

echo.
echo ========================================
echo   Pull Latest Changes
echo ========================================
echo.

echo Fetching latest changes from GitHub...
git fetch

echo.
echo Pulling changes...
git pull

if errorlevel 1 (
    echo.
    echo ❌ Pull failed! You may have local changes that conflict.
    echo.
    echo Try running: git stash
    echo Then: git pull
    echo Then: git stash pop
) else (
    echo.
    echo ✅ Successfully updated from GitHub!
)

echo.
pause

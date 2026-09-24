@echo off
REM ---------------------------------------------------------------
REM  Refresh the dashboard from the e-Campus calendar feed.
REM  No login, no human. Safe to run unattended.
REM
REM  ASCII ONLY - do not put Korean in this file. cmd.exe reads .bat
REM  bytes through the console code page, so non-ASCII here breaks
REM  command parsing. Korean paths are handled inside sync.py.
REM
REM  Register a daily task (no admin rights needed):
REM    schtasks /create /tn "deadline-dashboard" /tr "\"%~f0\" auto" /sc daily /st 07:43
REM  Remove it:
REM    schtasks /delete /tn "deadline-dashboard" /f
REM  Check it now: double-click this file.
REM ---------------------------------------------------------------

cd /d "%~dp0"
set PYTHONIOENCODING=utf-8

python sync.py --html >> sync.log 2>&1
if errorlevel 1 goto failed

echo [%date% %time%] ok >> sync.log
if "%~1"=="" (
  echo Dashboard updated.
  timeout /t 3 >nul
)
exit /b 0

:failed
echo [%date% %time%] FAILED >> sync.log
if "%~1"=="" (
  echo Update failed. See sync.log
  pause
)
exit /b 1

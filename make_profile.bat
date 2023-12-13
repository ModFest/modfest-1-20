@echo off
setlocal

set SOURCE_FOLDER=profile
set ZIP_FILE=profile.zip

powershell Compress-Archive -Force profile/* profile.zip

echo Done
endlocal

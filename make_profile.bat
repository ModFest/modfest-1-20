@echo off
setlocal

set SOURCE_FOLDER=profile
set ZIP_FILE=profile.zip

if exist "%ZIP_FILE%" del "%ZIP_FILE%"

tar -czf "%ZIP_FILE%" "%SOURCE_FOLDER%"

echo Done
endlocal

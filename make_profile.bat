@echo off
setlocal

set SOURCE_FOLDER=profile
set ZIP_FILE=profile.zip

powershell Compress-Archive -Force profile/* "Modfest 1.20 - Sky and Sea.zip"

echo Done
endlocal

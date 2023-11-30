@echo off
setlocal enabledelayedexpansion

set "counter=1"
for %%F in (%*) do (
    ren "%%F" "!counter!_%%~nxF"
    set /a "counter+=1"
)

echo Files renamed successfully.

endlocal

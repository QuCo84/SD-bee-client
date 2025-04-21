@echo off
setlocal
@set "rootFolder=reports"
@set "fileMask=*.txt"
@set uncompletedcount=0
@set nokocount=0
@set filecount=0
for %%F in ("%rootFolder%\%fileMask%") do (
    @set /a filecount=filecount+1
    findstr /l "Test completed" "%%F" >nul || @set /a uncompletedcount=uncompletedcount+1
    findstr /l "KO" "%%F" >nul || @set /a nokocount=nokocount+1
    findstr /l "Test completed" "%%F" >nul || echo %%F uncompleted!
    findstr /l "KO" "%%F" >null && echo %%F has KO

)
echo %filecount% reports found
echo %uncompletedcount% uncompleted reports
@set /a koreports=%filecount%-%nokocount%
echo %koreports% reports with KO
if %uncompletedcount% GTR 1 exit /b 3
if %nokocount% NEQ %filecount%  exit /b 4
prompt( "Continue");
exit /b 0
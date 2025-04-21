REM "& ^" to continue after error "&& ^" to stop after error
REM Test
REM cd tests
REM call testall
REM call checktests
REM cd ../build
cd build
(set /p version=)<"..\app\config\version.txt"
call buildmin
cd ..
echo %version%
copy ude-min.js ude-min%version%.js


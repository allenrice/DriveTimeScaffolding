echo "Starting Gulp Restore / Build"

IF EXIST node_modules (IF NOT "%~2" == "true" GOTO AFTERNPM)
echo "calling npm install"
call npm install
:AFTERNPM


IF EXIST src\bower_modules (IF NOT "%~2" == "true" GOTO AFTERBOWER)
echo "calling bower install for src"
call node node_modules\bower\bin\bower install
:AFTERBOWER

IF EXIST src\test\bower_modules (IF NOT "%~2" == "true" GOTO AFTERTESTBOWER)
echo "calling bower install for test"
cd src\test
call node ..\..\node_modules\bower\bin\bower install
cd ..\..
:AFTERTESTBOWER

echo "calling gulp with the task: %1" 
call node node_modules\gulp\bin\gulp %1

echo "Ending Gulp Restore / Build"

:END
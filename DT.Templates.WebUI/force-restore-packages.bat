REM Normally on build, pre-build.bat will restore your packages for you, but if for any reason this does not work, feel free to 
REM run this file which will force npm and bower to pull down all your packages for you

call pre-build.bat restore true
pause
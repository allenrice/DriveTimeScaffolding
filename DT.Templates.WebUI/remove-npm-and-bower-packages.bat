echo "Removing all traces of npm and bower modules"

cd src
call rimraf bower_modules

cd test
call rimraf bower_modules

cd ..\..

call npm prune --production
call npm prune --production
call npm prune --production

rd node_modules /s /q

pause
#!/bin/bash
ls
cd src/main/client/expenses || exit
echo 'Building front'

npm  run build

echo 'Copying front files'
cp -rf  build/* ../../resources/prod/


echo 'Building backend'
cd ../../
sbt "docker:publishLocal"

docker tag payments:0.1 registry.heroku.com/prv-expenses/web:latest && docker push registry.heroku.com/prv-expenses/web:latest && heroku container:release web






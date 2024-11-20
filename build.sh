#!/bin/bash

if [ -f .env ];
then
    export $(echo $(cat .env | sed 's/#.*//g'| xargs) | envsubst)
fi

if [[ -z "${IBM_API_KEY}" ]]; then
  echo "Error: IBM_API_KEY is not defined in .env file"
  exit 1
fi

git pull

VERSION=$(cat package.json | grep '"version"' | head -n 1 | awk '{print $2}' | sed 's/"//g; s/,//g')
echo $VERSION
TAG="v${VERSION}"
echo $TAG
echo "Creating TAG with ${TAG} started"

# login with api-key

ibmcloud login --apikey $IBM_API_KEY

ibmcloud cr login

if ibmcloud cr image-list --format "{{ .Repository }}:{{ .Tag }}" | grep us.icr.io/nuarcallc/db-con:$TAG; then
  echo "Error: You already have this tag with same package.json version, At least update the patch level."
  exit 1
fi

docker build --no-cache -t us.icr.io/nuarcallc/db-con:$TAG .

docker images 

docker push us.icr.io/nuarcallc/db-con:$TAG

ibmcloud cr images
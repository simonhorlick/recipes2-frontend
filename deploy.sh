#!/bin/bash

set -ex

npm run build

rsync -r --progress --exclude="node_modules" . sg.horlick.me:/tmp/recipes2-frontend

#!/usr/bin/env sh

set -e

# git branch -D old-master
# git branch -m master old-master
# git branch -m deploy master
git checkout master
git merge deploy

git push origin master

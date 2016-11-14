#!/usr/bin/env sh

set -e

git branch -D old-master
git branch -m master old-master
git branch -m deploy master

git push origin -f master

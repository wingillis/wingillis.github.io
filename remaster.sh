#!/usr/bin/env sh

set -e

git checkout  master
git merge -X theirs deploy

# sync upstream changes
git pull origin master

# push local changes upstream
git push origin master

# go back to editing branch
git checkout drafts

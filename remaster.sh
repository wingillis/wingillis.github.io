#!/usr/bin/env sh

# I'll need to fix this to handle merging and shit

# THIS DOESN'T WORK EITHER

set -e

git branch -d master
git checkout -b master
#git merge -X theirs deploy

# sync upstream changes
# git pull origin master

# push local changes upstream
git push origin master

# go back to editing branch
git checkout drafts

#!/usr/bin/env sh

# make sure you are in the deploy branch

set -e

# git checkout master
git checkout deploy
# git merge -X theirs deploy

# sync upstream changes
git merge -s ours master

git checkout master

git merge deploy

# push local changes upstream
git push origin master

# go back to editing branch
git checkout drafts

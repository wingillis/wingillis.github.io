#!/usr/bin/env sh

# PATH=$PATH:$HOME/.gem/ruby/2.3.0/bin
set -e

if [ `git branch | grep deploy` ]
then
	git branch -D deploy
fi

git checkout -b deploy

bundle exec jekyll build

find . -maxdepth 1 ! -name '*.sh' ! -name 'node_modules' ! -name '_site' ! -name '.git' ! -name '.gitignore' -exec rm -rf {} \;

mv _site/* .
rm -R _site/

git add --all
git commit

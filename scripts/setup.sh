#!/bin/sh

mkdir library
mkdir starters
touch intents.csv
cp node_modules/friendos-remote/library/* library/ 
cp node_modules/friendos-remote/starters/* starters/ 
npm install superagent --save
cp node_modules/friendos-remote/intents.csv intents.csv
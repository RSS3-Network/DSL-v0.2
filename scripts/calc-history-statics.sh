#!/bin/sh

## Limit max number of history to process
## HISTORY_LIMIT="-10"

## History file
HISTORY_FILE="./statistics/history.json"

## Grab history data

echo -n '{' > $HISTORY_FILE

git log --date=iso --pretty=format:"%H|%cd" $HISTORY_LIMIT statistics/overall.json | awk -F '|' '{printf "\"" $2 "\": "; system("git show "$1":statistics/overall.json"); printf ","}' >> ./statistics/history.json

echo -n '}' >> $HISTORY_FILE

## Remove last comma

sed -i '$ s/,}$/}/' $HISTORY_FILE

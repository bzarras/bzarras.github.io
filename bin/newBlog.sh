#!/usr/bin/env bash

path=$(pwd)/static/blogposts
filename=$path/$(date "+%Y-%m-%d").md
touch $filename
echo "Created $filename"

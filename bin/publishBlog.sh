#!/usr/bin/env bash

git add static/blogposts/* blog/*
now=$(date)
git commit -m "publish blog post at $now"
git push

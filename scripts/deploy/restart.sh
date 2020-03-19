#!/usr/bin/env bash

./node_modules/.bin/forever stop index.js || true
./node_modules/.bin/forever start index.js

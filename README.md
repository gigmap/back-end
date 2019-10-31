# GigMap API

[![CircleCI](https://circleci.com/gh/gigmap/back-end.svg?style=svg)](https://circleci.com/gh/gigmap/back-end)
[![Coverage Status](https://coveralls.io/repos/github/gigmap/back-end/badge.svg?branch=master)](https://coveralls.io/github/gigmap/back-end?branch=master)

## Config
Environment variables for the app config:
 * SONGKICK_API_KEY - required
 * FRONTEND_ORIGIN - required, web app origin for CORS
 * SONGKICK_BASE_URL - not required, set by default
 * MAX_TIME_PERIOD - not required, unlimited by default; max time period (in days) 
 user can request concerts for 
 * MAX_REQUEST_SIZE - not required, 5mb by default; max size of json data accepted
 * PORT - not required, 4000 by default

## Run for Development
```npm
npm i
npm run dev
```

## Run in Docker
```docker
docker build --build-arg SONGKICK_API_KEY=<KEY> -t <NAME> .
docker run -p <PORT:PORT> <NAME>
```
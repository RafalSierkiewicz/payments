#!/bin/bash

docker-compose -f docker/docker-compose-dev.yml pull && docker-compose -f docker/docker-compose-dev.yml up -d

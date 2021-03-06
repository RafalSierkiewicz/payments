#!/bin/bash

docker-compose -f docker/docker-compose-prod.yml pull && docker-compose -f docker/docker-compose-prod.yml up -d

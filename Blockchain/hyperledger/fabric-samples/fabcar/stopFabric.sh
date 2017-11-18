#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
docker rm -f $(docker ps -aq)
docker rmi -f $(docker image ls -a | grep "^dev-peer")
docker rmi -f $(docker image ls -a | grep "^<none>")
docker network prune
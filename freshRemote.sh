#!/bin/bash

yarn build

ssh joe@sjydzq.top "rm -rf /var/www/OpenMemorize/*"

scp -r build/* joe@sjydzq.top:/var/www/OpenMemorize/

rm -rf build

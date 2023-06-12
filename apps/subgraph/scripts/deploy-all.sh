#!/bin/bash

yarn deploy:mainnet && \
yarn deploy:arbitrum && \
yarn deploy:optimism && \
# yarn deploy:optimism-goerli && \
yarn deploy:matic && \
yarn deploy:mumbai && \
yarn deploy:base-goerli;
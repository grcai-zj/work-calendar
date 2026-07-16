#!/bin/bash
cd $(dirname $0)
pnpm install --frozen-lockfile
pnpm taro build --type h5

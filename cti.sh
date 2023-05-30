#!/bin/sh

npx cti './src' -i '*spec.ts' -b &&
rm './src/index.ts' &&
rm './src/@seedwork/index.ts' &&
rm './src/category/index.ts'
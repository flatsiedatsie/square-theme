#!/bin/bash

version=$(grep '"version":' manifest.json | cut -d: -f2 | cut -d\" -f2)

rm -rf SHA256SUMS package
rm -rf *.tgz
mkdir package
cp manifest.json LICENSE README.md package/
cp -r css js package/
cd package
find . -type f \! -name SHA256SUMS -exec sha256sum {} \; >> SHA256SUMS
cd ..

tar czf "square-theme-${version}.tgz" package
sha256sum "square-theme-${version}.tgz"

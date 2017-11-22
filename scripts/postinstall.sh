#!/bin/sh
cd ./node_modules/react-native-modalbox
patch -p1 < ../../scripts/patches/fix-backdrop.patch

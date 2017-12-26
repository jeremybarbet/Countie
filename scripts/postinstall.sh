#!/bin/sh
cd ./node_modules/react-native-navigation
patch -p1 < ../../scripts/patches/rcc-manager-module.patch

cd ../react-native
patch -p1 < ../../scripts/patches/fix-react-native.patch

cd ../react-native-swiper
patch -p1 < ../../scripts/patches/pagination-shown.patch

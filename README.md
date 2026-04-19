# myDV Speed Selector Build

This repository contains two deliverables:

- `myDV_V1.1.9_speed-selector.apk`
- `mydv-cookie-helper/`

## Upstream

The APK patch is based on:

- Repository: `https://github.com/mytv-android/myDV`
- Release APK: `myDV_V1.1.9_app-release.apk`

The app was unpacked locally and patched at the smali level from the decompiled workspace under `myDV_apktool/`.

## What Changed

### APK changes

- Added a default playback speed selector to the settings screen.
- The selector writes to the app's existing `playback_speed` preference so playback follows the chosen speed for all videos.
- The earlier unstable injection path was removed and replaced with a safer standalone selector path.

### Cookie helper changes

- Packaged the Douyin web login helper separately under `mydv-cookie-helper/`.
- Added `run-login.cmd` so the helper can be started by double-clicking on Windows.
- Kept the helper output file out of the packaged build so no live login cookie is included.

## Notes

- This APK is a re-signed build and cannot be installed over the original official-signed APK. Uninstall the original app first.
- `mydv-cookie-helper/` is intended to export a fresh cookie locally after login.
- `douyin-cookie-for-mydv.txt` is intentionally not included in this repository.

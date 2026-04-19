# myDV Speed Selector Build

This repository contains:

- `myDV_V1.1.9_speed-selector.apk`
- `mydv-cookie-helper/`

## Based On

This build is based on the original `myDV` project and its `V1.1.9` release APK:

- Upstream repository: `https://github.com/mytv-android/myDV`
- Original APK: `myDV_V1.1.9_app-release.apk`

## What Is Added Compared With The Original Build

This APK adds one practical TV feature that the original release does not provide:

- `Default playback speed` in Settings

After choosing a speed, all videos will start with that speed automatically.

Available options:

- `0.5x`
- `0.75x`
- `1.0x`
- `1.25x`
- `1.5x`
- `2.0x`
- `3.0x`

## Where To Find It

Open `myDV` on the TV, then go to:

- `Settings`
- `Default playback speed`

Pick the speed you want and the app will use it for later playback.

## What The Login Helper Is For

`mydv-cookie-helper/` is a small Windows helper for users who want to log into Douyin web first and then paste the exported cookie into `myDV`.

It is meant for this workflow:

1. Start the helper on a Windows PC.
2. Open the Douyin web login page.
3. Scan and log in.
4. Export the current login cookie to a local text file.
5. Copy that cookie into `myDV`.

## How To Use The Login Helper

Open the `mydv-cookie-helper` folder and double-click:

- `run-login.cmd`

It will open the browser login flow and then create:

- `douyin-cookie-for-mydv.txt`

After that:

1. Open the text file.
2. Copy the whole line.
3. Paste it into the `Cookie` input inside `myDV`.

## Files

- `myDV_V1.1.9_speed-selector.apk`: the patched TV APK
- `mydv-cookie-helper/`: the Windows helper used to get a fresh Douyin login cookie

## Important Notes

- This APK is re-signed, so it cannot be installed directly over the original official APK. Uninstall the original app first.
- No live login cookie is included in this repository.
- `douyin-cookie-for-mydv.txt` is generated locally after login and is ignored by Git.

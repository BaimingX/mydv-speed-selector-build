# myDV Cookie Helper

This tool does not modify the `myDV` APK.

It opens Douyin web login in a real desktop browser, waits for QR-code login,
then exports a `Cookie` header string that can be pasted into `myDV`.

## Run

From terminal:

```powershell
cd d:\tools\douyintv\mydv-cookie-helper
npm install
npm run login
```

Or double-click:

```text
run-login.cmd
```

The output file is:

```text
douyin-cookie-for-mydv.txt
```

## Notes

- The helper prefers local `Microsoft Edge` or `Google Chrome`.
- You can override the browser path with `PLAYWRIGHT_EXECUTABLE_PATH`.
- If Douyin does not open the QR-code login panel automatically, click the login button manually.

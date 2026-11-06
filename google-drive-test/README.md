# Google Drive test mode
This is a **separate proof of concept**, not the full admin-controlled MVP. The main branch remains the Cloudflare implementation.

## Setup (one-time Google authorization required)
1. Open https://script.google.com and create a project.
2. Paste the contents of Code.gs into the script editor.
3. Run `setup()` once and authorize Google Drive access. Copy the upload key from the execution log.
4. Run `createCleanupTrigger()` once and authorize the hourly cleanup trigger.
5. Deploy > New deployment > Web app; Execute as **Me**, Who has access **Anyone**. Copy the /exec URL.
6. In this branch's `google-drive-test/index.html`, replace the two CONFIG placeholders with the URL and upload key.
7. Configure GitHub Pages to publish from branch `google-drive-test` and folder `/google-drive-test` if offered. GitHub Pages supports branch root or /docs, so alternatively copy the test HTML into `docs/index.html` and select /docs.
8. Test a five-second recording from your phone.

## Limitations
The upload key is embedded in public frontend code and is **not secure**. This should be used only for limited, controlled testing. A publicly accessible Apps Script endpoint can be abused. The browser-based cooldown is not tamper-proof. Apps Script request limits and browser video formats vary. Cleanup moves files to trash rather than permanently removing them. Do not use this version at public events or for sensitive recordings.

# PhishGuard AI — Mobile Setup Guide

## Option 1: Gmail Add-on (Android + iOS)

This works inside the Gmail app on both Android and iPhone.

### Setup (One-time)

1. Go to [script.google.com](https://script.google.com)
2. Click **New Project**
3. Delete any default code
4. Copy the contents of `mobile/gmail-add-on/Code.gs` into the editor
5. Click the **Settings** icon (gear) → **Show "appsscript.json" manifest file**
6. Delete the default manifest, paste contents of `mobile/gmail-add-on/appsscript.json`
7. Click **Deploy** → **New deployment**
8. Choose **Add-on** → **Install for me**
9. Authorize when prompted
10. Open Gmail app → any email → look for PhishGuard in the sidebar

### How to Use

1. Open Gmail app on your phone
2. Tap any email to open it
3. Tap the **three dots** menu (bottom right on Android, top right on iOS)
4. Tap **PhishGuard AI**
5. The scan result appears in the sidebar

### Limitations
- Scans one email at a time (mobile sidebar shows current email only)
- Cannot scan inbox tab-by-tab like the desktop extension
- Requires internet connection

---

## Option 2: Kiwi Browser (Android only — Full Extension)

This gives you the FULL PhishGuard extension on Android, identical to desktop.

### Setup

1. Install **Kiwi Browser** from [Google Play Store](https://play.google.com/store/apps/details?id=com.nicemobilebrowser)
2. Open Kiwi Browser
3. Go to `chrome.google.com/webstore`
4. Search for "PhishGuard AI" (if published) OR:
   - Go to `chrome://extensions`
   - Enable **Developer mode** (top right)
   - Tap **Load unpacked**
   - Navigate to your PhishGuard extension folder
5. PhishGuard button appears in Gmail

### How to Use

1. Open Kiwi Browser
2. Go to `mail.google.com`
3. Log in to your Gmail account
4. Tap the PhishGuard button (bottom right)
5. Tap **Scan Emails** for the current tab
6. Results appear in the sidebar

### Limitations
- Only works in Kiwi Browser (not Chrome)
- No automatic updates (must manually reload extension)
- Must keep Kiwi Browser installed

---

## Which Option Should I Use?

| Feature | Gmail Add-on | Kiwi Browser |
|---------|-------------|--------------|
| Works on Android | Yes | Yes |
| Works on iOS | Yes | No |
| Scan inbox tabs | No (one email) | Yes (full scan) |
| Highlight risky text | No | Yes |
| Requires extra app | No (Gmail app) | Yes (Kiwi Browser) |
| Works offline | No | Partially |

# PhishGuard AI - Deployment Guide

## Quick Start

### Step 1: Generate Icons

1. Open `generate-icons.html` in Chrome
2. Click "Generate Icons" button
3. Right-click each icon and save as:
   - `icons/icon16.png`
   - `icons/icon48.png`
   - `icons/icon128.png`

### Step 2: Load Extension in Chrome

1. Open Chrome browser
2. Navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the `phishguard-extension` folder
6. The PhishGuard icon will appear in your toolbar

### Step 3: Test the Extension

1. Open `test-page.html` in Chrome
2. Click the PhishGuard icon to see analysis
3. Try the test links and forms
4. Check the popup for scan results

## Chrome Web Store Deployment

### Prerequisites

1. Chrome Developer Account ($5 one-time fee)
2. Extension ZIP file
3. Store listing assets (screenshots, descriptions)

### Create ZIP Package

```bash
# Windows PowerShell
Compress-Archive -Path "phishguard-extension\*" -DestinationPath "phishguard-extension.zip"
```

### Submit to Chrome Web Store

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Pay the one-time registration fee ($5)
3. Click "New Item"
4. Upload `phishguard-extension.zip`
5. Fill in store listing:
   - **Title**: PhishGuard AI - Phishing Detection
   - **Description**: AI-powered real-time phishing protection
   - **Category**: Security
   - **Language**: English
6. Add screenshots (1280x800 or 640x400)
7. Set visibility (Public or Unlisted)
8. Click "Publish"

### Store Listing Tips

- Use clear, benefit-focused description
- Include screenshots showing the popup and warnings
- Highlight key features:
  - Real-time URL scanning
  - Brand impersonation detection
  - One-click reporting
  - Privacy-focused (all processing local)

## Firefox Add-on Deployment

### Create Firefox Package

1. Install `web-ext` tool:
   ```bash
   npm install --global web-ext
   ```

2. Build the extension:
   ```bash
   cd phishguard-extension
   web-ext build
   ```

3. Submit to Firefox Add-ons:
   - Go to [addons.mozilla.org](https://addons.mozilla.org)
   - Create developer account
   - Upload the ZIP file

## Maintenance

### Regular Updates

- Update phishing databases monthly
- Add new suspicious TLDs as they emerge
- Update brand detection patterns
- Fix any bugs reported by users

### Monitoring

- Check Chrome Web Store dashboard for:
  - Install counts
  - User reviews
  - Crash reports
- Respond to user feedback promptly

## Version Control

Update `manifest.json` version for each release:

```json
{
  "version": "1.1.0"
}
```

Follow semantic versioning:
- **Major**: Breaking changes
- **Minor**: New features
- **Patch**: Bug fixes
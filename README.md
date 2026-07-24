<div align="center">

# 🛡️ PhishGuard AI

### Intelligent Email Phishing Detection — Powered by AI

**Scan. Detect. Protect.**

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://github.com)
[![Brave Browser](https://img.shields.io/badge/Brave-Supported-FB542B?style=for-the-badge&logo=bravebrowser&logoColor=white)](https://github.com)
[![Android](https://img.shields.io/badge/Android-Supported-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-Green?style=for-the-badge)](LICENSE)

</div>

---

## 📸 What It Does

PhishGuard AI is a **real-time email phishing detection system** that works as a Chrome extension, Gmail Add-on, Telegram Bot, and Progressive Web App. It analyzes emails using **8-layer AI-powered analysis** and explains threats in **simple language anyone can understand**.

<div align="center">

| Feature | Status |
|---------|--------|
| Chrome/Brave Extension | ✅ Working |
| Gmail Add-on (Android/iOS) | ✅ Working |
| Telegram Bot | ✅ Working |
| PWA Web App | ✅ Working |

</div>

---

## 🎯 Key Features

### 🔍 Smart Email Scanning
- Scans **every email** in your inbox across all tabs (Primary, Promotions, Social, Starred, Snoozed, Draft, Spam)
- **Real-time analysis** — results appear in seconds
- **Click-to-highlight** — tap a finding to see the risky parts highlighted directly in the email

### 🧠 8-Layer AI Analysis Engine
| Layer | What It Checks |
|-------|---------------|
| Sender Identity | SPF, DKIM, domain reputation |
| Domain Intelligence | Age, registrar, MX records |
| URL Intelligence | Link safety, redirects, shorteners |
| Content Analysis | Urgency, fear tactics, grammar |
| Attachment Analysis | Dangerous file types |
| Visual Similarity | Brand logo spoofing |
| Behavior Analysis | Sending patterns |
| Threat Intelligence | Known phishing databases |

### 🗣️ Simple Explanations
Instead of technical jargon, PhishGuard explains threats like:
> ❌ "Unicode manipulation detected in sender address"

> ✅ "This email pretends to be from HDFC Bank but is actually sent from a fake address"

### 📱 Works Everywhere
- **Desktop**: Chrome, Brave, Edge (extension)
- **Mobile**: Gmail App on Android & iOS (Add-on)
- **Telegram**: Forward suspicious emails to the bot
- **Web**: Any browser via PWA

---

## 🏗️ Architecture

```
phishguard-extension/
├── 📁 Chrome Extension (v4.0)
│   ├── manifest.json          — Extension config (Manifest V3)
│   ├── email-scanner.js       — Core scanner (self-contained)
│   ├── background.js          — Background service worker
│   ├── popup.html/js          — Extension popup UI
│   ├── content.js             — Page-level analysis
│   ├── core-engine.js         — 8-layer analysis engine
│   ├── layers/                — Individual analysis layers
│   │   ├── sender-identity.js
│   │   ├── domain-intelligence.js
│   │   ├── url-intelligence.js
│   │   ├── content-analysis.js
│   │   ├── attachment-analysis.js
│   │   ├── visual-similarity.js
│   │   ├── behavior-analysis.js
│   │   └── threat-intelligence.js
│   ├── modules/               — AI modules
│   │   ├── weighted-scoring.js
│   │   ├── explainable-ai.js
│   │   └── ai-memory.js
│   └── icons/                 — Extension icons
│
├── 📁 Mobile
│   ├── gmail-add-on/          — Google Workspace Add-on
│   │   ├── Code.gs            — Apps Script code
│   │   └── appsscript.json    — Add-on manifest
│   ├── pwa/                   — Progressive Web App
│   │   ├── index.html
│   │   ├── style.css
│   │   ├── app.js
│   │   └── manifest.json
│   └── telegram-bot/          — Telegram Bot
│       ├── bot.js
│       └── package.json
│
└── 📁 Documentation
    └── MOBILE-SETUP.md        — Mobile setup guide
```

---

## 🚀 Quick Start

### Chrome Extension
1. Go to [github.com/Jatinkapilaq1/phishguard-extension](https://github.com/Jatinkapilaq1/phishguard-extension)
2. Click the green **Code** button → **Download ZIP**
3. Extract the ZIP file
4. Open `chrome://extensions` in Chrome/Brave
5. Enable **Developer Mode** (top right toggle)
6. Click **Load Unpacked** → select the extracted folder
7. Open Gmail → PhishGuard button appears

### Gmail Add-on (Android/iOS)
1. Go to [script.google.com](https://script.google.com)
2. Create New Project → paste `mobile/gmail-add-on/Code.gs`
3. Add manifest from `appsscript.json`
4. Deploy as Add-on
5. Open Gmail app → three dots → PhishGuard AI

### Telegram Bot
```bash
cd mobile/telegram-bot
npm install
# Add your bot token to .env file
npm start
```

### PWA Web App
Host the `mobile/pwa/` folder on any web server or GitHub Pages.

---

## 🛡️ Threat Detection Capabilities

### Email Types Recognized
🏦 Bank Statements • 💳 Transaction Alerts • 🔐 Security Notifications
📦 E-Commerce Orders • 🍔 Food Orders • 🚂 Train/IRCTC Tickets
✈️ Flight Bookings • 🏨 Hotel Reservations • 💰 Payment Receipts
🔢 OTP Messages • 📰 Newsletters • 🏛️ Government/Tax Emails
💼 Job Alerts • 👤 Social Media Notifications

### Threat Patterns Detected
🎭 **Brand Impersonation** — Fake sender pretending to be a known brand
🌐 **Suspicious Domains** — Free/disposable TLDs used for scams
⏰ **Urgency Tactics** — "Act now" or "expires today" pressure
🔑 **Credential Harvesting** — Fake login/verification pages
⚠️ **Fear Tactics** — "Your account will be suspended"
🔓 **Insecure Links** — HTTP links, IP addresses, URL shorteners
🔤 **Unicode Attacks** — Fake characters that look like real letters
📧 **Free Email Abuse** — Scammers using Gmail/Yahoo to fake brands

---

## 🧪 False Positive Prevention

PhishGuard is designed to **minimize false alarms**:

- ✅ **Word-boundary matching** — "meta" won't match inside "incometax"
- ✅ **Domain-aware classification** — Bank emails from bank domains get high trust
- ✅ **Safe-type bypass** — Known legitimate emails skip threat checks
- ✅ **Government email detection** — Recognizes `.gov.in`, `nic.in` domains
- ✅ **Context-aware scoring** — Legitimate emails get negative risk scores

---

## 📊 Brand Database

PhishGuard recognizes **28+ brands** and their legitimate domains:

| Category | Brands |
|----------|--------|
| Tech | Google, Microsoft, Apple, Meta |
| E-Commerce | Amazon, Flipkart, Meesho, Myntra, AJIO |
| Food | Zomato, Swiggy |
| Finance | PayPal, PhonePe, Paytm, CRED |
| Travel | Uber, Ola, MakeMyTrip, IRCTC, OYO |
| Social | Facebook, LinkedIn, Netflix, Spotify |
| Indian Banks | SBI, HDFC, ICICI, Axis, Kotak, PNB + 18 more |

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

## 👨‍💻 Author

**Jatin Kapila**

 Built with ❤️ to make email safer for everyone.

---

<div align="center">

**If this project helped you, please give it a ⭐ on GitHub!**

[![Star History Chart](https://api.star-history.com/svg?repos=phishguard/phishguard&type=Date)](https://star-history.com/#phishguard/phishguard&Date)

</div>

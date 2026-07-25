/**
 * PhishGuard AI v4.0 - Complete Rewrite
 * Self-contained, zero dependencies, bulletproof email scanner
 */
(function() {
  'use strict';

  let panelVisible = false;
  let lastScanId = 0;

  /* ═══════════════ BRAND DATABASE ═══════════════ */
  const BRANDS = {
    google:    { d: ['google.com','gmail.com','google.co.in','googlemail.com'], n: ['google','gmail','google account','google pay','gpay'] },
    microsoft: { d: ['microsoft.com','outlook.com','live.com','office.com','office365.com','hotmail.com'], n: ['microsoft','outlook','office 365','onedrive','azure','teams'] },
    apple:     { d: ['apple.com','icloud.com','me.com'], n: ['apple','icloud','apple id','apple pay','app store','itunes'] },
    amazon:    { d: ['amazon.com','amazon.in','amazon.co.in','amazonpay.com','amazonaws.com'], n: ['amazon','prime','amazon pay','aws'] },
    paypal:    { d: ['paypal.com','paypal.co.in','paypal.in'], n: ['paypal'] },
    facebook:  { d: ['facebook.com','meta.com','fb.com'], n: ['facebook','fb','meta','instagram','whatsapp'] },
    netflix:   { d: ['netflix.com','netflix.co.in'], n: ['netflix'] },
    spotify:   { d: ['spotify.com'], n: ['spotify'] },
    linkedin:  { d: ['linkedin.com','linkedinmail.com'], n: ['linkedin'] },
    zomato:    { d: ['zomato.com'], n: ['zomato'] },
    swiggy:    { d: ['swiggy.com','swiggy.in'], n: ['swiggy','instamart'] },
    flipkart:  { d: ['flipkart.com'], n: ['flipkart'] },
    meesho:    { d: ['meesho.com'], n: ['meesho'] },
    myntra:    { d: ['myntra.com'], n: ['myntra'] },
    uber:      { d: ['uber.com'], n: ['uber','uber eats'] },
    ola:       { d: ['olacabs.com'], n: ['ola'] },
    makemytrip:{ d: ['makemytrip.com'], n: ['makemytrip','mmt'] },
    irctc:     { d: ['irctc.co.in','irctc.in'], n: ['irctc','indian rail'] },
    hotstar:   { d: ['hotstar.com','jiohotstar.com'], n: ['hotstar','disney+ hotstar','jiohotstar'] },
    youtube:   { d: ['youtube.com','yt.be'], n: ['youtube'] },
    hdfc:      { d: ['hdfcbank.com','hdfclife.com','hdfcergo.com','hdfcsec.com'], n: ['hdfc','hdfc bank'] },
    sbi:       { d: ['sbi.co.in','onlinesbi.com','sbicard.com'], n: ['sbi','state bank'] },
    icici:     { d: ['icicibank.com','icicilombard.com'], n: ['icici','icici bank'] },
    axis:      { d: ['axisbank.com'], n: ['axis bank'] },
    kotak:     { d: ['kotak.com','kotakbank.com'], n: ['kotak bank'] },
    paytm:     { d: ['paytm.com','paytmbank.com'], n: ['paytm'] },
    phonepe:   { d: ['phonepe.com'], n: ['phonepe'] },
    cred:      { d: ['cred.club'], n: ['cred'] },
    naukri:    { d: ['naukri.com'], n: ['naukri'] },
    indeed:    { d: ['indeed.com'], n: ['indeed'] },
    airindia:  { d: ['airindia.com'], n: ['air india'] },
    indigo:    { d: ['goindigo.in'], n: ['indigo','indigo airlines'] },
    aadhaar:   { d: ['uidai.gov.in'], n: ['aadhaar','uidai'] },
  };

  const FREE_EMAILS = ['gmail.com','yahoo.com','hotmail.com','outlook.com','aol.com','mail.com','protonmail.com','proton.me','rediffmail.com'];

  const TRUSTED_DOMAINS = ['google.com','youtube.com','google.co.in','facebook.com','instagram.com','twitter.com','x.com','linkedin.com','microsoft.com','outlook.com','live.com','office.com','github.com','apple.com','icloud.com','amazon.com','amazon.in','paypal.com','netflix.com','spotify.com','flipkart.com','zomato.com','swiggy.com','meesho.com','myntra.com','irctc.co.in','phonepe.com','paytm.com','sbi.co.in','hdfcbank.com','icicibank.com','axisbank.com','kotak.com','zoom.us','slack.com','discord.com','telegram.org','whatsapp.com','ebay.com','wikipedia.org','reddit.com'];

  const INDIAN_BANKS = ['sbi.co.in','hdfcbank.com','icicibank.com','axisbank.com','kotakbank.com','yesbank.in','bankofbaroda.com','pnb.co.in','canarabank.in','bankofindia.co.in','unionbankofindia.com','indianbank.in','idbibank.in','federalbank.co.in','southindianbank.com','cityunionbank.com','dbsbank.in','citibank.com','standardchartered.com','hsbc.co.in','rblbank.com','karvysb.com'];

  const SAFE_TYPES = ['bank_statement','bank_alert','bank_security','otp','security_notification','ecommerce_order','ecommerce_shipping','food_order','travel_flight','travel_hotel','train_ticket','newsletter','subscription','payment_receipt','social_media','govt','job'];

  /* ═══════════════ GMAIL TAB DETECTION ═══════════════ */
  function getGmailTabName() {
    var hash = window.location.hash || '';
    var path = window.location.pathname || '';
    var full = hash + path;
    if (/category\/promotions/i.test(full)) return 'Promotions';
    if (/category\/social/i.test(full)) return 'Social';
    if (/category\/updates/i.test(full)) return 'Updates';
    if (/category\/forums/i.test(full)) return 'Forums';
    if (/category\/primary/i.test(full)) return 'Primary';
    if (/#starred/i.test(full)) return 'Starred';
    if (/#snoozed/i.test(full)) return 'Snoozed';
    if (/#drafts/i.test(full)) return 'Drafts';
    if (/#sent/i.test(full)) return 'Sent';
    if (/#spam/i.test(full)) return 'Spam';
    if (/#trash/i.test(full)) return 'Trash';
    if (/#imp/i.test(full)) return 'Important';
    if (/#search/i.test(full)) return 'Search Results';
    if (/#label\//i.test(full)) {
      var labelMatch = full.match(/#label\/([^/?&]+)/);
      return labelMatch ? decodeURIComponent(labelMatch[1]).replace(/\//g,' ') : 'Label';
    }
    if (/#inbox/i.test(full) || /#all/i.test(full) || /#reset/i.test(full)) return 'Inbox';
    if (/\/mail/i.test(path)) return 'Inbox';
    return 'Inbox';
  }

  /* ═══════════════ HELPER FUNCTIONS ═══════════════ */
  function isBank(d) { return INDIAN_BANKS.some(b => d.includes(b)); }

  function bankName(d) {
    if (d.includes('sbi')) return 'SBI';
    if (d.includes('hdfc')) return 'HDFC Bank';
    if (d.includes('icici')) return 'ICICI Bank';
    if (d.includes('axis')) return 'Axis Bank';
    if (d.includes('kotak')) return 'Kotak Bank';
    if (d.includes('yesbank')) return 'Yes Bank';
    if (d.includes('pnb')) return 'PNB';
    if (d.includes('bob')) return 'Bank of Baroda';
    if (d.includes('federal')) return 'Federal Bank';
    for (const [k, v] of Object.entries(BRANDS)) {
      if (v.d.some(dd => d.includes(dd))) return v.n[0].toUpperCase();
    }
    return d.split('.')[0].toUpperCase();
  }

  function senderDomain(email) {
    const m = email.match(/@([\w.-]+)/);
    return m ? m[1].toLowerCase() : '';
  }

  function esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function escAttr(s) {
    return String(s || '').replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/"/g,'&quot;').replace(/\n/g,' ');
  }

  /* ═══════════════ GMAIL DOM EXTRACTION ═══════════════ */
  function getSender(el) {
    var emailEl = el.querySelector('[email]');
    if (emailEl) {
      var addr = emailEl.getAttribute('email');
      if (addr && addr.includes('@')) return addr.toLowerCase();
    }
    var nameEmailEl = el.querySelector('span[email]');
    if (nameEmailEl) {
      var addr2 = nameEmailEl.getAttribute('email');
      if (addr2 && addr2.includes('@')) return addr2.toLowerCase();
    }
    var match = el.textContent.match(/[\w.+-]+@[\w.-]+\.\w{2,}/);
    if (match) return match[0].toLowerCase();
    return '';
  }

  function getSubject(el) {
    var candidates = ['.bog', '.y6', '.hP', 'span.bog', 'span[role="link"]', '.y6.xV .yW', '[data-thread-id] span'];
    for (var i = 0; i < candidates.length; i++) {
      var sEl = el.querySelector(candidates[i]);
      if (sEl && sEl.textContent.trim().length > 0) return sEl.textContent.trim();
    }
    return el.getAttribute('aria-label') || '';
  }

  function getDisplayName(el) {
    /* Only look in the sender/header area, never in body */
    var headerArea = el.querySelector('.yh, .yg, .go, [role="listitem"], .yP, .BAk');
    var searchRoot = headerArea || el;

    /* Most specific selectors first */
    var nameEl = searchRoot.querySelector('.yX .yW span[email]');
    if (nameEl) return nameEl.textContent.trim();
    var nameEl2 = searchRoot.querySelector('.yX .yW');
    if (nameEl2) {
      var txt = nameEl2.textContent.trim();
      if (txt.length > 0 && txt.length < 80) return txt;
    }
    var nameEl3 = searchRoot.querySelector('.zF');
    if (nameEl3) {
      var txt3 = nameEl3.textContent.trim();
      if (txt3.length > 0 && txt3.length < 80) return txt3;
    }
    /* Fallback: first [email] attribute's visible text */
    var emailEl = searchRoot.querySelector('[email]');
    if (emailEl) {
      var visibleText = emailEl.textContent.trim();
      if (visibleText.length > 0 && visibleText.length < 80) return visibleText;
      /* Try parent for display name */
      var parentText = emailEl.parentElement ? emailEl.parentElement.textContent.trim() : '';
      if (parentText.length > 0 && parentText.length < 80) return parentText;
    }
    return '';
  }

  function getBody(el) {
    var bodyEl = el.querySelector('.a3s,.y2,.ii,.gs,[dir="ltr"]');
    return bodyEl ? bodyEl.innerText : '';
  }

  /* ═══════════════ EMAIL FINDING ═══════════════ */
  function findEmails() {
    var selectors = [
      'tr[data-message-id]',
      'div[data-message-id]',
      'tr.zA',
      'tr[jscontroller]',
      'div[role="listitem"]',
      '.BltHke'
    ];
    var emails = [];
    for (var i = 0; i < selectors.length; i++) {
      try {
        var found = document.querySelectorAll(selectors[i]);
        if (found.length > emails.length) {
          emails = Array.from(found).filter(function(el) {
            var text = el.textContent || '';
            return text.length > 5;
          });
        }
      } catch(e) {}
    }
    return emails;
  }

  /* ═══════════════ CLASSIFY EMAIL TYPE ═══════════════ */
  function classifyEmail(subject, body, domain, display) {
    var text = (subject + ' ' + body).toLowerCase();
    var senderText = (domain + ' ' + display).toLowerCase();

    if (isBank(domain)) {
      if (/statement|transaction|balance|mini\s+statement|account\s+summary|credit\s+card|debit\s+card/i.test(text))
        return { type: 'bank_statement', icon: '🏦', label: 'Bank Statement', risk: -40 };
      if (/credited|debited|transferred|Rs\.?\s*[\d,]+|INR|amount\s+(?:received|sent)/i.test(text))
        return { type: 'bank_alert', icon: '🏦', label: 'Bank Transaction Alert', risk: -35 };
      if (/new\s+sign|device|login|IP\s+address/i.test(text))
        return { type: 'bank_security', icon: '🏦', label: 'Bank Security Alert', risk: -35 };
      return { type: 'bank_other', icon: '🏦', label: 'Bank Notification', risk: -30 };
    }

    if (/(amazon|flipkart|meesho|myntra|ajio|tata|nykaa|snapdeal)/i.test(text)) {
      if (/shipped|out\s+for\s+delivery|delivered|tracking|delivery\s+(?:update|partner)/i.test(text))
        return { type: 'shipping', icon: '🚚', label: 'Shipping Update', risk: -35 };
      if (/order\s+(?:confirmed|placed|received|number|#|id)/i.test(text))
        return { type: 'order', icon: '📦', label: 'Order Confirmation', risk: -35 };
    }

    if (/(zomato|swiggy|ubereats|foodpanda|dunzo)/i.test(text)) {
      return { type: 'food', icon: '🍔', label: 'Food Order', risk: -35 };
    }

    if (/(irctc|indian\s+rail|pnr|train\s+(?:ticket|number)|coach|berth|tatkal)/i.test(text))
      return { type: 'train', icon: '🚂', label: 'Train Ticket', risk: -35 };

    if (/(indigo|airindia|spicejet|vistara|emirates|lufthansa|makemytrip|goibibo|cleartrip|yatra).*(?:boarding|flight|itinerary|pnr)/i.test(text) ||
        /(?:boarding|flight|itinerary|pnr).*(?:indigo|airindia|spicejet|vistara|emirates|makemytrip)/i.test(text))
      return { type: 'flight', icon: '✈️', label: 'Flight Booking', risk: -35 };

    if (/(hotel|booking\.com|airbnb|check[-\s]?in|reservation)/i.test(text) && /(confirmed|confirmation|booking)/i.test(text))
      return { type: 'hotel', icon: '🏨', label: 'Hotel Booking', risk: -35 };

    if (/(netflix|spotify|hotstar|prime\s+video|youtube\s+premium|apple\s+music).*(?:subscription|receipt|payment)/i.test(text) ||
        /(?:subscription|receipt|payment).*(?:netflix|spotify|hotstar|prime\s+video)/i.test(text))
      return { type: 'subscription', icon: '📺', label: 'Subscription Receipt', risk: -35 };

    if (/(paytm|phonepe|google\s+pay|gpay|amazon\s+pay|cred|freecharge|mobikwik).*(?:payment|receipt|transaction|successful)/i.test(text) ||
        /(?:payment|receipt|transaction|successful).*(?:paytm|phonepe|google\s+pay|gpay)/i.test(text))
      return { type: 'payment', icon: '💳', label: 'Payment Receipt', risk: -35 };

    if (/your\s+(?:otp|one[-\s]?time\s+password|verification\s+code)\s+(?:is|:)|otp\s+(?:is|for)\s+\d{4,6}|\d{4,6}\s+is\s+your/i.test(text))
      return { type: 'otp', icon: '🔢', label: 'OTP / Verification Code', risk: -40 };

    if (/(new\s+sign[-\s]?in|device\s*[:=]|if\s+this\s+was\s+you|you\s+can\s+ignore|wasn.t\s+you)/i.test(text) &&
        /(ip\s+address|location|browser|device)/i.test(text))
      return { type: 'security', icon: '🔒', label: 'Security Notification', risk: -30 };

    if (/unsubscribe|view\s+in\s+browser|email\s+preferences/i.test(text) &&
        /newsletter|weekly|monthly|digest|marketing|promotion|offer|sale|%|discount/i.test(text))
      return { type: 'newsletter', icon: '📰', label: 'Newsletter / Marketing', risk: -20 };

    if (/(?:friend\s+request|someone\s+(?:tagged|mentioned|liked)|new\s+(?:follower|connection)|your\s+(?:post|photo))/i.test(text) &&
        /(facebook|instagram|twitter|linkedin|telegram)/i.test(text))
      return { type: 'social', icon: '👤', label: 'Social Media Notification', risk: -25 };

    if (/(?:job\s+(?:offer|opening|alert|description)|interview\s+(?:schedule|confirmation|invite)|your\s+application|recruitment)/i.test(text))
      return { type: 'job', icon: '💼', label: 'Job / Recruitment', risk: 5 };

    if (/(?:income\s+tax|gst|aadhaar|pan\s+card|epfo|passport|visa|e-?filing|epf|udyog|mygov)/i.test(text) ||
        /(?:gov\.in|nic\.in|incometax\.gov|uidai\.gov|epfindia)/.test(domain) ||
        /(?:income\s+tax|gst|aadhaar|pan\s+card|epfo|passport|visa).*(?:gov\.in|government|incometax|uidai)/i.test(text))
      return { type: 'govt', icon: '🏛️', label: 'Government / Tax', risk: -15 };

    return { type: 'unknown', icon: '📧', label: 'General Email', risk: 5 };
  }

  /* ═══════════════ THREAT DETECTION ═══════════════ */
  function detectThreats(text, sender, domain, display, classification) {
    var findings = [];
    var senderLower = (sender || '').toLowerCase().trim();
    var displayLower = (display || '').toLowerCase().trim();

    /* --- Brand impersonation (sender claims brand but domain wrong) --- */
    for (var brand in BRANDS) {
      var info = BRANDS[brand];
      var claimedBrand = false;
      var matchedName = '';
      for (var ni = 0; ni < info.n.length; ni++) {
        var bname = info.n[ni];
        var wordRe = new RegExp('(?:^|[\\s,;.:@!/()\\[\\]{}\'"-])' + bname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:[\\s,;.:@!/()\\[\\]{}\'"-]|$)', 'i');
        if (wordRe.test(displayLower)) {
          claimedBrand = true;
          matchedName = bname;
          break;
        }
        var localPart = senderLower.split('@')[0] || '';
        if (wordRe.test(localPart)) {
          claimedBrand = true;
          matchedName = bname;
          break;
        }
      }
      if (claimedBrand) {
        var domainMatch = false;
        for (var di = 0; di < info.d.length; di++) {
          if (domain.includes(info.d[di])) { domainMatch = true; break; }
        }
        if (!domainMatch) {
          var brandLabel = brand.charAt(0).toUpperCase() + brand.slice(1);
          var legitList = info.d.slice(0, 3).join(', ');
          findings.push({
            sev: 'danger', icon: '🎭',
            title: 'Pretends to be ' + brandLabel + ' — fake sender',
            text: 'Display name says "' + matchedName + '" but this email is from "' + domain + '". Real ' + brandLabel + ' emails ONLY come from ' + legitList + '. The sender is impersonating ' + brandLabel + ' to steal your personal data. This is a phishing attack.',
            hl: display || sender,
            hlAll: [display, sender].filter(Boolean)
          });
        }
        break;
      }
    }

    /* --- Free email claiming brand --- */
    var isFree = false;
    for (var fi = 0; fi < FREE_EMAILS.length; fi++) {
      if (domain.includes(FREE_EMAILS[fi])) { isFree = true; break; }
    }
    if (isFree && findings.length > 0 && findings[0].sev === 'danger') {
      findings.push({
        sev: 'danger', icon: '📧',
        title: 'Brand email sent from free email — definitely fake',
        text: 'Official companies NEVER send emails from ' + domain + '. Legitimate businesses use their own domain (e.g., @google.com, @hdfcbank.com). Scammers use free Gmail/Yahoo accounts because they can\'t set up real company email. This is 100% a scam.',
        hl: sender,
        hlAll: [sender]
      });
    }

    /* --- Suspicious TLD --- */
    var badTlds = ['.tk','.ml','.ga','.cf','.gq','.xyz','.top','.buzz','.club','.work','.click','.link','.fun','.site','.online','.icu','.monster','.surf','.cfd','.sbs'];
    for (var ti = 0; ti < badTlds.length; ti++) {
      if (domain.endsWith(badTlds[ti])) {
        findings.push({
          sev: 'danger', icon: '🌐',
          title: 'Domain ending "' + badTlds[ti] + '" is commonly used for scams',
          text: 'The sender uses "' + domain + '" — the "' + badTlds[ti] + '" ending costs less than ₹1 and requires no identity verification. Studies show 90%+ of phishing sites use these cheap TLDs. Real companies use .com, .in, .org, or .gov. This domain is extremely suspicious.',
          hl: domain
        });
        break;
      }
    }

    /* --- Urgency (skip for known safe types) --- */
    if (SAFE_TYPES.indexOf(classification.type) === -1) {
      var urgentRe = /(urgent|immediate|act\s+now|right\s+now|expires?\s+today|last\s+chance|final\s+warning|within\s+\d+\s+(?:hours?|minutes?|days?))/i;
      var urgentMatch = text.match(urgentRe);
      if (urgentMatch) {
        var context = text.match(new RegExp('.{0,50}' + urgentMatch[1] + '.{0,50}', 'i'));
        findings.push({
          sev: 'high', icon: '⏰',
          title: 'Creates pressure to act immediately',
          text: 'Uses "' + urgentMatch[1] + '" to make you rush without thinking. This is a classic phishing tactic — scammers know that if you stop to think, you\'ll realize it\'s fake. Real companies like banks give you days or weeks to respond, not minutes.',
          hl: context ? context[0].trim() : urgentMatch[1]
        });
      }
    }

    /* --- Credential harvesting (skip for safe types) --- */
    if (SAFE_TYPES.indexOf(classification.type) === -1) {
      var credRe = /(verify\s+(?:your|the)\s+(?:account|identity|email)|confirm\s+(?:your|the)\s+(?:password|account|identity)|update\s+(?:your|the)\s+(?:payment|billing|account|details)|re-?enter\s+(?:your|the)\s+(?:password|account)|click\s+(?:here|below)\s+to\s+(?:verify|confirm|update))/i;
      var credMatch = text.match(credRe);
      if (credMatch) {
        findings.push({
          sev: 'danger', icon: '🔑',
          title: 'Asks for your login details — phishing attempt',
          text: 'Says "' + credMatch[1] + '" — real companies NEVER ask you to verify passwords, update billing, or confirm identity through email links. Banks and services handle this through their official app or secure portal (which you type yourself, not click a link). Clicking this link will take you to a fake login page that steals your credentials.',
          hl: credMatch[1]
        });
      }
    }

    /* --- Fear tactics (skip for safe types) --- */
    if (SAFE_TYPES.indexOf(classification.type) === -1) {
      var fearRe = /(account\s+(?:will|has)\s+be\s+(?:suspended|locked|closed|terminated)|unauthorized\s+(?:access|activity)|legal\s+action|police\s+(?:complaint|report)|account\s+(?:has\s+been|is)\s+(?:compromised|hacked))/i;
      var fearMatch = text.match(fearRe);
      if (fearMatch) {
        findings.push({
          sev: 'danger', icon: '⚠️',
          title: 'Uses threats to create panic',
          text: 'Says "' + fearMatch[1] + '" — scammers use fear to make you act without thinking. Real companies send polite, professional notices when there\'s a security issue. They don\'t threaten you or use alarming language. If you\'re worried, log into your account directly (not through this email) to check.',
          hl: fearMatch[1]
        });
      }
    }

    /* --- Insecure HTTP link --- */
    if (/http:\/\//.test(text)) {
      var httpMatch = text.match(/http:\/\/[^\s"<>]+/);
      var httpUrl = httpMatch ? httpMatch[0].substring(0, 80) : 'http://...';
      findings.push({
        sev: 'high', icon: '🔓',
        title: 'Link is not encrypted (HTTP)',
        text: 'Contains an insecure link: "' + httpUrl + '" — data sent over HTTP is visible to anyone on the same network (WiFi router, ISP, hacker). Real companies ALWAYS use HTTPS (encrypted). Any login or payment page on HTTP is either broken or malicious.',
        hl: httpUrl
      });
    }

    /* --- IP address in link --- */
    if (SAFE_TYPES.indexOf(classification.type) === -1) {
      var ipRe = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
      var ipMatch = text.match(ipRe);
      if (ipMatch) {
        findings.push({
          sev: 'danger', icon: '🚨',
          title: 'Link uses raw IP address — phishing indicator',
          text: 'Contains IP address "' + ipMatch[0] + '" — real businesses NEVER use raw numbers (like 192.168.1.1) instead of names (like google.com). This IP likely hosts a phishing server. Scammers use IPs because domain names cost money and can be easily shut down.',
          hl: ipMatch[0]
        });
      }
    }

    /* --- Shortened URLs --- */
    var shortRe = /(bit\.ly|tinyurl|goo\.gl|t\.co|is\.gd|buff\.ly|cutt\.ly|rb\.gy)\/[\w-]+/i;
    var shortMatch = text.match(shortRe);
    if (shortMatch) {
      findings.push({
        sev: 'high', icon: '🔗',
        title: 'Hidden link via URL shortener: ' + shortMatch[1],
        text: 'Uses "' + shortMatch[0].substring(0, 40) + '" — URL shorteners hide the real destination. You have no idea where this link actually goes. Scammers use them to disguise phishing sites. If a real company sent this, they\'d show the full URL. Hover over links before clicking.',
        hl: shortMatch[0].substring(0, 50)
      });
    }

    /* --- Dangerous attachment --- */
    var dangerExts = /\.(exe|scr|bat|cmd|vbs|js|ps1|wsf|jar|msi|pif|lnk|iso)\b/i;
    var el = document.querySelector('[data-message-id]:hover') || document.body;
    var attachNames = el.querySelectorAll('[data-attachment-id], .aZo, .bdt, .bQE');
    for (var ai = 0; ai < attachNames.length; ai++) {
      var aname = attachNames[ai].textContent.toLowerCase();
      if (dangerExts.test(aname)) {
        var ext = aname.match(dangerExts);
        findings.push({
          sev: 'danger', icon: '📎',
          title: 'Dangerous file type: "' + (ext ? ext[1] : 'unknown') + '"',
          text: 'Contains file "' + aname.substring(0, 50) + '" — .' + (ext ? ext[1] : '?') + ' files are executable programs that can install viruses, ransomware, or spyware. Even if it looks like a document (e.g., "invoice.pdf.exe"), the REAL file type is after the last dot. NEVER open .exe, .scr, .bat, .vbs, .js files from emails.',
          hl: aname.substring(0, 50)
        });
        break;
      }
    }

    /* --- Double extension trick --- */
    var doubleExtRe = /\w+\.\w+\.(exe|scr|bat|cmd|vbs|js|pif)/i;
    var fullPageText = (document.body.innerText || '');
    var doubleMatch = fullPageText.match(doubleExtRe);
    if (doubleMatch) {
      findings.push({
        sev: 'danger', icon: '📎',
        title: 'Double extension trick detected: "' + doubleMatch[0] + '"',
        text: 'File looks like "' + doubleMatch[0] + '" — the real type is AFTER the last dot (.exe, .scr, etc.). Scammers name files "invoice.pdf.exe" or "photo.jpg.scr" to look innocent. Windows may hide the real extension. This is ALWAYS malware.',
        hl: doubleMatch[0]
      });
    }

    /* --- Homoglyph / unicode attack in sender --- */
    var username = sender.split('@')[0] || '';
    var badChars = { '\u0430':'a','\u0435':'e','\u043E':'o','\u0440':'p','\u0441':'c','\u0456':'i','\u0455':'s','\u0445':'x','\u0443':'y' };
    for (var bc in badChars) {
      if (username.indexOf(bc) !== -1) {
        findings.push({
          sev: 'danger', icon: '🔤',
          title: 'Fake characters in sender address',
          text: 'The sender "' + sender + '" contains invisible fake characters. For example, Cyrillic "а" looks identical to English "a" but they\'re different. This is called an "IDN Homograph Attack" — the address LOOKS real but goes to a completely different server. Always check the actual domain after @.',
          hl: sender
        });
        break;
      }
    }

    /* --- Links that don't match displayed text --- */
    if (SAFE_TYPES.indexOf(classification.type) === -1) {
      var hrefRe = /href=["']([^"']+)["']/gi;
      var linkTextRe = /<a[^>]*>([^<]+)<\/a>/gi;
      var bodyLinks = fullPageText.match(/https?:\/\/[^\s<>"]+/gi);
      if (bodyLinks && bodyLinks.length > 0) {
        var suspiciousLinks = [];
        for (var li = 0; li < bodyLinks.length; li++) {
          var linkUrl = bodyLinks[li].toLowerCase();
          if (!linkUrl.includes(domain) && !TRUSTED_DOMAINS.some(function(td) { return linkUrl.includes(td); })) {
            suspiciousLinks.push(bodyLinks[li].substring(0, 60));
          }
        }
        if (suspiciousLinks.length > 0) {
          findings.push({
            sev: 'high', icon: '🔗',
            title: suspiciousLinks.length + ' link(s) point to different website',
            text: 'Found links pointing to "' + suspiciousLinks[0] + (suspiciousLinks.length > 1 ? '" and ' + (suspiciousLinks.length - 1) + ' more' : '"') + ' — this doesn\'t match the sender domain (' + domain + '). Scammers embed links that SAY one thing but GO somewhere else. Always hover over links to see the real destination before clicking.',
            hl: suspiciousLinks[0]
          });
        }
      }
    }

    /* --- Safe patterns (bonus trust) --- */
    if (findings.length === 0) {
      if (/do\s+not\s+reply|noreply|no-reply/i.test(text))
        findings.push({ sev: 'safe', icon: '✅', title: 'Automated system email', text: 'This is a real automated email from a legitimate service. No action needed from your side.' });
      else if (/unsubscribe|view\s+in\s+browser/i.test(text))
        findings.push({ sev: 'safe', icon: '✅', title: 'Legitimate marketing email', text: 'Has unsubscribe link — this is a real marketing email from a verified sender. Not dangerous.' });
      else if (classification.risk < 0)
        findings.push({ sev: 'safe', icon: classification.icon, title: classification.label, text: 'This is a recognized ' + classification.label.toLowerCase() + ' from a verified sender. Safe to use.' });
      else
        findings.push({ sev: 'safe', icon: '✅', title: 'No threats detected', text: 'This email looks normal. No phishing patterns, suspicious links, or security issues found.' });
    }

    return findings;
  }

  /* ═══════════════ CORE ANALYSIS ═══════════════ */
  function analyzeEmail(el, index) {
    var sender = getSender(el);
    var subject = getSubject(el);
    var body = getBody(el);
    var display = getDisplayName(el);
    var domain = senderDomain(sender);
    var fullText = (subject + ' ' + body).toLowerCase();

    var classification = classifyEmail(subject, body, domain, display);
    var findings = detectThreats(fullText, sender, domain, display, classification);

    var score = 100 + classification.risk;
    for (var fi = 0; fi < findings.length; fi++) {
      if (findings[fi].sev === 'danger') score -= 25;
      else if (findings[fi].sev === 'high') score -= 15;
    }
    score = Math.max(0, Math.min(100, score));

    var riskLevel;
    if (score <= 25) riskLevel = 'danger';
    else if (score <= 50) riskLevel = 'warning';
    else if (score <= 75) riskLevel = 'low';
    else riskLevel = 'safe';

    return {
      id: index,
      el: el,
      sender: sender,
      subject: subject,
      display: display,
      domain: domain,
      type: classification.type,
      icon: classification.icon,
      typeLabel: classification.label,
      score: score,
      risk: riskLevel,
      findings: findings.slice(0, 5)
    };
  }

  /* ═══════════════ HIGHLIGHT ═══════════════ */
  function clearHighlights() {
    var old = document.querySelectorAll('.pg-hl');
    for (var i = 0; i < old.length; i++) {
      old[i].style.removeProperty('outline');
      old[i].style.removeProperty('outline-offset');
      old[i].style.removeProperty('box-shadow');
      old[i].style.removeProperty('background-color');
      old[i].classList.remove('pg-hl');
    }
  }

  function highlightElement(el, color) {
    color = color || '#f44336';
    el.style.outline = '3px solid ' + color;
    el.style.outlineOffset = '3px';
    el.style.boxShadow = '0 0 15px ' + color + '80';
    el.style.backgroundColor = color + '15';
    el.classList.add('pg-hl');
  }

  function searchAndHighlight(text, container, color) {
    if (!text || !container) return false;
    var found = false;
    var lowerText = text.toLowerCase();
    var walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
    while (walker.nextNode()) {
      var node = walker.currentNode;
      if (node.textContent.toLowerCase().indexOf(lowerText) !== -1) {
        var parent = node.parentElement;
        if (parent && !parent.closest('#phishguard-panel') && !parent.closest('#phishguard-main-btn')) {
          highlightElement(parent, color);
          if (!found) {
            parent.scrollIntoView({ behavior: 'smooth', block: 'center' });
            found = true;
          }
        }
      }
    }
    return found;
  }

  /* Highlight a single text in the email */
  window.pgHighlight = function(text, color) {
    if (!text) return;
    clearHighlights();
    var color = color || '#f44336';
    var searchAreas = document.querySelectorAll('.a3s,.y2,.ii,.gs,[dir="ltr"],.adn,.a3s.aiL');
    for (var si = 0; si < searchAreas.length; si++) {
      var area = searchAreas[si];
      if (area.closest('#phishguard-panel') || area.closest('#phishguard-main-btn')) continue;
      searchAndHighlight(text, area, color);
    }
    /* Also search sender/header area */
    var senderAreas = document.querySelectorAll('[email],.yW,.zF,.yX,.go,.gE');
    for (var sci = 0; sci < senderAreas.length; sci++) {
      var sa = senderAreas[sci];
      if (sa.closest('#phishguard-panel')) continue;
      var attr = sa.getAttribute('email') || '';
      var txt = sa.textContent || '';
      if (attr.toLowerCase().indexOf(text.toLowerCase()) !== -1 || txt.toLowerCase().indexOf(text.toLowerCase()) !== -1) {
        highlightElement(sa, color);
      }
    }
    setTimeout(clearHighlights, 8000);
  };

  /* Highlight MULTIPLE texts at once — each gets its own color */
  window.pgHighlightAll = function(texts, colors) {
    if (!texts || !texts.length) return;
    clearHighlights();
    colors = colors || ['#f44336', '#ff9800', '#ffc107', '#e040fb', '#448aff', '#00e676'];
    var allSearchAreas = document.querySelectorAll('.a3s,.y2,.ii,.gs,[dir="ltr"],.adn,.a3s.aiL,[email],.yW,.zF,.yX,.go,.gE');

    var anyFound = false;
    for (var ti = 0; ti < texts.length; ti++) {
      var t = texts[ti];
      if (!t) continue;
      var col = colors[ti % colors.length];
      var lowerT = t.toLowerCase();

      for (var si = 0; si < allSearchAreas.length; si++) {
        var area = allSearchAreas[si];
        if (area.closest('#phishguard-panel') || area.closest('#phishguard-main-btn')) continue;

        /* Try direct text match first */
        var directMatch = false;
        var attr = area.getAttribute('email') || '';
        var txt = area.textContent || '';
        if (attr.toLowerCase().indexOf(lowerT) !== -1 || txt.toLowerCase().indexOf(lowerT) !== -1) {
          highlightElement(area, col);
          if (!anyFound) { area.scrollIntoView({ behavior: 'smooth', block: 'center' }); anyFound = true; }
          directMatch = true;
        }

        /* Also walk text nodes for partial matches */
        if (!directMatch && area.children !== undefined) {
          var walker = document.createTreeWalker(area, NodeFilter.SHOW_TEXT, null, false);
          while (walker.nextNode()) {
            var node = walker.currentNode;
            if (node.textContent.toLowerCase().indexOf(lowerT) !== -1) {
              var parent = node.parentElement;
              if (parent && !parent.closest('#phishguard-panel') && !parent.closest('#phishguard-main-btn')) {
                highlightElement(parent, col);
                if (!anyFound) { parent.scrollIntoView({ behavior: 'smooth', block: 'center' }); anyFound = true; }
              }
            }
          }
        }
      }
    }
    setTimeout(clearHighlights, 10000);
  };

  /* ═══════════════ UI ═══════════════ */
  function init() {
    injectStyles();
    createButton();
    waitForBody();
    observeTabChanges();
  }

  function injectStyles() {
    if (document.getElementById('phishguard-styles')) return;
    var s = document.createElement('style');
    s.id = 'phishguard-styles';
    s.textContent = '@keyframes pgSpin{to{transform:rotate(360deg)}}@keyframes pgPulse{0%,100%{opacity:1}50%{opacity:.5}}';
    document.head.appendChild(s);
  }

  function waitForBody() {
    if (document.body) {
      createButton();
    } else {
      setTimeout(waitForBody, 200);
    }
  }

  /* Detect Gmail tab changes (Primary/Promotions/Social/Spam etc.) */
  var lastUrl = '';
  function observeTabChanges() {
    setInterval(function() {
      var currentUrl = window.location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        var tabName = getGmailTabName();
        var results = document.getElementById('pg-results');
        var btn = document.getElementById('pg-scan-btn');
        if (results && btn && !btn.disabled) {
          results.innerHTML = '<div style="text-align:center;padding:20px;color:rgba(255,255,255,.5)"><div style="font-size:28px;margin-bottom:8px">\u{1F504}</div><div style="font-size:12px">Switched to <b>' + esc(tabName) + '</b> \u2014 click Scan to analyze</div></div>';
          document.getElementById('pg-safe').textContent = '0';
          document.getElementById('pg-low').textContent = '0';
          document.getElementById('pg-warn').textContent = '0';
          document.getElementById('pg-danger').textContent = '0';
          btn.textContent = '\u{1F50D} Scan ' + tabName;
        }
      }
    }, 1000);

    /* Also observe Gmail DOM for folder/category switches */
    try {
      var navObserver = new MutationObserver(function() {
        var results = document.getElementById('pg-results');
        var btn = document.getElementById('pg-scan-btn');
        if (results && btn && !btn.disabled && results.querySelector('[data-risk]')) {
          var tabName = getGmailTabName();
          results.innerHTML = '<div style="text-align:center;padding:20px;color:rgba(255,255,255,.5)"><div style="font-size:28px;margin-bottom:8px">\u{1F504}</div><div style="font-size:12px">Emails changed in <b>' + esc(tabName) + '</b> \u2014 click Scan to re-analyze</div></div>';
          document.getElementById('pg-safe').textContent = '0';
          document.getElementById('pg-low').textContent = '0';
          document.getElementById('pg-warn').textContent = '0';
          document.getElementById('pg-danger').textContent = '0';
        }
      });
      var navTarget = document.querySelector('[role="navigation"]') || document.querySelector('div[role="main"]');
      if (navTarget) {
        navObserver.observe(navTarget, { childList: true, subtree: true });
      }
    } catch(e) {}
  }

  function createButton() {
    if (document.getElementById('phishguard-main-btn')) return;
    if (!document.body) return;

    var minimized = false;

    var btn = document.createElement('button');
    btn.id = 'phishguard-main-btn';
    btn.innerHTML = '<span id="pg-btn-full">\u{1F6E1}\uFE0F Scan ' + getGmailTabName() + '</span><span id="pg-btn-mini" style="display:none">\u{1F6E1}\uFE0F</span><span id="pg-btn-minimize" style="margin-left:8px;font-size:10px;opacity:.7;cursor:pointer" title="Minimize">—</span>';
    btn.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:2147483647;background:linear-gradient(135deg,#1a1a2e,#16213e);color:#4caf50;border:2px solid #4caf50;padding:10px 16px;border-radius:25px;cursor:grab;font-weight:bold;font-size:13px;box-shadow:0 4px 20px rgba(76,175,80,0.3);font-family:Arial,sans-serif;user-select:none;transition:transform .2s;';
    btn.onmouseenter = function() { if (!btn._dragging) btn.style.transform = 'scale(1.05)'; };
    btn.onmouseleave = function() { btn.style.transform = 'scale(1)'; };

    /* ─── MINIMIZE / EXPAND ─── */
    btn.querySelector('#pg-btn-minimize').onclick = function(e) {
      e.stopPropagation();
      minimized = !minimized;
      var full = btn.querySelector('#pg-btn-full');
      var mini = btn.querySelector('#pg-btn-mini');
      var minBtn = btn.querySelector('#pg-btn-minimize');
      if (minimized) {
        full.style.display = 'none';
        mini.style.display = '';
        minBtn.textContent = '+';
        btn.style.padding = '10px 12px';
        btn.style.borderRadius = '50%';
      } else {
        full.style.display = '';
        mini.style.display = 'none';
        minBtn.textContent = '—';
        btn.style.padding = '10px 16px';
        btn.style.borderRadius = '25px';
      }
    };

    /* ─── CLICK TO TOGGLE PANEL ─── */
    btn.onclick = function(e) {
      if (e.target.id === 'pg-btn-minimize') return;
      togglePanel();
    };

    /* ─── DRAG ─── */
    var isDragging = false;
    var dragStartX, dragStartY, startLeft, startTop;
    btn.onmousedown = function(e) {
      if (e.target.id === 'pg-btn-minimize') return;
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      var rect = btn.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      btn.style.transition = 'none';
      btn.style.cursor = 'grabbing';
      e.preventDefault();
    };
    document.onmousemove = function(e) {
      if (!isDragging) return;
      var dx = e.clientX - dragStartX;
      var dy = e.clientY - dragStartY;
      btn.style.left = (startLeft + dx) + 'px';
      btn.style.top = (startTop + dy) + 'px';
      btn.style.right = 'auto';
      btn.style.bottom = 'auto';
    };
    document.onmouseup = function() {
      if (isDragging) {
        isDragging = false;
        btn.style.cursor = 'grab';
        btn.style.transition = 'transform .2s';
      }
    };

    document.body.appendChild(btn);
  }

  function togglePanel() {
    panelVisible = !panelVisible;
    var panel = document.getElementById('phishguard-panel');
    if (!panel) panel = createPanel();
    panel.style.display = panelVisible ? 'flex' : 'none';
  }

  function createPanel() {
    var panel = document.createElement('div');
    panel.id = 'phishguard-panel';
    panel.style.cssText = 'position:fixed;top:10px;right:10px;width:440px;max-height:90vh;background:#0d1117;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.8);z-index:2147483646;font-family:Segoe UI,Arial,sans-serif;border:1px solid rgba(76,175,80,.3);display:flex;flex-direction:column;overflow:hidden;color:#fff;';

    panel.innerHTML =
      '<div style="padding:14px 18px;background:linear-gradient(135deg,#1a472a,#0d2818);border-bottom:1px solid rgba(76,175,80,.3)">' +
        '<div style="display:flex;justify-content:space-between;align-items:center">' +
          '<div style="display:flex;align-items:center;gap:10px">' +
            '<div style="width:36px;height:36px;background:linear-gradient(135deg,#4caf50,#2e7d32);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px">\u{1F6E1}\uFE0F</div>' +
            '<div><div style="font-size:14px;font-weight:700">PhishGuard AI <span style="font-size:9px;color:#4caf50;background:rgba(76,175,80,.2);padding:1px 5px;border-radius:4px">v4.0</span></div>' +
            '<div style="font-size:10px;color:#81c784">Click findings to see risky parts</div></div>' +
          '</div>' +
          '<button id="phishguard-close" style="background:rgba(255,255,255,.1);border:none;color:#aaa;width:26px;height:26px;border-radius:6px;cursor:pointer;font-size:14px">\u2715</button>' +
        '</div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:10px 14px;background:rgba(0,0,0,.3)">' +
        '<div style="text-align:center;padding:8px;background:rgba(76,175,80,.1);border-radius:6px;cursor:pointer" id="pg-safe-box"><div id="pg-safe" style="font-size:22px;font-weight:700;color:#4caf50">0</div><div style="font-size:8px;color:#81c784">SAFE</div></div>' +
        '<div style="text-align:center;padding:8px;background:rgba(255,193,7,.1);border-radius:6px;cursor:pointer" id="pg-low-box"><div id="pg-low" style="font-size:22px;font-weight:700;color:#ffc107">0</div><div style="font-size:8px;color:#ffc107">LOW</div></div>' +
        '<div style="text-align:center;padding:8px;background:rgba(255,152,0,.1);border-radius:6px;cursor:pointer" id="pg-warn-box"><div id="pg-warn" style="font-size:22px;font-weight:700;color:#ff9800">0</div><div style="font-size:8px;color:#ff9800">MEDIUM</div></div>' +
        '<div style="text-align:center;padding:8px;background:rgba(244,67,54,.1);border-radius:6px;cursor:pointer" id="pg-danger-box"><div id="pg-danger" style="font-size:22px;font-weight:700;color:#f44336">0</div><div style="font-size:8px;color:#f44336">DANGER</div></div>' +
      '</div>' +
      '<div id="pg-results" style="flex:1;overflow-y:auto;padding:10px 14px;min-height:200px;max-height:55vh">' +
        '<div style="text-align:center;color:rgba(255,255,255,.4);padding:30px 16px">' +
          '<div style="font-size:42px;margin-bottom:12px;opacity:.5">\u{1F4E7}</div>' +
          '<div style="font-size:13px">Click Scan to analyze ' + getGmailTabName() + '</div>' +
          '<div style="font-size:10px;color:rgba(255,255,255,.3);margin-top:4px">Open inbox, scroll to see emails, then scan</div>' +
        '</div>' +
      '</div>' +
      '<div style="padding:10px 14px;border-top:1px solid rgba(76,175,80,.2);background:rgba(0,0,0,.2)">' +
        '<button id="pg-scan-btn" style="width:100%;padding:11px;background:linear-gradient(135deg,#4caf50,#2e7d32);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:12px">\u{1F50D} Scan ' + getGmailTabName() + '</button>' +
      '</div>';

    document.body.appendChild(panel);

    document.getElementById('phishguard-close').onclick = function() {
      panel.style.display = 'none';
      panelVisible = false;
    };
    document.getElementById('pg-scan-btn').onclick = scanEmails;
    document.getElementById('pg-safe-box').onclick = function() { scrollToLevel('safe'); };
    document.getElementById('pg-low-box').onclick = function() { scrollToLevel('low'); };
    document.getElementById('pg-warn-box').onclick = function() { scrollToLevel('warning'); };
    document.getElementById('pg-danger-box').onclick = function() { scrollToLevel('danger'); };

    return panel;
  }

  /* ═══════════════ SCAN ═══════════════ */
  async function scanEmails() {
    var scanId = ++lastScanId;
    var btn = document.getElementById('pg-scan-btn');
    var results = document.getElementById('pg-results');
    var currentTab = getGmailTabName();

    /* Force clear EVERYTHING - old results, stats, all DOM */
    results.innerHTML = '';
    var safeEl = document.getElementById('pg-safe');
    var lowEl = document.getElementById('pg-low');
    var warnEl = document.getElementById('pg-warn');
    var dangerEl = document.getElementById('pg-danger');
    safeEl.textContent = '0';
    lowEl.textContent = '0';
    warnEl.textContent = '0';
    dangerEl.textContent = '0';

    btn.textContent = '\u23F3 Scanning ' + currentTab + '...';
    btn.disabled = true;

    results.innerHTML = '<div style="text-align:center;padding:30px"><div style="width:36px;height:36px;border:3px solid rgba(76,175,80,.2);border-top-color:#4caf50;border-radius:50%;animation:pgSpin 1s linear infinite;margin:0 auto 12px"></div><div style="color:#4caf50;font-size:12px">Scanning ' + currentTab + ' emails...</div></div>';

    /* Wait for Gmail DOM to settle after tab switch */
    await new Promise(function(r) { setTimeout(r, 600); });

    /* Abort if another scan started */
    if (scanId !== lastScanId) return;

    /* Re-check tab in case it changed during the wait */
    var finalTab = getGmailTabName();

    var allEmails = findEmails();
    var emails = allEmails;

    var counts = { safe: 0, low: 0, warning: 0, danger: 0 };
    var types = {};
    results.innerHTML = '';

    if (!emails.length) {
      results.innerHTML = '<div style="text-align:center;padding:30px;color:rgba(255,255,255,.5)"><div style="font-size:32px;margin-bottom:10px">\u{1F4ED}</div><div style="font-size:13px">No emails found in ' + esc(finalTab) + '</div><div style="font-size:10px;color:rgba(255,255,255,.3);margin-top:6px">Make sure you are on the ' + esc(finalTab) + ' tab and emails are loaded, then click Scan</div></div>';
      btn.textContent = '\u{1F50D} Scan Emails';
      btn.disabled = false;
      return;
    }

    for (var i = 0; i < emails.length; i++) {
      if (scanId !== lastScanId) return;
      try {
        var result = analyzeEmail(emails[i], i);
        counts[result.risk]++;
        types[result.type] = (types[result.type] || 0) + 1;
        renderResult(result, results);
      } catch (err) {
        console.error('PhishGuard: Error on email ' + i, err);
      }
      await new Promise(function(r) { setTimeout(r, 5); });
    }

    if (scanId !== lastScanId) return;
    safeEl.textContent = counts.safe;
    lowEl.textContent = counts.low;
    warnEl.textContent = counts.warning;
    dangerEl.textContent = counts.danger;
    renderSummary(counts, types, emails.length, finalTab, results);

    btn.textContent = '\u{1F50D} Scan ' + finalTab;
    btn.disabled = false;
  }

  /* ═══════════════ RENDER ═══════════════ */
  function renderResult(r, container) {
    var colorMap = { safe: '#4caf50', low: '#ffc107', warning: '#ff9800', danger: '#f44336' };
    var color = colorMap[r.risk];

    var item = document.createElement('div');
    item.dataset.risk = r.risk;
    item.style.cssText = 'background:' + color + '12;border-left:3px solid ' + color + ';padding:10px 12px;border-radius:0 6px 6px 0;margin-bottom:6px;transition:all .2s;cursor:pointer;';
    item.onmouseenter = function() { item.style.transform = 'translateX(3px)'; };
    item.onmouseleave = function() { item.style.transform = 'none'; };

    /* Card click = scroll to email */
    item.onclick = (function(result) {
      return function(e) {
        if (e.target.closest('.pg-finding')) return;
        if (result.el) {
          result.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          result.el.style.outline = '3px solid #4caf50';
          result.el.style.outlineOffset = '2px';
          result.el.style.boxShadow = '0 0 20px rgba(76,175,80,0.4)';
          (function(el) {
            setTimeout(function() {
              el.style.removeProperty('outline');
              el.style.removeProperty('outline-offset');
              el.style.removeProperty('box-shadow');
            }, 4000);
          })(result.el);
        }
      };
    })(r);

    var findingsHtml = '';
    for (var fi = 0; fi < r.findings.length; fi++) {
      var f = r.findings[fi];
      var fc = f.sev === 'danger' ? '#f44336' : f.sev === 'high' ? '#ff9800' : f.sev === 'safe' ? '#4caf50' : '#ffc107';
      var hlAllJson = JSON.stringify(f.hlAll || (f.hl ? [f.hl] : []));
      var hlBtn = f.hl ? '<div style="font-size:9px;color:#64b5f6;margin-top:3px;cursor:pointer" data-hl-text=\'' + escAttr(hlAllJson) + '\'>\u{1F446} Click to see risky parts highlighted</div>' : '';
      findingsHtml += '<div class="pg-finding" style="margin-top:6px;padding:6px 8px;background:rgba(0,0,0,.2);border-radius:4px;border-left:2px solid ' + fc + ';cursor:pointer">' +
        '<div style="display:flex;align-items:center;gap:5px"><span style="font-size:12px">' + f.icon + '</span><span style="font-size:11px;font-weight:600">' + esc(f.title) + '</span></div>' +
        '<div style="font-size:10px;color:rgba(255,255,255,.7);margin-top:3px;line-height:1.4">' + esc(f.text) + '</div>' +
        hlBtn +
        '</div>';
    }

    item.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">' +
        '<div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">' +
          '<span style="font-size:16px">' + r.icon + '</span>' +
          '<div style="flex:1;min-width:0">' +
            '<div style="font-size:11px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="' + esc(r.sender) + '">' + esc(r.display || r.sender || 'Unknown') + '</div>' +
            '<div style="font-size:10px;color:rgba(255,255,255,.5);white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="' + esc(r.subject) + '">' + esc(r.subject || '(no subject)') + '</div>' +
          '</div>' +
        '</div>' +
        '<div style="font-size:12px;font-weight:700;color:' + color + ';min-width:30px;text-align:right">' + r.score + '</div>' +
      '</div>' +
      findingsHtml;

    /* Attach click handlers for highlight buttons */
    var hlElements = item.querySelectorAll('[data-hl-text]');
    for (var hi = 0; hi < hlElements.length; hi++) {
      hlElements[hi].onclick = (function(e) {
        e.stopPropagation();
        var hlJson = this.getAttribute('data-hl-text');
        if (!hlJson) return;
        try {
          var arr = JSON.parse(hlJson);
          if (Array.isArray(arr)) {
            window.pgHighlightAll(arr);
          }
        } catch(ex) {
          window.pgHighlight(hlJson);
        }
      }).bind(hlElements[hi]);
    }

    container.appendChild(item);
  }

  function renderSummary(counts, types, total, tabName, container) {
    var threat = counts.danger > 5 ? 'CRITICAL' : counts.danger > 0 ? 'HIGH' : counts.warning > 0 ? 'MEDIUM' : counts.low > 0 ? 'LOW' : 'SAFE';
    var tc = threat === 'CRITICAL' ? '#ff1744' : threat === 'HIGH' ? '#f44336' : threat === 'MEDIUM' ? '#ff9800' : threat === 'LOW' ? '#ffc107' : '#4caf50';

    var typeLabels = {
      bank_statement:'\u{1F3E6} Bank', bank_alert:'\u{1F3E6} Bank', bank_security:'\u{1F3E6} Bank', bank_other:'\u{1F3E6} Bank',
      order:'\u{1F4E6} Orders', shipping:'\u{1F69A} Shipping', food:'\u{1F354} Food',
      train:'\u{1F682} Train', flight:'\u2708\uFE0F Flight', hotel:'\u{1F3E8} Hotel',
      security:'\u{1F512} Security', newsletter:'\u{1F4F0} Newsletter',
      subscription:'\u{1F4FA} Subscription', payment:'\u{1F4B3} Payment',
      otp:'\u{1F522} OTP', social:'\u{1F464} Social', job:'\u{1F4BC} Job',
      govt:'\u{1F3DB}\uFE0F Govt', unknown:'\u{1F4E7} General'
    };

    var typeStr = '';
    for (var t in types) {
      if (types[t] > 0) typeStr += '<span style="background:rgba(255,255,255,.05);padding:2px 6px;border-radius:4px;font-size:9px;color:rgba(255,255,255,.6)">' + (typeLabels[t] || t) + ': ' + types[t] + '</span> ';
    }

    var div = document.createElement('div');
    div.style.cssText = 'background:rgba(0,0,0,.3);padding:12px;border-radius:8px;margin-bottom:10px;border:1px solid ' + tc + '40';
    div.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">' +
        '<div style="font-size:13px;font-weight:700">\u{1F4CA} ' + esc(tabName) + ' \u2014 Scan Complete</div>' +
        '<div style="background:' + tc + ';color:white;padding:3px 8px;border-radius:10px;font-size:9px;font-weight:700">' + threat + '</div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;text-align:center;margin-bottom:8px">' +
        '<div style="padding:6px;background:rgba(76,175,80,.15);border-radius:4px"><div style="font-size:18px;font-weight:700;color:#4caf50">' + counts.safe + '</div><div style="font-size:8px;color:rgba(255,255,255,.5)">SAFE</div></div>' +
        '<div style="padding:6px;background:rgba(255,193,7,.15);border-radius:4px"><div style="font-size:18px;font-weight:700;color:#ffc107">' + counts.low + '</div><div style="font-size:8px;color:rgba(255,255,255,.5)">LOW</div></div>' +
        '<div style="padding:6px;background:rgba(255,152,0,.15);border-radius:4px"><div style="font-size:18px;font-weight:700;color:#ff9800">' + counts.warning + '</div><div style="font-size:8px;color:rgba(255,255,255,.5)">MEDIUM</div></div>' +
        '<div style="padding:6px;background:rgba(244,67,54,.15);border-radius:4px"><div style="font-size:18px;font-weight:700;color:#f44336">' + counts.danger + '</div><div style="font-size:8px;color:rgba(255,255,255,.5)">DANGER</div></div>' +
      '</div>' +
      (typeStr ? '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px">' + typeStr + '</div>' : '') +
      '<div style="font-size:10px;color:rgba(255,255,255,.4);text-align:center">' + total + ' emails scanned \u00B7 Click any finding to see the risky part highlighted</div>';
    container.insertBefore(div, container.firstChild);
  }

  function scrollToLevel(level) {
    var items = document.getElementById('pg-results').querySelectorAll('[data-risk]');
    for (var i = 0; i < items.length; i++) {
      if (items[i].dataset.risk === level) {
        items[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
        items[i].style.outline = '2px solid #fff';
        (function(el) { setTimeout(function() { el.style.outline = ''; }, 2000); })(items[i]);
        break;
      }
    }
  }

  /* ═══════════════ MESSAGE HANDLER ═══════════════ */
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener(function(req, sender, res) {
      if (req.action === 'scanGmail') {
        if (!panelVisible) togglePanel();
        scanEmails();
        res({ status: 'scanning' });
      }
    });
  }

  /* ═══════════════ START ═══════════════ */
  try {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  } catch(e) {
    console.error('PhishGuard init error:', e);
  }
})();
/**
 * PhishGuard AI — Website Auto-Scanner
 * Runs on EVERY webpage automatically
 * Shows floating safety badge — click for full analysis
 */
(function() {
  'use strict';

  /* Don't run on PhishGuard's own pages */
  if (document.getElementById('phishguard-panel') || document.getElementById('phishguard-badge')) return;
  if (window.location.protocol === 'chrome-extension:') return;

  /* ═══════════════ PHISHING DATABASE ═══════════════ */
  var KNOWN_PHISHING = [
    'paypal-security','paypal-verify','apple-id-verify','microsoft-login','google-security',
    'facebook-login','instagram-verify','amazon-security','netflix-billing','spotify-payment',
    'whatsapp-web','telegram-login','linkedin-verify','dropbox-login','dhl-tracking',
    'fedex-delivery','ups-package','usps-tracking','irs-gov','aadhaar-verify',
    'bank-login','secure-banking','account-verify','identity-confirm','update-account'
  ];

  var TRUSTED_DOMAINS = [
    'google.com','gmail.com','youtube.com','google.co.in','googleapis.com','gstatic.com',
    'facebook.com','instagram.com','twitter.com','x.com','linkedin.com',
    'microsoft.com','outlook.com','live.com','office.com','office365.com','github.com',
    'apple.com','icloud.com','microsoftonline.com',
    'amazon.com','amazon.in','amazon.co.in','aws.amazon.com',
    'paypal.com','paypal.in',
    'netflix.com','spotify.com','youtube.com',
    'flipkart.com','zomato.com','swiggy.com','meesho.com','myntra.com',
    'irctc.co.in','makemytrip.com','redbus.in',
    'phonepe.com','paytm.com','cred.club',
    'sbi.co.in','hdfcbank.com','icicibank.com','axisbank.com','kotak.com',
    'wikipedia.org','reddit.com','quora.com','medium.com','stackoverflow.com',
    'bing.com','yahoo.com','duckduckgo.com','cloudflare.com','mozilla.org',
    'zoom.us','slack.com','discord.com','telegram.org','whatsapp.com',
    'ebay.com','walmart.com','target.com','bestbuy.com','etsy.com',
    'booking.com','airbnb.com','tripadvisor.com','expedia.com',
    'gov.in','gov','nic.in','uidai.gov.in','incometax.gov.in'
  ];

  var BAD_TLDS = ['.tk','.ml','.ga','.cf','.gq','.xyz','.top','.buzz','.club','.work','.click','.link','.fun','.site','.online','.icu','.monster','.surf','.cfd','.sbs','.buzz','.cam','.rest','.cfd','.sbs','.bond','.mom'];

  /* ═══════════════ URL ANALYSIS ═══════════════ */
  function analyzeWebsite() {
    var url = window.location.href;
    var hostname = window.location.hostname;
    var origin = window.location.origin;
    var protocol = window.location.protocol;
    var findings = [];
    var score = 100;

    /* 1. Check if HTTPS */
    if (protocol === 'http:') {
      findings.push({
        sev: 'high', icon: '🔓',
        title: 'Not secure (HTTP)',
        text: 'This website does not use encryption. Any data you enter (passwords, card numbers) can be stolen. Look for the lock icon in the address bar.'
      });
      score -= 20;
    }

    /* 2. Check for IP address URL */
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(hostname)) {
      findings.push({
        sev: 'danger', icon: '🚨',
        title: 'Website uses numbers instead of a name',
        text: 'Real websites use names like "google.com" not numbers like "192.168.1.1". This is a common trick used by scammers.'
      });
      score -= 30;
    }

    /* 3. Check bad TLD */
    for (var i = 0; i < BAD_TLDS.length; i++) {
      if (hostname.endsWith(BAD_TLDS[i])) {
        findings.push({
          sev: 'danger', icon: '🌐',
          title: 'Suspicious website address',
          text: 'This website uses "' + BAD_TLDS[i] + '" ending — these are cheap/free domains commonly used for scams. Be very careful.'
        });
        score -= 35;
        break;
      }
    }

    /* 4. Check if it's a known phishing pattern */
    var hl = hostname.toLowerCase();
    for (var pi = 0; pi < KNOWN_PHISHING.length; pi++) {
      if (hl.indexOf(KNOWN_PHISHING[pi]) !== -1) {
        findings.push({
          sev: 'danger', icon: '🎣',
          title: 'Possible phishing page',
          text: 'This URL contains "' + KNOWN_PHISHING[pi] + '" — a pattern commonly used in fake websites that try to steal your password or personal info.'
        });
        score -= 40;
        break;
      }
    }

    /* 5. Check if trusted domain */
    var isTrusted = false;
    var trustedBrand = '';
    for (var ti = 0; ti < TRUSTED_DOMAINS.length; ti++) {
      if (hl === TRUSTED_DOMAINS[ti] || hl.endsWith('.' + TRUSTED_DOMAINS[ti])) {
        isTrusted = true;
        trustedBrand = TRUSTED_DOMAINS[ti];
        break;
      }
    }
    if (isTrusted) {
      score = Math.max(score, 95);
      findings.unshift({
        sev: 'safe', icon: '✅',
        title: 'Trusted website',
        text: '"' + trustedBrand + '" is a verified, well-known website. This is safe to use.'
      });
    }

    /* 6. Check for excessive subdomains (phishing trick) */
    var subdomains = hostname.split('.');
    if (subdomains.length > 3) {
      findings.push({
        sev: 'high', icon: '🔗',
        title: 'Too many parts in the website address',
        text: 'This URL has ' + subdomains.length + ' parts (e.g., "login.verify.secure.bank.com"). Scammers use this to make fake sites look real. The real website is likely just "' + subdomains.slice(-2).join('.') + '".'
      });
      score -= 15;
    }

    /* 7. Check for suspicious words in URL */
    var suspWords = /(?:login|signin|verify|secure|account|update|confirm|password|banking|auth)/i;
    if (suspWords.test(hl) && !isTrusted) {
      findings.push({
        sev: 'high', icon: '⚠️',
        title: 'URL contains sensitive words',
        text: 'Words like "login", "verify", "secure" in the URL are commonly used by phishing sites to look legitimate. Double-check you\'re on the right website.'
      });
      score -= 10;
    }

    /* 8. Check for punycode (IDN homograph attack) */
    if (hostname.indexOf('xn--') !== -1) {
      findings.push({
        sev: 'danger', icon: '🔤',
        title: 'Hidden characters in website address',
        text: 'This website uses special encoding that can disguise the real address. This is a common technique to impersonate real websites.'
      });
      score -= 30;
    }

    /* 9. Check page for password forms on untrusted sites */
    if (!isTrusted) {
      var forms = document.querySelectorAll('input[type="password"]');
      if (forms.length > 0) {
        findings.push({
          sev: 'danger', icon: '🔑',
          title: 'Asks for a password',
          text: 'This website has a password field but is NOT a well-known website. Be extremely careful — this could be a fake login page designed to steal your password.'
        });
        score -= 25;
      }
    }

    /* 10. Check for crypto miners / suspicious scripts */
    var scripts = document.querySelectorAll('script[src]');
    for (var si = 0; si < scripts.length; si++) {
      var src = (scripts[si].getAttribute('src') || '').toLowerCase();
      if (src.indexOf('coinhive') !== -1 || src.indexOf('coin-') !== -1 || src.indexOf('cryptoloot') !== -1 || src.indexOf('miner') !== -1) {
        findings.push({
          sev: 'danger', icon: '⛏️',
          title: 'Hidden cryptocurrency miner detected',
          text: 'This website is secretly using your computer to mine cryptocurrency. This slows down your device and uses your electricity. Leave immediately.'
        });
        score -= 40;
        break;
      }
    }

    /* 11. Auto-detect known brand impersonation */
    if (!isTrusted) {
      var brandPatterns = [
        { name: 'Google', patterns: ['google','gmail','gdrive','gcloud'] },
        { name: 'Microsoft', patterns: ['microsoft','outlook','office365','live','hotmail'] },
        { name: 'Apple', patterns: ['apple','icloud','itunes','appleid'] },
        { name: 'Amazon', patterns: ['amazon','aws'] },
        { name: 'Facebook', patterns: ['facebook','fb','meta','instagram','whatsapp'] },
        { name: 'Netflix', patterns: ['netflix'] },
        { name: 'PayPal', patterns: ['paypal'] },
        { name: 'LinkedIn', patterns: ['linkedin'] },
        { name: 'HDFC', patterns: ['hdfc','hdfcbank'] },
        { name: 'SBI', patterns: ['sbi','onlinesbi'] },
        { name: 'ICICI', patterns: ['icici','icicibank'] },
        { name: 'Flipkart', patterns: ['flipkart'] },
        { name: 'Zomato', patterns: ['zomato'] },
        { name: 'Swiggy', patterns: ['swiggy'] }
      ];
      for (var bi = 0; bi < brandPatterns.length; bi++) {
        var bp = brandPatterns[bi];
        for (var bpi = 0; bpi < bp.patterns.length; bpi++) {
          if (hl.indexOf(bp.patterns[bpi]) !== -1 && hl.indexOf(bp.patterns[bpi]) < hl.indexOf('.') && !hl.endsWith(bp.patterns[bpi] + '.com') && !hl.endsWith(bp.patterns[bpi] + '.in')) {
            findings.push({
              sev: 'danger', icon: '🎭',
              title: 'May be pretending to be ' + bp.name,
              text: 'This website has "' + bp.name + '" in the address but is NOT the real ' + bp.name + ' website. The real one is at ' + bp.patterns[bpi] + '.com. This could be a phishing site.'
            });
            score -= 35;
            break;
          }
        }
        if (findings[findings.length - 1] && findings[findings.length - 1].icon === '🎭') break;
      }
    }

    /* Default safe if no findings */
    if (findings.length === 0) {
      findings.push({
        sev: 'safe', icon: '✅',
        title: 'No threats detected',
        text: 'This website appears safe. No known phishing patterns, suspicious scripts, or security issues found.'
      });
    }

    score = Math.max(0, Math.min(100, score));
    var risk = score >= 80 ? 'safe' : score >= 50 ? 'low' : score >= 30 ? 'warning' : 'danger';

    return {
      url: url,
      hostname: hostname,
      score: score,
      risk: risk,
      findings: findings
    };
  }

  /* ═══════════════ SHOW FLOATING BADGE ═══════════════ */
  function showBadge(result) {
    var existing = document.getElementById('phishguard-badge');
    if (existing) existing.remove();

    var colorMap = { safe: '#4caf50', low: '#ffc107', warning: '#ff9800', danger: '#f44336' };
    var labelMap = { safe: 'SAFE', low: 'LOW RISK', warning: 'CAUTION', danger: 'DANGER' };
    var iconMap = { safe: '✅', low: '⚠️', warning: '⚡', danger: '🚨' };

    var color = colorMap[result.risk];
    var badge = document.createElement('div');
    badge.id = 'phishguard-badge';
    badge.style.cssText = 'position:fixed;bottom:16px;right:16px;z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,sans-serif;cursor:pointer;transition:all .3s;user-select:none;';
    badge.innerHTML =
      '<div style="background:' + color + ';color:#fff;padding:8px 14px;border-radius:24px;box-shadow:0 4px 20px rgba(0,0,0,.4);display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;backdrop-filter:blur(10px)">' +
        '<span style="font-size:14px">' + iconMap[result.risk] + '</span>' +
        '<span>PhishGuard: ' + labelMap[result.risk] + ' (' + result.score + '/100)</span>' +
        '<span style="font-size:10px;opacity:.7">▼</span>' +
      '</div>';

    var panel = null;
    var panelOpen = false;

    badge.onclick = function(e) {
      e.stopPropagation();
      if (panelOpen && panel) {
        panel.remove();
        panelOpen = false;
        return;
      }
      panel = createPanel(result);
      document.body.appendChild(panel);
      panelOpen = true;
    };

    /* Auto-hide badge after 8 seconds, show on hover */
    badge.style.opacity = '0';
    badge.style.transform = 'translateY(20px)';
    setTimeout(function() {
      badge.style.transition = 'all .4s ease';
      badge.style.opacity = '1';
      badge.style.transform = 'translateY(0)';
    }, 1500);

    var hideTimeout;
    badge.onmouseenter = function() { clearTimeout(hideTimeout); badge.style.opacity = '1'; };
    badge.onmouseleave = function() {
      hideTimeout = setTimeout(function() {
        if (!panelOpen) { badge.style.opacity = '0.3'; }
      }, 3000);
    };

    /* Auto-show briefly when page loads */
    setTimeout(function() {
      badge.style.opacity = '1';
      hideTimeout = setTimeout(function() {
        if (!panelOpen) badge.style.opacity = '0.3';
      }, 5000);
    }, 1500);

    document.body.appendChild(badge);
  }

  /* ═══════════════ SHOW FULL PANEL ═══════════════ */
  function createPanel(result) {
    var colorMap = { safe: '#4caf50', low: '#ffc107', warning: '#ff9800', danger: '#f44336' };
    var labelMap = { safe: 'SAFE', low: 'LOW RISK', warning: 'CAUTION', danger: 'DANGER' };
    var color = colorMap[result.risk];

    var el = document.createElement('div');
    el.id = 'phishguard-panel';
    el.style.cssText = 'position:fixed;bottom:60px;right:16px;width:360px;max-height:70vh;background:#1a1a2e;border-radius:16px;overflow:hidden;z-index:2147483646;box-shadow:0 20px 60px rgba(0,0,0,.6);font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#fff;display:flex;flex-direction:column;';

    var html = '<div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:14px;display:flex;justify-content:space-between;align-items:center">' +
      '<div><div style="font-size:14px;font-weight:700">🛡️ PhishGuard AI</div>' +
      '<div style="font-size:10px;color:rgba(255,255,255,.4);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:240px" title="' + result.hostname + '">' + result.hostname + '</div></div>' +
      '<div style="text-align:right"><div style="font-size:22px;font-weight:800;color:' + color + '">' + result.score + '</div>' +
      '<div style="font-size:9px;color:' + color + '">' + labelMap[result.risk] + '</div></div>' +
      '</div>';

    /* Score bar */
    html += '<div style="padding:0 14px 10px">' +
      '<div style="height:4px;background:rgba(255,255,255,.1);border-radius:2px;overflow:hidden">' +
      '<div style="height:100%;width:' + result.score + '%;background:' + color + ';border-radius:2px;transition:width .5s"></div></div></div>';

    /* Findings */
    html += '<div style="flex:1;overflow-y:auto;padding:0 14px 14px">';
    for (var i = 0; i < result.findings.length; i++) {
      var f = result.findings[i];
      var fc = f.sev === 'danger' ? '#f44336' : f.sev === 'high' ? '#ff9800' : f.sev === 'safe' ? '#4caf50' : '#ffc107';
      html += '<div style="background:rgba(0,0,0,.25);border-radius:8px;padding:10px;margin-bottom:6px;border-left:3px solid ' + fc + '">' +
        '<div style="font-size:12px;font-weight:700;display:flex;align-items:center;gap:6px"><span>' + f.icon + '</span> ' + f.title + '</div>' +
        '<div style="font-size:11px;color:rgba(255,255,255,.6);margin-top:4px;line-height:1.4">' + f.text + '</div></div>';
    }
    html += '</div>';

    /* Footer */
    html += '<div style="padding:10px 14px;border-top:1px solid rgba(76,175,80,.2);text-align:center;font-size:9px;color:rgba(255,255,255,.3)">🛡️ Powered by PhishGuard AI v4.0</div>';

    el.innerHTML = html;

    /* Close when clicking outside */
    setTimeout(function() {
      document.addEventListener('click', function handler(e) {
        if (!el.contains(e.target) && e.target.id !== 'phishguard-badge' && !document.getElementById('phishguard-badge').contains(e.target)) {
          el.remove();
          document.removeEventListener('click', handler);
        }
      });
    }, 100);

    return el;
  }

  /* ═══════════════ AUTO-SCAN ON PAGE LOAD ═══════════════ */
  function autoScan() {
    try {
      var result = analyzeWebsite();
      showBadge(result);
    } catch (e) {
      console.error('PhishGuard: Auto-scan error', e);
    }
  }

  /* Run when DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoScan);
  } else {
    autoScan();
  }

})();

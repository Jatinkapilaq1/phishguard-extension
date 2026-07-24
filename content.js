(function() {
  'use strict';

  const FORM_SELECTORS = 'form[action*="login"], form[action*="signin"], form[action*="verify"], form[action*="password"], form';
  const CREDENTIAL_INPUTS = 'input[type="password"], input[name*="password"], input[name*="pass"], input[name*="credential"], input[name*="pwd"]';

  let warningOverlay = null;
  let threatsFound = [];

  function init() {
    threatsFound = [];
    analyzePage();
    observeChanges();
    interceptForms();
    analyzePageContent();
  }

  function analyzePage() {
    const forms = document.querySelectorAll(FORM_SELECTORS);
    forms.forEach(analyzeForm);

    const credentialInputs = document.querySelectorAll(CREDENTIAL_INPUTS);
    if (credentialInputs.length > 0) {
      checkPageContext();
    }
  }

  function analyzeForm(form) {
    const action = form.action || '';
    const method = form.method?.toLowerCase() || 'get';

    const issues = [];

    if (method === 'get' && form.querySelector(CREDENTIAL_INPUTS)) {
      issues.push('Credentials sent via GET method');
    }

    if (!action.startsWith('https://') && action !== '') {
      issues.push('Form submits to non-HTTPS URL');
    }

    const hostname = window.location.hostname;
    if (action && !action.includes(hostname)) {
      issues.push('Form submits to different domain');
    }

    if (issues.length > 0) {
      showFormWarning(form, issues);
    }
  }

  function checkPageContext() {
    const hostname = window.location.hostname;
    const legitimateDomains = [
      'google.com', 'facebook.com', 'twitter.com', 'amazon.com',
      'microsoft.com', 'apple.com', 'github.com', 'linkedin.com'
    ];

    const isLegitimate = legitimateDomains.some(domain => hostname.endsWith(domain));

    if (!isLegitimate) {
      const pageContent = document.body?.innerText?.toLowerCase() || '';
      const brandMentions = [];

      const brands = {
        'paypal': /paypal/i,
        'amazon': /amazon/i,
        'microsoft': /microsoft|outlook|office365/i,
        'apple': /apple|icloud/i,
        'google': /google|gmail/i,
        'facebook': /facebook|fb/i,
        'netflix': /netflix/i
      };

      Object.entries(brands).forEach(([brand, regex]) => {
        if (regex.test(pageContent) && !hostname.includes(brand)) {
          brandMentions.push(brand);
        }
      });

      if (brandMentions.length > 0) {
        showBrandImpersonationWarning(brandMentions);
      }
    }
  }

  function interceptForms() {
    document.addEventListener('submit', async (event) => {
      const form = event.target;
      if (form.querySelector(CREDENTIAL_INPUTS)) {
        const formData = new FormData(form);
        const password = formData.get('password') || formData.get('passwd');

        if (password) {
          const isComplex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
          if (!isComplex) {
            console.log('Weak password detected - user education opportunity');
          }
        }
      }
    }, true);
  }

  function observeChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          analyzePage();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function showFormWarning(form, issues) {
    const warning = document.createElement('div');
    warning.className = 'phishguard-warning';
    warning.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff6b6b, #ee5a5a);
        color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 999999;
        max-width: 400px;
        font-family: Arial, sans-serif;
        animation: slideIn 0.3s ease-out;
      ">
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          <span style="font-size: 24px; margin-right: 10px;">⚠️</span>
          <strong style="font-size: 18px;">PhishGuard Warning</strong>
        </div>
        <p style="margin: 0 0 15px 0; line-height: 1.5;">
          Suspicious form detected on this page:
        </p>
        <ul style="margin: 0 0 15px 0; padding-left: 20px;">
          ${issues.map(issue => `<li style="margin: 5px 0;">${issue}</li>`).join('')}
        </ul>
        <div style="display: flex; gap: 10px;">
          <button id="phishguard-dismiss" style="
            flex: 1;
            padding: 10px;
            border: none;
            border-radius: 5px;
            background: rgba(255,255,255,0.2);
            color: white;
            cursor: pointer;
            font-weight: bold;
          ">Dismiss</button>
          <button id="phishguard-report" style="
            flex: 1;
            padding: 10px;
            border: none;
            border-radius: 5px;
            background: white;
            color: #ee5a5a;
            cursor: pointer;
            font-weight: bold;
          ">Report Phish</button>
        </div>
      </div>
    `;

    document.body.appendChild(warning);

    document.getElementById('phishguard-dismiss').addEventListener('click', () => {
      warning.remove();
    });

    document.getElementById('phishguard-report').addEventListener('click', () => {
      chrome.runtime.sendMessage({
        action: 'reportPhish',
        url: window.location.href,
        details: issues
      });
      warning.remove();
    });
  }

  function showBrandImpersonationWarning(brands) {
    const warning = document.createElement('div');
    warning.className = 'phishguard-warning';
    warning.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ffa500, #ff8c00);
        color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 999999;
        max-width: 400px;
        font-family: Arial, sans-serif;
      ">
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          <span style="font-size: 24px; margin-right: 10px;">🎭</span>
          <strong style="font-size: 18px;">Brand Impersonation Detected</strong>
        </div>
        <p style="margin: 0 0 15px 0; line-height: 1.5;">
          This page appears to impersonate: <strong>${brands.join(', ')}</strong>
        </p>
        <p style="margin: 0 0 15px 0; font-size: 14px; opacity: 0.9;">
          Domain: ${window.location.hostname}
        </p>
        <button id="phishguard-dismiss-brand" style="
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 5px;
          background: rgba(255,255,255,0.2);
          color: white;
          cursor: pointer;
          font-weight: bold;
        ">Understood</button>
      </div>
    `;

    document.body.appendChild(warning);

    document.getElementById('phishguard-dismiss-brand').addEventListener('click', () => {
      warning.remove();
    });
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'showWarning') {
      showPhishingAlert(request.result);
    }
  });

  function showPhishingAlert(result) {
    if (warningOverlay) warningOverlay.remove();

    warningOverlay = document.createElement('div');
    warningOverlay.id = 'phishguard-alert';
    warningOverlay.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999999;
        font-family: Arial, sans-serif;
      ">
        <div style="
          background: white;
          padding: 40px;
          border-radius: 20px;
          max-width: 500px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        ">
          <div style="font-size: 80px; margin-bottom: 20px;">🚫</div>
          <h1 style="color: #d32f2f; margin: 0 0 20px 0; font-size: 28px;">
            Phishing Detected!
          </h1>
          <p style="color: #666; margin: 0 0 20px 0; line-height: 1.6;">
            This website has been identified as a potential phishing site.
            Entering your credentials here could compromise your account.
          </p>
          <div style="
            background: #fff3e0;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            text-align: left;
          ">
            <strong>Threats detected:</strong>
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
              ${result.threats.map(t => `<li style="margin: 5px 0; color: #e65100;">${t}</li>`).join('')}
            </ul>
          </div>
          <div style="display: flex; gap: 10px;">
            <button id="phishguard-go-back" style="
              flex: 1;
              padding: 15px;
              border: none;
              border-radius: 10px;
              background: #d32f2f;
              color: white;
              cursor: pointer;
              font-size: 16px;
              font-weight: bold;
            ">Go Back</button>
            <button id="phishguard-continue" style="
              flex: 1;
              padding: 15px;
              border: none;
              border-radius: 10px;
              background: #ccc;
              color: #666;
              cursor: pointer;
              font-size: 16px;
            ">Continue Anyway</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(warningOverlay);

    document.getElementById('phishguard-go-back').addEventListener('click', () => {
      window.history.back();
    });

    document.getElementById('phishguard-continue').addEventListener('click', () => {
      warningOverlay.remove();
      warningOverlay = null;
    });
  }

  function analyzePageContent() {
    const hostname = window.location.hostname || '';
    const pageText = document.body?.innerText?.toLowerCase() || '';
    const pageTitle = document.title?.toLowerCase() || '';

    const brandPatterns = [
      { brand: 'paypal', patterns: ['paypal', 'pay pal'], domains: ['paypal.com'] },
      { brand: 'amazon', patterns: ['amazon', 'amzn', 'prime'], domains: ['amazon.com'] },
      { brand: 'google', patterns: ['google', 'gmail', 'google account'], domains: ['google.com'] },
      { brand: 'microsoft', patterns: ['microsoft', 'outlook', 'office 365', 'live.com'], domains: ['microsoft.com'] },
      { brand: 'apple', patterns: ['apple', 'icloud', 'apple id'], domains: ['apple.com'] },
      { brand: 'facebook', patterns: ['facebook', 'fb', 'meta'], domains: ['facebook.com'] },
      { brand: 'netflix', patterns: ['netflix'], domains: ['netflix.com'] },
      { brand: 'instagram', patterns: ['instagram'], domains: ['instagram.com'] }
    ];

    const suspiciousKeywords = [
      'verify your account', 'confirm your identity', 'account suspended',
      'unusual activity', 'security alert', 'login attempt', 'password expired',
      'update your information', 'act now', 'immediate action required',
      'click here', 'limited time', 'expires today'
    ];

    let detectedThreats = [];

    brandPatterns.forEach(({ brand, patterns, domains }) => {
      const mentioned = patterns.some(p => pageText.includes(p) || pageTitle.includes(p));
      const onOfficialDomain = domains.some(d => hostname.includes(d));

      if (mentioned && !onOfficialDomain) {
        detectedThreats.push({
          type: 'brand_impersonation',
          brand: brand,
          severity: 'high',
          message: `Fake ${brand} page detected - not on official domain`
        });
      }
    });

    suspiciousKeywords.forEach(keyword => {
      if (pageText.includes(keyword) || pageTitle.includes(keyword)) {
        detectedThreats.push({
          type: 'social_engineering',
          severity: 'medium',
          message: `Suspicious text: "${keyword}"`
        });
      }
    });

    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      const hasPassword = form.querySelector('input[type="password"]');
      const action = form.action || '';
      
      if (hasPassword) {
        if (action.includes('http://') && !hostname.includes('localhost')) {
          detectedThreats.push({
            type: 'insecure_form',
            severity: 'high',
            message: 'Login form submits over insecure HTTP'
          });
        }
        
        if (action && !action.includes(hostname) && action !== '') {
          detectedThreats.push({
            type: 'cross_domain_form',
            severity: 'high',
            message: 'Login form sends data to different domain'
          });
        }
      }
    });

    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      const src = iframe.src || '';
      if (src && !src.includes(hostname) && src !== 'about:blank') {
        detectedThreats.push({
          type: 'suspicious_iframe',
          severity: 'medium',
          message: 'Embedded content from external source'
        });
      }
    });

    if (detectedThreats.length > 0) {
      threatsFound = detectedThreats;
      sendThreatsToPopup(detectedThreats);
      
      const highSeverity = detectedThreats.some(t => t.severity === 'high');
      if (highSeverity) {
        showContentWarning(detectedThreats);
      }
    }
  }

  function sendThreatsToPopup(threats) {
    chrome.runtime.sendMessage({
      action: 'contentThreatsDetected',
      threats: threats,
      url: window.location.href
    }).catch(() => {});
  }

  function showContentWarning(threats) {
    if (document.getElementById('phishguard-content-warning')) return;

    const highThreats = threats.filter(t => t.severity === 'high');
    
    const threatDetails = highThreats.map(t => {
      let explanation = '';
      let prevention = '';
      
      if (t.type === 'brand_impersonation') {
        explanation = `This page pretends to be ${t.brand} but is NOT on their official website. Scammers create fake login pages to steal your credentials.`;
        prevention = 'Always check the URL bar. Official sites use HTTPS and have the correct domain (paypal.com not paypal-secure.tk)';
      } else if (t.type === 'insecure_form') {
        explanation = 'This form sends your password over unencrypted HTTP. Anyone on the network can intercept and read your password.';
        prevention = 'Never enter passwords on HTTP sites. Look for the padlock icon and HTTPS in the URL bar.';
      } else if (t.type === 'cross_domain_form') {
        explanation = 'This login form sends your credentials to a different website. Your password will be stolen.';
        prevention = 'Only enter passwords on the official website you intended to visit.';
      } else if (t.type === 'social_engineering') {
        explanation = 'This page uses psychological manipulation to pressure you into acting without thinking.';
        prevention = 'Legitimate companies never ask you to "verify immediately" via email links. Contact them directly instead.';
      }
      
      return `
        <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; margin-bottom: 10px;">
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 16px; margin-right: 8px;">${t.type === 'brand_impersonation' ? '🎭' : t.type === 'insecure_form' ? '🔓' : t.type === 'social_engineering' ? '🎣' : '⚠️'}</span>
            <strong style="font-size: 13px;">${t.message}</strong>
          </div>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #ffcccc; line-height: 1.4;">
            <strong>What this means:</strong> ${explanation}
          </p>
          <p style="margin: 0; font-size: 12px; color: #ccffcc; line-height: 1.4;">
            <strong>How to stay safe:</strong> ${prevention}
          </p>
        </div>
      `;
    }).join('');
    
    const warning = document.createElement('div');
    warning.id = 'phishguard-content-warning';
    warning.innerHTML = `
      <div id="phishguard-warning-box" style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        color: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.6);
        z-index: 999999;
        max-width: 400px;
        max-height: 80vh;
        overflow-y: auto;
        font-family: Arial, sans-serif;
        border: 1px solid rgba(255,0,0,0.3);
      ">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
          <div style="display: flex; align-items: center;">
            <span style="font-size: 28px; margin-right: 10px;">🚨</span>
            <strong style="font-size: 16px;">PhishGuard Security Alert</strong>
          </div>
          <button id="phishguard-close-btn" style="
            background: rgba(255,255,255,0.1);
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 5px 10px;
            border-radius: 5px;
          ">✕</button>
        </div>
        <p style="margin: 0 0 15px 0; font-size: 14px; color: #ff6b6b;">
          ⛔ This website is trying to steal your information!
        </p>
        ${threatDetails}
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
          <p style="margin: 0 0 10px 0; font-size: 11px; color: rgba(255,255,255,0.6);">
            🛡️ Protected by PhishGuard AI | Click shield icon for more options
          </p>
          <button id="phishguard-dismiss-btn" style="
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 8px;
            background: linear-gradient(135deg, #4caf50, #45a049);
            color: white;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
          ">I Understand - Go Back</button>
        </div>
      </div>
    `;

    document.body.appendChild(warning);

    document.getElementById('phishguard-close-btn').addEventListener('click', function() {
      const box = document.getElementById('phishguard-warning-box');
      if (box) box.remove();
    });

    document.getElementById('phishguard-dismiss-btn').addEventListener('click', function() {
      const box = document.getElementById('phishguard-warning-box');
      if (box) box.remove();
    });
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'showWarning') {
      showPhishingAlert(request.result);
    }
    if (request.action === 'getThreats') {
      sendResponse({ threats: threatsFound });
    }
  });

  function showPhishingAlert(result) {
    if (warningOverlay) warningOverlay.remove();

    warningOverlay = document.createElement('div');
    warningOverlay.id = 'phishguard-alert';
    warningOverlay.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999999;
        font-family: Arial, sans-serif;
      ">
        <div style="
          background: white;
          padding: 40px;
          border-radius: 20px;
          max-width: 500px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        ">
          <div style="font-size: 80px; margin-bottom: 20px;">🚫</div>
          <h1 style="color: #d32f2f; margin: 0 0 20px 0; font-size: 28px;">
            Phishing Detected!
          </h1>
          <p style="color: #666; margin: 0 0 20px 0; line-height: 1.6;">
            This website has been identified as a potential phishing site.
            Entering your credentials here could compromise your account.
          </p>
          <div style="
            background: #fff3e0;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            text-align: left;
          ">
            <strong>Threats detected:</strong>
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
              ${result.threats.map(t => `<li style="margin: 5px 0; color: #e65100;">${typeof t === 'string' ? t : t.message}</li>`).join('')}
            </ul>
          </div>
          <div style="display: flex; gap: 10px;">
            <button id="phishguard-go-back" style="
              flex: 1;
              padding: 15px;
              border: none;
              border-radius: 10px;
              background: #d32f2f;
              color: white;
              cursor: pointer;
              font-size: 16px;
              font-weight: bold;
            ">Go Back</button>
            <button id="phishguard-continue" style="
              flex: 1;
              padding: 15px;
              border: none;
              border-radius: 10px;
              background: #ccc;
              color: #666;
              cursor: pointer;
              font-size: 16px;
            ">Continue Anyway</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(warningOverlay);

    document.getElementById('phishguard-go-back').addEventListener('click', () => {
      window.history.back();
    });

    document.getElementById('phishguard-continue').addEventListener('click', () => {
      warningOverlay.remove();
      warningOverlay = null;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
const PHISHING_DATABASES = {
  phishtank: 'https://data.phishtank.com/data/online-valid.json',
  openphish: 'https://openphish.com/feed.txt',
  googleSafeBrowsing: 'https://safebrowsing.googleapis.com/v4/threatMatches:find'
};

const SUSPICIOUS_KEYWORDS = [
  'login', 'verify', 'account', 'secure', 'banking', 'paypal', 'amazon',
  'microsoft', 'apple', 'google', 'facebook', 'twitter', 'instagram',
  'password', 'credential', 'update', 'confirm', 'suspended', 'unusual'
];

const FREE_API_KEYS = {
  virustotal: '',
  urlscan: ''
};

let knownPhishingUrls = new Set();
let scanStats = {
  totalScanned: 0,
  threatsBlocked: 0,
  lastUpdated: null
};

chrome.runtime.onInstalled.addListener(() => {
  console.log('PhishGuard AI installed');
  loadPhishingDatabases();
  setInterval(loadPhishingDatabases, 3600000);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scanUrl') {
    scanUrl(request.url).then(result => sendResponse(result));
    return true;
  }
  
  if (request.action === 'getStats') {
    sendResponse(scanStats);
    return true;
  }
  
  if (request.action === 'reportPhish') {
    reportPhishing(request.url, request.details);
    sendResponse({ success: true });
    return true;
  }
});

async function loadPhishingDatabases() {
  try {
    const response = await fetch(PHISHING_DATABASES.openphish);
    const text = await response.text();
    const urls = text.split('\n').filter(url => url.trim());
    urls.forEach(url => knownPhishingUrls.add(url.trim()));
    
    scanStats.lastUpdated = new Date().toISOString();
    console.log(`Loaded ${urls.length} phishing URLs`);
  } catch (error) {
    console.error('Error loading phishing database:', error);
  }
}

async function scanUrl(url) {
  scanStats.totalScanned++;
  
  const result = {
    url: url,
    isPhishing: false,
    riskLevel: 'low',
    threats: [],
    details: {}
  };

  if (knownPhishingUrls.has(url)) {
    result.isPhishing = true;
    result.riskLevel = 'critical';
    result.threats.push('Known phishing URL');
  }

  const urlAnalysis = analyzeUrl(url);
  if (urlAnalysis.suspicious) {
    result.threats.push(...urlAnalysis.threats);
    if (urlAnalysis.riskLevel === 'high') {
      result.isPhishing = true;
      result.riskLevel = 'high';
    }
  }

  if (FREE_API_KEYS.virustotal) {
    const vtResult = await checkVirusTotal(url);
    if (vtResult.malicious) {
      result.isPhishing = true;
      result.riskLevel = 'critical';
      result.threats.push('Flagged by VirusTotal');
    }
  }

  if (result.isPhishing) {
    scanStats.threatsBlocked++;
  }

  chrome.storage.local.set({ scanStats });
  
  return result;
}

function analyzeUrl(url) {
  const result = {
    suspicious: false,
    threats: [],
    riskLevel: 'low'
  };

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
      result.suspicious = true;
      result.threats.push('IP address instead of domain');
      result.riskLevel = 'high';
    }

    const dotCount = (hostname.match(/\./g) || []).length;
    if (dotCount > 3) {
      result.suspicious = true;
      result.threats.push('Unusually long domain');
      result.riskLevel = 'medium';
    }

    const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.buzz'];
    if (suspiciousTlds.some(tld => hostname.endsWith(tld))) {
      result.suspicious = true;
      result.threats.push('Suspicious TLD');
      result.riskLevel = 'medium';
    }

    SUSPICIOUS_KEYWORDS.forEach(keyword => {
      if (hostname.includes(keyword) && !hostname.endsWith(`${keyword}.com`)) {
        result.suspicious = true;
        result.threats.push(`Contains suspicious keyword: ${keyword}`);
      }
    });

    if (hostname.includes('@') || url.includes('://@')) {
      result.suspicious = true;
      result.threats.push('Contains @ symbol in URL');
      result.riskLevel = 'high';
    }

    if (urlObj.protocol === 'http:' && hostname !== 'localhost') {
      result.suspicious = true;
      result.threats.push('Using HTTP instead of HTTPS');
    }

  } catch (e) {
    result.suspicious = true;
    result.threats.push('Malformed URL');
  }

  return result;
}

async function checkVirusTotal(url) {
  try {
    const response = await fetch(`${PHISHING_DATABASES.googleSafeBrowsing}?key=${FREE_API_KEYS.virustotal}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client: { clientId: 'phishguard', clientVersion: '1.0.0' },
        threatInfo: {
          threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url }]
        }
      })
    });
    const data = await response.json();
    return { malicious: data.matches && data.matches.length > 0 };
  } catch (error) {
    return { malicious: false };
  }
}

async function reportPhishing(url, details) {
  console.log('Phishing reported:', url, details);
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    scanUrl(changeInfo.url).then(result => {
      if (result.isPhishing) {
        chrome.tabs.sendMessage(tabId, {
          action: 'showWarning',
          result: result
        });
      }
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'contentThreatsDetected') {
    scanStats.totalScanned++;
    if (request.threats && request.threats.some(t => t.severity === 'high')) {
      scanStats.threatsBlocked++;
    }
    chrome.storage.local.set({ scanStats });
  }
});
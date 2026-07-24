/**
 * Layer 3: URL Intelligence
 * Analyzes URLs for phishing indicators, redirects, encoding
 */

class URLIntelligenceLayer {
  constructor() {
    this.urlShorteners = [
      'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'is.gd', 'buff.ly',
      'ow.ly', 'cutt.ly', 'short.io', 'rb.gy', 'dwz.one', 'v.gd',
      'adf.ly', 'bl.ink', 'lnkd.in', 'tiny.cc', 'qr.ae'
    ];

    this.suspiciousParameters = [
      'redirect', 'url', 'link', 'goto', 'next', 'return', 'continue',
      'checkout', 'verify', 'confirm', 'login', 'signin', 'auth',
      'token', 'session', 'ref', 'aff', 'campaign', 'track'
    ];

    this.credentialHarvestingPaths = [
      '/login', '/signin', '/auth', '/verify', '/confirm', '/account',
      '/secure', '/update', '/password', '/credential', '/session',
      '/checkout', '/payment', '/billing', '/subscribe'
    ];

    this.suspiciousFileExtensions = [
      '.exe', '.scr', '.bat', '.cmd', '.com', '.pif', '.vbs', '.js',
      '.ws', '.wsf', '.msi', '.msp', '.mst', '.cpl', '.hta', '.inf',
      '.reg', '.rgs', '.sct', '.shb', '.shs', '.url', '.xnk'
    ];
  }

  async analyze(emailData) {
    const evidence = [];
    let score = 0;
    let confidence = 0.8;

    const urls = this.extractURLs(emailData);

    // Analyze each URL
    for (const url of urls) {
      const urlAnalysis = await this.analyzeURL(url);
      
      if (urlAnalysis.suspicious) {
        score += urlAnalysis.score;
        evidence.push(...urlAnalysis.evidence);
      }
    }

    // Check for URL shorteners
    const shortenerResult = this.checkURLShorteners(urls);
    if (shortenerResult.found) {
      score += shortenerResult.score;
      evidence.push({
        type: 'url_shortener',
        severity: 'medium',
        finding: shortenerResult.message,
        explanation: shortenerResult.explanation
      });
    }

    // Check for encoded URLs
    const encodingResult = this.checkURLEncoding(emailData);
    if (encodingResult.suspicious) {
      score += encodingResult.score;
      evidence.push({
        type: 'encoded_urls',
        severity: 'high',
        finding: encodingResult.message,
        explanation: encodingResult.explanation
      });
    }

    // Check for credential harvesting patterns
    const harvestResult = this.checkCredentialHarvesting(urls);
    if (harvestResult.suspicious) {
      score += harvestResult.score;
      evidence.push({
        type: 'credential_harvesting',
        severity: 'critical',
        finding: harvestResult.message,
        explanation: harvestResult.explanation
      });
    }

    // Check for suspicious file downloads
    const downloadResult = this.checkSuspiciousDownloads(urls);
    if (downloadResult.suspicious) {
      score += downloadResult.score;
      evidence.push({
        type: 'suspicious_download',
        severity: 'critical',
        finding: downloadResult.message,
        explanation: downloadResult.explanation
      });
    }

    // Check URL reputation
    const reputationResult = await this.checkURLReputation(urls);
    if (reputationResult.suspicious) {
      score += reputationResult.score;
      evidence.push({
        type: 'url_reputation',
        severity: 'high',
        finding: reputationResult.message,
        explanation: reputationResult.explanation
      });
    }

    return {
      score: Math.min(score, 100),
      confidence: confidence,
      evidence: evidence,
      details: { urls: urls, analyzed: urls.length }
    };
  }

  extractURLs(emailData) {
    const urls = [];
    const text = emailData.body || emailData.text || '';
    const html = emailData.html || '';

    // Extract from HTML href attributes
    const hrefRegex = /href=["'](https?:\/\/[^"']+)["']/gi;
    let match;
    while ((match = hrefRegex.exec(html)) !== null) {
      urls.push(this.decodeURL(match[1]));
    }

    // Extract from plain text
    const urlRegex = /(https?:\/\/[^\s<>"]+)/gi;
    while ((match = urlRegex.exec(text)) !== null) {
      urls.push(this.decodeURL(match[1]));
    }

    // Extract from markdown-style links
    const markdownRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/gi;
    while ((match = markdownRegex.exec(text)) !== null) {
      urls.push(this.decodeURL(match[2]));
    }

    return [...new Set(urls)]; // Remove duplicates
  }

  decodeURL(url) {
    try {
      // Decode URL encoding
      let decoded = decodeURIComponent(url);
      
      // Decode double encoding
      if (decoded !== url) {
        decoded = decodeURIComponent(decoded);
      }
      
      // Decode HTML entities
      decoded = decoded
        .replace(/&#x27;/g, "'")
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"');
      
      return decoded;
    } catch (e) {
      return url;
    }
  }

  async analyzeURL(url) {
    const evidence = [];
    let score = 0;

    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      const pathname = urlObj.pathname;
      const search = urlObj.search;
      const fullUrl = url.toLowerCase();

      // 1. Check for IP address instead of domain
      if (this.isIPAddress(hostname)) {
        score += 25;
        evidence.push({
          type: 'ip_address_url',
          severity: 'critical',
          finding: `URL uses IP address instead of domain: ${hostname}`,
          explanation: 'Legitimate websites use domain names, not IP addresses. An IP address URL is a major red flag indicating the attacker is hiding the real destination.'
        });
      }

      // 2. Check for HTTP instead of HTTPS
      if (urlObj.protocol === 'http:') {
        score += 15;
        evidence.push({
          type: 'http_protocol',
          severity: 'high',
          finding: `URL uses insecure HTTP protocol: ${url}`,
          explanation: 'This URL does not use encryption. Any data you enter (passwords, credit cards) can be intercepted. Legitimate websites use HTTPS.'
        });
      }

      // 3. Check for port numbers (unusual for legitimate sites)
      if (urlObj.port && urlObj.port !== '80' && urlObj.port !== '443') {
        score += 10;
        evidence.push({
          type: 'unusual_port',
          severity: 'medium',
          finding: `URL uses unusual port: ${urlObj.port}`,
          explanation: 'Legitimate websites typically use standard ports (80 for HTTP, 443 for HTTPS). Non-standard ports may indicate a phishing server.'
        });
      }

      // 4. Check for @ symbol (URL confusion attack)
      if (url.includes('@')) {
        score += 20;
        evidence.push({
          type: 'at_symbol_url',
          severity: 'critical',
          finding: `URL contains @ symbol: ${url}`,
          explanation: 'The @ symbol in URLs is used to confuse users. Everything before @ is ignored by browsers. This is a classic phishing technique.'
        });
      }

      // 5. Check for suspicious TLDs in URL
      const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.buzz'];
      if (suspiciousTlds.some(tld => hostname.endsWith(tld))) {
        score += 18;
        evidence.push({
          type: 'suspicious_url_tld',
          severity: 'high',
          finding: `URL uses suspicious TLD: ${hostname}`,
          explanation: 'The TLD is commonly associated with phishing due to low cost and anonymous registration.'
        });
      }

      // 6. Check for brand impersonation in URL
      const brandCheck = this.checkBrandInURL(hostname);
      if (brandCheck.suspicious) {
        score += brandCheck.score;
        evidence.push({
          type: 'brand_impersonation_url',
          severity: 'high',
          finding: brandCheck.message,
          explanation: brandCheck.explanation
        });
      }

      // 7. Check for excessive subdomains
      const subdomains = hostname.split('.');
      if (subdomains.length > 3) {
        score += 12;
        evidence.push({
          type: 'excessive_subdomains',
          severity: 'medium',
          finding: `URL has excessive subdomains: ${hostname}`,
          explanation: 'Phishing URLs often use many subdomains to confuse users about the actual domain.'
        });
      }

      // 8. Check for encoded characters in URL
      if (url.includes('%') && (url.includes('%40') || url.includes('%2F') || url.includes('%5C'))) {
        score += 8;
        evidence.push({
          type: 'encoded_characters',
          severity: 'medium',
          finding: 'URL contains suspicious encoded characters',
          explanation: 'Encoded characters in URLs can be used to hide malicious destinations.'
        });
      }

      // 9. Check for data: URLs (can execute JavaScript)
      if (url.startsWith('data:')) {
        score += 30;
        evidence.push({
          type: 'data_url',
          severity: 'critical',
          finding: 'URL uses data: protocol',
          explanation: 'Data URLs can contain embedded scripts and are commonly used in XSS attacks.'
        });
      }

      // 10. Check for javascript: URLs
      if (url.startsWith('javascript:')) {
        score += 35;
        evidence.push({
          type: 'javascript_url',
          severity: 'critical',
          finding: 'URL uses javascript: protocol',
          explanation: 'JavaScript URLs can execute arbitrary code and are extremely dangerous.'
        });
      }

      // 11. Check path for credential harvesting
      if (this.credentialHarvestingPaths.some(p => pathname.toLowerCase().includes(p))) {
        score += 15;
        evidence.push({
          type: 'credential_path',
          severity: 'high',
          finding: `URL path suggests credential harvesting: ${pathname}`,
          explanation: 'The URL path is designed to look like a login page. Always verify the domain before entering credentials.'
        });
      }

      // 12. Check for suspicious query parameters
      const params = new URLSearchParams(search);
      for (const [key, value] of params) {
        if (this.suspiciousParameters.includes(key.toLowerCase())) {
          score += 8;
          evidence.push({
            type: 'suspicious_parameter',
            severity: 'medium',
            finding: `Suspicious URL parameter: ${key}`,
            explanation: 'This parameter is commonly used in phishing URLs to track or redirect victims.'
          });
          break;
        }
      }

    } catch (e) {
      // Invalid URL
      score += 10;
      evidence.push({
        type: 'invalid_url',
        severity: 'medium',
        finding: 'Email contains malformed/invalid URL',
        explanation: 'The URL structure is invalid, which may indicate an attempt to bypass security filters.'
      });
    }

    return {
      suspicious: score > 0,
      score: score,
      evidence: evidence
    };
  }

  isIPAddress(hostname) {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Regex.test(hostname) || ipv6Regex.test(hostname);
  }

  checkBrandInURL(hostname) {
    const brands = {
      'google': ['google.com', 'google.co'],
      'microsoft': ['microsoft.com', 'live.com', 'outlook.com', 'office.com'],
      'apple': ['apple.com', 'icloud.com'],
      'amazon': ['amazon.com', 'amazon.co'],
      'paypal': ['paypal.com'],
      'facebook': ['facebook.com', 'fb.com', 'meta.com'],
      'netflix': ['netflix.com'],
      'linkedin': ['linkedin.com'],
      'twitter': ['twitter.com', 'x.com']
    };

    for (const [brand, domains] of Object.entries(brands)) {
      if (hostname.includes(brand) && !domains.some(d => hostname.endsWith(d))) {
        return {
          suspicious: true,
          score: 20,
          message: `URL contains "${brand}" but is not on official domain: ${hostname}`,
          explanation: `This URL pretends to be ${brand} but the actual domain is ${hostname}. Official ${brand} sites use ${domains[0]}.`
        };
      }
    }

    return { suspicious: false };
  }

  checkURLShorteners(urls) {
    for (const url of urls) {
      try {
        const hostname = new URL(url).hostname;
        if (this.urlShorteners.some(s => hostname.includes(s))) {
          return {
            found: true,
            score: 12,
            message: `URL shortener detected: ${hostname}`,
            explanation: 'URL shorteners hide the real destination. Scammers use them to disguise malicious links. Always be suspicious of shortened URLs and consider using a URL expander.'
          };
        }
      } catch (e) {}
    }

    return { found: false };
  }

  checkURLEncoding(emailData) {
    const html = emailData.html || '';
    const text = emailData.body || '';

    // Check for heavily encoded URLs
    const encodedPattern = /%[0-9A-Fa-f]{2}/g;
    const encodedCount = (html.match(encodedPattern) || []).length;
    
    if (encodedCount > 20) {
      return {
        suspicious: true,
        score: 15,
        message: `Email contains heavily encoded URLs (${encodedCount} encoded characters)`,
        explanation: 'Heavy URL encoding is used to obfuscate malicious links and bypass security filters.'
      };
    }

    // Check for display text vs actual URL mismatch
    const linkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi;
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
      const displayText = match[2].trim();
      const actualUrl = match[1];
      
      if (displayText.startsWith('http') && !displayText.includes(actualUrl.split('/')[2])) {
        return {
          suspicious: true,
          score: 18,
          message: 'Link display text shows different domain than actual URL',
          explanation: 'The clickable text shows one URL but actually links to another. This is a classic phishing technique.'
        };
      }
    }

    return { suspicious: false };
  }

  checkCredentialHarvesting(urls) {
    const suspiciousPaths = [
      '/login', '/signin', '/auth', '/verify', '/confirm', '/account',
      '/secure', '/update', '/password', '/credential', '/session',
      '/checkout', '/payment', '/billing', '/subscribe', '/unlock',
      '/restore', '/recover', '/reset'
    ];

    for (const url of urls) {
      try {
        const urlObj = new URL(url);
        const path = urlObj.pathname.toLowerCase();
        
        if (suspiciousPaths.some(p => path.includes(p))) {
          // Check if it's on a suspicious domain
          const domain = urlObj.hostname;
          const isSuspiciousDomain = !this.isLegitimateDomain(domain);
          
          if (isSuspiciousDomain) {
            return {
              suspicious: true,
              score: 22,
              message: `Credential harvesting URL detected: ${url}`,
              explanation: 'This URL is designed to look like a login page on a suspicious domain. Never enter credentials on unfamiliar websites.'
            };
          }
        }
      } catch (e) {}
    }

    return { suspicious: false };
  }

  isLegitimateDomain(domain) {
    const trusted = [
      'google.com', 'microsoft.com', 'apple.com', 'amazon.com', 'paypal.com',
      'facebook.com', 'linkedin.com', 'twitter.com', 'github.com', 'netflix.com'
    ];
    return trusted.some(t => domain.endsWith(t));
  }

  checkSuspiciousDownloads(urls) {
    for (const url of urls) {
      try {
        const urlObj = new URL(url);
        const path = urlObj.pathname.toLowerCase();
        
        for (const ext of this.suspiciousFileExtensions) {
          if (path.endsWith(ext)) {
            return {
              suspicious: true,
              score: 30,
              message: `Suspicious file download detected: ${url}`,
              explanation: `This URL points to a ${ext} file, which can contain malware, ransomware, or viruses. NEVER download and run executable files from emails.`
            };
          }
        }
      } catch (e) {}
    }

    return { suspicious: false };
  }

  async checkURLReputation(urls) {
    // In production, check against:
    // - Google Safe Browsing API
    // - VirusTotal API
    // - URLScan.io API
    // - PhishTank API
    
    return { suspicious: false };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = URLIntelligenceLayer;
}
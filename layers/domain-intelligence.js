/**
 * Layer 2: Domain Intelligence
 * Analyzes domain age, DNS records, SSL, entropy, subdomain abuse
 */

class DomainIntelligenceLayer {
  constructor() {
    this.suspiciousRegistrars = [
      'namecheap', 'godaddy (common for phishing)', 'freenom', 'reg.ru',
      'dynadot', 'tucows', 'publicdomainregistry'
    ];

    this.trustedDomains = [
      'google.com', 'microsoft.com', 'apple.com', 'amazon.com', 'paypal.com',
      'facebook.com', 'meta.com', 'twitter.com', 'x.com', 'linkedin.com',
      'github.com', 'netflix.com', 'spotify.com', 'adobe.com', 'dropbox.com',
      'zoom.us', 'slack.com', 'teams.microsoft.com', 'office.com',
      'chase.com', 'wellsfargo.com', 'bankofamerica.com', 'citibank.com',
      'sbi.co.in', 'hdfcbank.com', 'icicibank.com', 'axisbank.com',
      'zomato.com', 'swiggy.com', 'uber.com', 'ola.com',
      'flipkart.com', 'amazon.in', 'paytm.com', 'phonepe.com'
    ];

    this.suspiciousTlds = [
      '.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.buzz', '.club',
      '.work', '.click', '.link', '.fun', '.site', '.online', '.icu', '.monster',
      '.surf', '.rest', '.cfd', '.sbs', '.lol', '.cam', '.solar', '.hair'
    ];
  }

  async analyze(emailData) {
    const evidence = [];
    let score = 0;
    let confidence = 0.75;

    const senderDomain = emailData.sender.split('@')[1] || '';

    // 1. Check if domain is trusted
    if (this.isTrustedDomain(senderDomain)) {
      return {
        score: 0,
        confidence: 0.95,
        evidence: [{
          type: 'trusted_domain',
          severity: 'info',
          finding: `Sender domain ${senderDomain} is a verified legitimate domain`,
          explanation: 'This domain belongs to a well-known, verified organization.'
        }],
        details: { domain: senderDomain, trusted: true }
      };
    }

    // 2. Domain Age Analysis (simulated - would use WHOIS API)
    const ageResult = await this.checkDomainAge(senderDomain);
    if (ageResult.suspicious) {
      score += ageResult.score;
      evidence.push({
        type: 'domain_age',
        severity: ageResult.score > 15 ? 'high' : 'medium',
        finding: ageResult.message,
        explanation: ageResult.explanation
      });
    }

    // 3. DNS Record Analysis
    const dnsResult = await this.checkDNSRecords(senderDomain);
    if (dnsResult.issues.length > 0) {
      score += dnsResult.score;
      evidence.push(...dnsResult.evidence);
    }

    // 4. SSL Certificate Check (simulated)
    const sslResult = await this.checkSSL(senderDomain);
    if (sslResult.suspicious) {
      score += sslResult.score;
      evidence.push({
        type: 'ssl_issue',
        severity: 'medium',
        finding: sslResult.message,
        explanation: sslResult.explanation
      });
    }

    // 5. Entropy Score (random/suspicious domain names)
    const entropyResult = this.calculateEntropy(senderDomain);
    if (entropyResult.suspicious) {
      score += entropyResult.score;
      evidence.push({
        type: 'high_entropy',
        severity: 'medium',
        finding: entropyResult.message,
        explanation: entropyResult.explanation
      });
    }

    // 6. Subdomain Abuse Detection
    const subdomainResult = this.checkSubdomainAbuse(senderDomain);
    if (subdomainResult.suspicious) {
      score += subdomainResult.score;
      evidence.push({
        type: 'subdomain_abuse',
        severity: 'high',
        finding: subdomainResult.message,
        explanation: subdomainResult.explanation
      });
    }

    // 7. Suspicious TLD Check
    const tldResult = this.checkSuspiciousTld(senderDomain);
    if (tldResult.suspicious) {
      score += tldResult.score;
      evidence.push({
        type: 'suspicious_tld',
        severity: 'high',
        finding: tldResult.message,
        explanation: tldResult.explanation
      });
    }

    // 8. Typosquatting Detection
    const typosquatResult = this.checkTyposquatting(senderDomain);
    if (typosquatResult.suspicious) {
      score += typosquatResult.score;
      evidence.push({
        type: 'typosquatting',
        severity: 'critical',
        finding: typosquatResult.message,
        explanation: typosquatResult.explanation
      });
    }

    // 9. Domain Reputation Check (simulated)
    const reputationResult = await this.checkDomainReputation(senderDomain);
    if (reputationResult.suspicious) {
      score += reputationResult.score;
      evidence.push({
        type: 'domain_reputation',
        severity: 'high',
        finding: reputationResult.message,
        explanation: reputationResult.explanation
      });
    }

    return {
      score: Math.min(score, 100),
      confidence: confidence,
      evidence: evidence,
      details: { domain: senderDomain }
    };
  }

  isTrustedDomain(domain) {
    return this.trustedDomains.some(trusted => domain === trusted || domain.endsWith('.' + trusted));
  }

  async checkDomainAge(domain) {
    // Simulated WHOIS check - in production, use WHOIS API
    // This would be: const whoisData = await fetch(`https://www.whoisxmlapi.com/whoisserver/WhoisService?domainName=${domain}`);
    
    // For demo, we'll check patterns that suggest new domains
    const suspiciousPatterns = [
      /\d{10,}/, // Long numbers (random domains)
      /[a-z]{20,}/, // Very long random strings
      /-secure-|login-|verify-|account-/i, // Phishing keywords in domain
      /\d{4,}/ // Multiple consecutive numbers
    ];

    const isSuspicious = suspiciousPatterns.some(p => p.test(domain));
    
    if (isSuspicious) {
      return {
        suspicious: true,
        score: 15,
        message: `Domain ${domain} shows patterns of newly registered/phishing domain`,
        explanation: 'The domain structure suggests it was recently created specifically for phishing. Phishing domains are typically short-lived and use patterns that mimic legitimate services.'
      };
    }

    return { suspicious: false };
  }

  async checkDNSRecords(domain) {
    const issues = [];
    const evidence = [];
    let score = 0;

    // Simulated DNS checks - in production, use DNS lookup APIs
    // Check for SPF, DKIM, DMARC records
    
    // Common patterns for domains without proper email authentication
    const hasSPF = true; // Would check TXT records
    const hasDKIM = true; // Would check._domainkey TXT
    const hasDMARC = true; // Would check _dmarc.TXT

    if (!hasSPF) {
      score += 10;
      evidence.push({
        type: 'missing_spf',
        severity: 'medium',
        finding: `Domain ${domain} lacks SPF record`,
        explanation: 'SPF (Sender Policy Framework) helps prevent email spoofing. Legitimate domains almost always have SPF configured.'
      });
      issues.push('missing_spf');
    }

    if (!hasDMARC) {
      score += 8;
      evidence.push({
        type: 'missing_dmarc',
        severity: 'medium',
        finding: `Domain ${domain} lacks DMARC policy`,
        explanation: 'DMARC (Domain-based Message Authentication) is an email authentication protocol. Its absence suggests the domain may not be properly configured.'
      });
      issues.push('missing_dmarc');
    }

    return { issues, score, evidence };
  }

  async checkSSL(domain) {
    // Simulated SSL check - in production, use SSL certificate APIs
    // Check for: certificate age, issuer, validity
    
    return {
      suspicious: false,
      score: 0,
      message: '',
      explanation: ''
    };
  }

  calculateEntropy(domain) {
    // Shannon entropy calculation for domain name randomness
    const str = domain.replace(/\./g, '');
    const freq = {};
    
    for (const char of str) {
      freq[char] = (freq[char] || 0) + 1;
    }
    
    let entropy = 0;
    const len = str.length;
    
    for (const char in freq) {
      const p = freq[char] / len;
      entropy -= p * Math.log2(p);
    }

    // High entropy indicates random/suspicious domain
    if (entropy > 3.5 && str.length > 8) {
      return {
        suspicious: true,
        score: 12,
        message: `Domain ${domain} has high entropy (${entropy.toFixed(2)}) - likely randomly generated`,
        explanation: 'The domain name appears to be randomly generated rather than a meaningful brand name. Random domains are commonly used in phishing campaigns.'
      };
    }

    return { suspicious: false };
  }

  checkSubdomainAbuse(domain) {
    const parts = domain.split('.');
    
    // Check for excessive subdomains
    if (parts.length > 3) {
      const rootDomain = parts.slice(-2).join('.');
      const subdomain = parts.slice(0, -2).join('.');
      
      // Check if subdomain contains brand names
      const brands = ['google', 'microsoft', 'apple', 'amazon', 'paypal', 'facebook', 'netflix', 'bank', 'secure', 'login', 'verify', 'account'];
      
      for (const brand of brands) {
        if (subdomain.includes(brand) && !rootDomain.includes(brand)) {
          return {
            suspicious: true,
            score: 20,
            message: `Subdomain abuse detected: ${domain} uses "${brand}" in subdomain but root domain is ${rootDomain}`,
            explanation: `This domain uses "${brand}" in a subdomain to appear legitimate, but the actual root domain is ${rootDomain}. This is a common phishing technique - always check the part before the last two dots.`
          };
        }
      }
    }

    return { suspicious: false };
  }

  checkSuspiciousTld(domain) {
    for (const tld of this.suspiciousTlds) {
      if (domain.endsWith(tld)) {
        return {
          suspicious: true,
          score: 15,
          message: `Domain ${domain} uses suspicious TLD ${tld}`,
          explanation: `The TLD ${tld} is commonly associated with phishing due to low cost, free registration, or lack of abuse policies. Many phishing campaigns use these TLDs because they're cheap and anonymous.`
        };
      }
    }

    return { suspicious: false };
  }

  checkTyposquatting(domain) {
    const rootDomain = domain.split('.').slice(-2)[0];
    
    const targetBrands = [
      { legit: 'google', typos: ['g00gle', 'gooogle', 'googel', 'googgle', 'gogle'] },
      { legit: 'microsoft', typos: ['micr0soft', 'microsft', 'mircosoft', 'microsooft'] },
      { legit: 'amazon', typos: ['amaz0n', 'amazn', 'arnazon', 'amazone'] },
      { legit: 'paypal', typos: ['paypa1', 'paybal', 'paypl', 'pay-pal'] },
      { legit: 'apple', typos: ['app1e', 'appl', 'aple', 'applee'] },
      { legit: 'facebook', typos: ['faceb00k', 'facebok', 'faceboook'] },
      { legit: 'netflix', typos: ['netflx', 'netflik', 'netfliix'] },
      { legit: 'linkedin', typos: ['linkedln', 'lnkedin', 'linkedinn'] }
    ];

    for (const brand of targetBrands) {
      if (brand.typos.some(t => rootDomain.includes(t))) {
        return {
          suspicious: true,
          score: 25,
          message: `Typosquatting detected: ${domain} mimics ${brand.legit}.com`,
          explanation: `This domain is designed to look like ${brand.legit}.com at first glance but contains subtle spelling differences. This is called "typosquatting" and is a common phishing technique.`
        };
      }
    }

    return { suspicious: false };
  }

  async checkDomainReputation(domain) {
    // Simulated reputation check - in production, use:
    // - Google Safe Browsing API
    // - VirusTotal API
    // - PhishTank API
    // - URLScan.io API
    
    // Known phishing domains (simplified list)
    const knownPhishing = [
      'secure-login.xyz', 'account-verify.tk', 'login-secure.ml',
      'paypa1-secure.com', 'amaz0n-login.xyz', 'microsoft-verify.tk'
    ];

    if (knownPhishing.some(p => domain.includes(p))) {
      return {
        suspicious: true,
        score: 30,
        message: `Domain ${domain} is flagged in threat intelligence databases`,
        explanation: 'This domain has been identified in known phishing campaigns. It should be blocked immediately.'
      };
    }

    return { suspicious: false };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DomainIntelligenceLayer;
}
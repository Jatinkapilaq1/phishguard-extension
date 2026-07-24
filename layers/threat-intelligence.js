/**
 * Layer 8: Threat Intelligence
 * Checks against known threat databases and patterns
 */

class ThreatIntelligenceLayer {
  constructor() {
    // Known phishing indicators (in production, use APIs)
    this.knownPhishingPatterns = [
      // Common phishing subject lines
      /your\s+account\s+has\s+been\s+(compromised|locked|suspended)/i,
      /unusual\s+sign[-\s]?in\s+activity/i,
      /verify\s+your\s+account\s+immediately/i,
      /security\s+alert:\s+unauthorized\s+access/i,
      /your\s+password\s+will\s+expire/i,
      /action\s+required:\s+account\s+verification/i,
      /dear\s+customer.*(?:verify|confirm|update)\s+(?:your|the)/i,
      /(?:tax|taxes)\s+(?:refund|return)\s+(?:pending|available)/i,
      /you\s+have\s+(?:a\s+)?(?:new|pending)\s+(?:message|notification)/i,
      /delivery\s+(?:failed|attempted|notification)/i,
      /your\s+(?:package|order)\s+requires\s+action/i
    ];

    // Known malicious domains (simplified - in production use threat feeds)
    this.knownMaliciousDomains = [
      'secure-login.xyz', 'account-verify.tk', 'login-secure.ml',
      'paypa1-secure.com', 'amaz0n-login.xyz', 'microsoft-verify.tk',
      'apple-id-verify.cf', 'facebook-login.gq', 'netflix-account.ml',
      'bank-secure.tk', 'google-security.xyz', 'outlook-login.top'
    ];

    // Trusted sender patterns
    this.trustedSenders = [
      { domain: 'google.com', pattern: /@google\.com$/i },
      { domain: 'microsoft.com', pattern: /@microsoft\.com$/i },
      { domain: 'apple.com', pattern: /@apple\.com$/i },
      { domain: 'amazon.com', pattern: /@amazon\.com$/i },
      { domain: 'paypal.com', pattern: /@paypal\.com$/i },
      { domain: 'zomato.com', pattern: /@zomato\.com$/i },
      { domain: 'swiggy.com', pattern: /@swiggy\.com$/i },
      { domain: 'linkedin.com', pattern: /@linkedin\.com$/i }
    ];

    // Known legitimate email types
    this.legitimateEmailTypes = [
      {
        name: 'Security Notification',
        indicators: [
          /new\s+sign[-\s]?in/i,
          /device\s*:/i,
          /ip\s+address\s*:/i,
          /browser\s*:/i,
          /location\s*:/i,
          /if\s+this\s+was\s+you/i,
          /if\s+this\s+wasn'?t\s+you/i
        ],
        weight: -25
      },
      {
        name: 'Order Confirmation',
        indicators: [
          /order\s+(?:confirmation|number|#)/i,
          /order\s+has\s+been\s+(?:placed|confirmed|shipped)/i,
          /tracking\s+(?:number|link)/i,
          /your\s+order/i
        ],
        weight: -20
      },
      {
        name: 'Account Activity',
        indicators: [
          /account\s+(?:activity|update|change)/i,
          /profile\s+(?:update|change)/i,
          /settings?\s+(?:update|change)/i,
          /password\s+(?:changed|updated|reset)/i
        ],
        weight: -15
      },
      {
        name: 'Newsletter',
        indicators: [
          /newsletter/i,
          /weekly\s+(?:digest|update)/i,
          /monthly\s+(?:report|update)/i,
          /unsubscribe/i
        ],
        weight: -15
      }
    ];
  }

  async analyze(emailData) {
    const evidence = [];
    let score = 0;
    let confidence = 0.7;

    const sender = (emailData.sender || '').toLowerCase();
    const subject = (emailData.subject || '').toLowerCase();
    const body = (emailData.body || emailData.text || '').toLowerCase();
    const fullText = `${subject} ${body}`;

    // 1. Check against known phishing patterns
    const phishingResult = this.checkKnownPhishingPatterns(fullText);
    if (phishingResult.matched) {
      score += phishingResult.score;
      evidence.push(...phishingResult.evidence);
    }

    // 2. Check sender against known malicious domains
    const domainResult = this.checkMaliciousDomains(sender);
    if (domainResult.malicious) {
      score += domainResult.score;
      evidence.push({
        type: 'malicious_domain',
        severity: 'critical',
        finding: `Sender domain is known malicious: ${domainResult.domain}`,
        explanation: 'This domain has been identified in known phishing campaigns.'
      });
    }

    // 3. Check against trusted senders
    const trustedResult = this.checkTrustedSenders(sender);
    if (trustedResult.trusted) {
      score += trustedResult.score; // Negative = reduces risk
      evidence.push({
        type: 'trusted_sender',
        severity: 'info',
        finding: `Sender is from verified trusted domain: ${trustedResult.domain}`,
        explanation: 'This email comes from a known legitimate domain.'
      });
    }

    // 4. Check for legitimate email types
    const legitimateResult = this.checkLegitimateEmailTypes(fullText);
    if (legitimateResult.legitimate) {
      score += legitimateResult.score; // Negative = reduces risk
      evidence.push({
        type: 'legitimate_email_type',
        severity: 'info',
        finding: `Email matches pattern: ${legitimateResult.name}`,
        explanation: legitimateResult.explanation
      });
    }

    // 5. Check for credential request patterns
    const credentialResult = this.checkCredentialRequests(fullText);
    if (credentialResult.suspicious) {
      score += credentialResult.score;
      evidence.push(...credentialResult.evidence);
    }

    // 6. Check for social engineering patterns
    const socialResult = this.checkSocialEngineering(fullText);
    if (socialResult.suspicious) {
      score += socialResult.score;
      evidence.push(...socialResult.evidence);
    }

    // Normalize score
    score = Math.max(-40, Math.min(score, 100));

    return {
      score: score,
      confidence: confidence,
      evidence: evidence,
      details: {
        trusted: trustedResult.trusted,
        legitimate_type: legitimateResult.name || 'Unknown'
      }
    };
  }

  checkKnownPhishingPatterns(text) {
    const evidence = [];
    let score = 0;
    let matched = false;

    for (const pattern of this.knownPhishingPatterns) {
      if (pattern.test(text)) {
        matched = true;
        score += 15;
        evidence.push({
          type: 'phishing_pattern',
          severity: 'high',
          finding: `Known phishing pattern detected`,
          explanation: 'This email matches patterns commonly used in phishing campaigns.'
        });
        break; // One match is enough
      }
    }

    return { matched, score, evidence };
  }

  checkMaliciousDomains(sender) {
    const domain = sender.split('@')[1] || '';
    
    for (const malicious of this.knownMaliciousDomains) {
      if (domain.includes(malicious) || malicious.includes(domain)) {
        return {
          malicious: true,
          score: 40,
          domain: malicious
        };
      }
    }

    return { malicious: false };
  }

  checkTrustedSenders(sender) {
    for (const trusted of this.trustedSenders) {
      if (trusted.pattern.test(sender)) {
        return {
          trusted: true,
          score: -30,
          domain: trusted.domain
        };
      }
    }

    return { trusted: false };
  }

  checkLegitimateEmailTypes(text) {
    for (const type of this.legitimateEmailTypes) {
      const matches = type.indicators.filter(p => p.test(text));
      
      if (matches.length >= 2) { // Need at least 2 matches
        return {
          legitimate: true,
          score: type.weight,
          name: type.name,
          explanation: `This email matches the pattern of a legitimate ${type.name.toLowerCase()} email.`
        };
      }
    }

    return { legitimate: false };
  }

  checkCredentialRequests(text) {
    const evidence = [];
    let score = 0;
    let suspicious = false;

    const patterns = [
      { pattern: /verify\s+(?:your|the)\s+(?:account|identity|email)/i, weight: 20 },
      { pattern: /confirm\s+(?:your|the)\s+(?:password|identity|account)/i, weight: 20 },
      { pattern: /update\s+(?:your|the)\s+(?:payment|billing|account)/i, weight: 15 },
      { pattern: /re[-\s]?enter\s+(?:your|the)\s+(?:password|credentials)/i, weight: 25 },
      { pattern: /password\s+(?:has\s+)?expired/i, weight: 18 },
      { pattern: /sign\s+in\s+(?:to\s+)?(?:verify|confirm)/i, weight: 20 }
    ];

    for (const { pattern, weight } of patterns) {
      if (pattern.test(text)) {
        suspicious = true;
        score += weight;
        evidence.push({
          type: 'credential_request',
          severity: 'high',
          finding: 'Email requests credential verification/update',
          explanation: 'Legitimate companies never ask you to verify or update credentials via email links.'
        });
        break; // One is enough
      }
    }

    return { suspicious, score, evidence };
  }

  checkSocialEngineering(text) {
    const evidence = [];
    let score = 0;
    let suspicious = false;

    const tactics = [
      {
        name: 'Urgency',
        pattern: /(?:immediately|urgent|act\s+now|right\s+now|asap|don'?t\s+delay)/i,
        weight: 12
      },
      {
        name: 'Fear',
        pattern: /(?:suspended|locked|terminated|compromised|breach|hack|unauthorized)/i,
        weight: 15
      },
      {
        name: 'Authority',
        pattern: /(?:official|government|irs|fbi|police|security\s+team|admin)/i,
        weight: 10
      },
      {
        name: 'Reward',
        pattern: /(?:congratulations|winner|selected|chosen|prize|bonus|free)/i,
        weight: 12
      },
      {
        name: 'Financial Pressure',
        pattern: /(?:wire\s+transfer|payment\s+required|invoice\s+attached|urgent\s+payment)/i,
        weight: 18
      }
    ];

    const tacticsFound = [];

    for (const tactic of tactics) {
      if (tactic.pattern.test(text)) {
        tacticsFound.push(tactic.name);
        score += tactic.weight;
      }
    }

    if (tacticsFound.length > 0) {
      suspicious = true;
      evidence.push({
        type: 'social_engineering',
        severity: tacticsFound.length > 2 ? 'critical' : 'high',
        finding: `Social engineering tactics detected: ${tacticsFound.join(', ')}`,
        explanation: `This email uses ${tacticsFound.length} psychological manipulation technique(s) commonly found in phishing attacks.`
      });
    }

    return { suspicious, score, evidence };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThreatIntelligenceLayer;
}
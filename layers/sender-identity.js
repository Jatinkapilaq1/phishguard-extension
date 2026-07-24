/**
 * Layer 1: Sender Identity Analysis
 * Detects display name spoofing, homoglyphs, unicode attacks
 */

class SenderIdentityLayer {
  constructor() {
    this.legitimateDomains = {
      'google': ['google.com', 'gmail.com', 'googlemail.com', 'google.co.uk', 'google.in'],
      'microsoft': ['microsoft.com', 'outlook.com', 'live.com', 'office.com', 'office365.com', 'hotmail.com'],
      'apple': ['apple.com', 'icloud.com', 'me.com'],
      'amazon': ['amazon.com', 'amazon.co.uk', 'amazon.in', 'amazonsellerservices.com'],
      'paypal': ['paypal.com', 'paypal.co.uk', 'paypal.in'],
      'facebook': ['facebook.com', 'meta.com', 'fb.com'],
      'netflix': ['netflix.com', 'netflix.co.uk'],
      'bank': ['chase.com', 'wellsfargo.com', 'bankofamerica.com', 'citibank.com', 'sbi.co.in', 'hdfcbank.com', 'icicibank.com', 'axisbank.com'],
      'linkedin': ['linkedin.com', 'linkedinmail.com'],
      'twitter': ['twitter.com', 'x.com'],
      'instagram': ['instagram.com'],
      'zomato': ['zomato.com', 'zomato.co.uk'],
      'swiggy': ['swiggy.com'],
      'uber': ['uber.com', 'uber.co.uk'],
      'spotify': ['spotify.com'],
      'github': ['github.com', 'github.io']
    };

    // Homoglyph mappings (characters that look similar)
    this.homoglyphs = {
      'a': ['а', 'α', 'à', 'á', 'â', 'ã', 'ä', 'å', 'ā'],
      'e': ['е', 'ε', 'è', 'é', 'ê', 'ë', 'ē', 'ė', 'ę'],
      'o': ['о', 'ο', 'ò', 'ó', 'ô', 'õ', 'ö', 'ø', 'ō'],
      'p': ['р', 'ρ'],
      'c': ['с', 'ç', 'ć', 'č'],
      'i': ['і', 'ι', 'ì', 'í', 'î', 'ï', 'ī', 'į'],
      's': ['ѕ', 'σ', 'ś', 'š'],
      'x': ['х', 'χ'],
      'y': ['у', 'ý', 'ÿ'],
      'n': ['ñ', 'ń', 'ň', 'ņ'],
      'u': ['µ', 'ù', 'ú', 'û', 'ü', 'ū', 'ų'],
      'd': ['ď', 'đ'],
      't': ['ť', 'ţ'],
      'l': ['1', 'I', '|'],
      '0': ['O', 'o'],
      '1': ['l', 'I', '|'],
      'rn': ['m'],
      'vv': ['w'],
      'cl': ['d']
    };

    // Suspicious TLDs commonly used in phishing
    this.suspiciousTlds = [
      '.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.buzz', '.club', 
      '.work', '.click', '.link', '.fun', '.site', '.online', '.icu', '.monster',
      '.surf', '.rest', '.cfd', '.sbs', '.lol'
    ];
  }

  async analyze(emailData) {
    const evidence = [];
    let score = 0;
    let confidence = 0.8;

    // 1. Display Name Spoofing Detection
    const displayNameResult = this.checkDisplayNameSpoofing(emailData);
    if (displayNameResult.suspicious) {
      score += displayNameResult.score;
      evidence.push({
        type: 'display_name_spoofing',
        severity: displayNameResult.score > 15 ? 'high' : 'medium',
        finding: displayNameResult.message,
        explanation: displayNameResult.explanation
      });
    }

    // 2. Homoglyph/Unicode Attack Detection
    const homoglyphResult = this.checkHomoglyphs(emailData.sender);
    if (homoglyphResult.detected) {
      score += 25;
      confidence = 0.95;
      evidence.push({
        type: 'homoglyph_attack',
        severity: 'critical',
        finding: `Unicode manipulation detected: ${homoglyphResult.details}`,
        explanation: 'The sender address contains characters that visually mimic legitimate letters but are actually different Unicode characters. This is a sophisticated impersonation technique.'
      });
    }

    // 3. Reply-To Mismatch
    const replyToResult = this.checkReplyToMismatch(emailData);
    if (replyToResult.mismatch) {
      score += 20;
      evidence.push({
        type: 'reply_to_mismatch',
        severity: 'high',
        finding: `Reply-To differs from sender: ${replyToResult.replyTo}`,
        explanation: 'The reply address is different from the sender. Attackers use this to redirect your responses to their邮箱 while making the email appear legitimate.'
      });
    }

    // 4. Domain Spoofing Detection
    const domainSpoofResult = this.checkDomainSpoofing(emailData);
    if (domainSpoofResult.spoofed) {
      score += domainSpoofResult.score;
      evidence.push({
        type: 'domain_spoofing',
        severity: 'high',
        finding: domainSpoofResult.message,
        explanation: domainSpoofResult.explanation
      });
    }

    // 5. Free Email Provider Check
    const freeEmailResult = this.checkFreeEmailProvider(emailData);
    if (freeEmailResult.suspicious) {
      score += 10;
      evidence.push({
        type: 'free_email_provider',
        severity: 'medium',
        finding: `Official communications from ${freeEmailResult.claimedBrand} should not come from Gmail/Hotmail`,
        explanation: `Legitimate ${freeEmailResult.claimedBrand} emails come from their official domain, not free email providers like ${freeEmailResult.actualDomain}.`
      });
    }

    // 6. Suspicious TLD Check
    const tldResult = this.checkSuspiciousTld(emailData);
    if (tldResult.suspicious) {
      score += 15;
      evidence.push({
        type: 'suspicious_tld',
        severity: 'high',
        finding: `Domain uses suspicious TLD: ${tldResult.tld}`,
        explanation: `The domain ${tldResult.domain} uses ${tldResult.tld} which is commonly associated with phishing campaigns due to low cost or free registration.`
      });
    }

    // 7. Display Name vs Email Domain Mismatch
    const nameDomainMismatch = this.checkNameDomainMismatch(emailData);
    if (nameDomainMismatch.mismatch) {
      score += 15;
      evidence.push({
        type: 'name_domain_mismatch',
        severity: 'high',
        finding: `Display name claims "${nameDomainMismatch.claimedBrand}" but email is from ${nameDomainMismatch.actualDomain}`,
        explanation: 'The display name tries to appear as a trusted brand, but the actual email domain is unrelated. This is a classic impersonation technique.'
      });
    }

    // Calculate confidence based on number of signals
    if (evidence.length === 0) {
      confidence = 0.7;
    } else if (evidence.length >= 3) {
      confidence = 0.95;
    }

    return {
      score: Math.min(score, 100),
      confidence: confidence,
      evidence: evidence,
      details: {
        sender: emailData.sender,
        display_name: emailData.displayName,
        domain: emailData.sender.split('@')[1]
      }
    };
  }

  checkDisplayNameSpoofing(emailData) {
    const displayName = (emailData.displayName || '').toLowerCase();
    const senderEmail = emailData.sender.toLowerCase();
    const senderDomain = senderEmail.split('@')[1] || '';

    // Check if display name contains a brand but domain doesn't match
    for (const [brand, domains] of Object.entries(this.legitimateDomains)) {
      if (displayName.includes(brand)) {
        const domainMatch = domains.some(d => senderDomain.includes(d));
        if (!domainMatch && senderDomain) {
          return {
            suspicious: true,
            score: 18,
            message: `Display name contains "${brand}" but sender domain is ${senderDomain}`,
            explanation: `The display name "${emailData.displayName}" claims to be from ${brand}, but the email actually comes from ${senderDomain}. Official ${brand} emails come from ${domains[0]}.`
          };
        }
      }
    }

    // Check for generic/impersonal names
    const genericNames = ['customer support', 'service team', 'security team', 'account team', 'billing', 'support', 'admin', 'helpdesk'];
    if (genericNames.some(g => displayName.includes(g))) {
      return {
        suspicious: true,
        score: 8,
        message: `Generic display name: "${emailData.displayName}"`,
        explanation: 'Legitimate companies typically personalize emails with your name. Generic display names like "Support" or "Security Team" are common in phishing.'
      };
    }

    return { suspicious: false };
  }

  checkHomoglyphs(senderEmail) {
    const username = senderEmail.split('@')[0] || '';
    
    for (const [ascii, alternatives] of Object.entries(this.homoglyphs)) {
      for (const alt of alternatives) {
        if (username.includes(alt)) {
          return {
            detected: true,
            details: `Character "${alt}" detected which mimics "${ascii}"`
          };
        }
      }
    }

    // Check for combined character attacks (e.g., "microsoft" vs "micrоsoft")
    const suspiciousPatterns = [
      { legit: 'google', variants: ['gооgle', 'gоogle', 'googlе'] },
      { legit: 'microsoft', variants: ['micrоsoft', 'mіcrosoft', 'microsоft'] },
      { legit: 'paypal', variants: ['paуpal', 'payрal', 'рaypal'] },
      { legit: 'amazon', variants: ['аmazon', 'amаzon', 'amаzоn'] },
      { legit: 'apple', variants: ['аpple', 'applе'] },
      { legit: 'facebook', variants: ['fаcebook', 'facebооk'] }
    ];

    const lowerEmail = senderEmail.toLowerCase();
    for (const pattern of suspiciousPatterns) {
      if (pattern.variants.some(v => lowerEmail.includes(v))) {
        return {
          detected: true,
          details: `Visually similar to "${pattern.legit}" but with Unicode manipulation`
        };
      }
    }

    return { detected: false };
  }

  checkReplyToMismatch(emailData) {
    if (emailData.replyTo && emailData.replyTo !== emailData.sender) {
      return {
        mismatch: true,
        replyTo: emailData.replyTo
      };
    }
    return { mismatch: false };
  }

  checkDomainSpoofing(emailData) {
    const senderDomain = emailData.sender.split('@')[1] || '';
    const displayEmail = emailData.displayEmail || '';

    // Check if display shows different email than actual sender
    if (displayEmail && displayEmail !== emailData.sender) {
      const displayDomain = displayEmail.split('@')[1] || '';
      
      // Check if display domain is more legitimate
      for (const [brand, domains] of Object.entries(this.legitimateDomains)) {
        if (domains.some(d => displayDomain.includes(d))) {
          return {
            spoofed: true,
            score: 25,
            message: `Email appears as "${displayEmail}" but actually sent from ${emailData.sender}`,
            explanation: `This email is spoofed to look like it comes from ${displayDomain}, but the actual sending address is ${senderDomain}. This is a sophisticated impersonation attack.`
          };
        }
      }
    }

    // Check for lookalike domains
    const lookalikePatterns = [
      { legit: 'google', bad: ['g00gle', 'gooogle', 'googel', 'googgle'] },
      { legit: 'microsoft', bad: ['micr0soft', 'microsft', 'mircosoft'] },
      { legit: 'amazon', bad: ['amaz0n', 'amazn', 'arnazon'] },
      { legit: 'paypal', bad: ['paypa1', 'paybal', 'paypl'] },
      { legit: 'apple', bad: ['app1e', 'appl', 'aple'] }
    ];

    for (const pattern of lookalikePatterns) {
      if (pattern.bad.some(b => senderDomain.includes(b))) {
        return {
          spoofed: true,
          score: 22,
          message: `Lookalike domain detected: ${senderDomain} mimics ${pattern.legit}.com`,
          explanation: `The domain ${senderDomain} is designed to look like ${pattern.legit}.com at first glance, but contains subtle differences. Always verify the exact domain.`
        };
      }
    }

    return { spoofed: false };
  }

  checkFreeEmailProvider(emailData) {
    const senderDomain = emailData.sender.split('@')[1] || '';
    const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'mail.com', 'protonmail.com'];
    const displayName = (emailData.displayName || '').toLowerCase();

    if (freeProviders.some(p => senderDomain.includes(p))) {
      // Check if they're claiming to be a brand
      for (const [brand, domains] of Object.entries(this.legitimateDomains)) {
        if (displayName.includes(brand) && !domains.some(d => senderDomain.includes(d))) {
          return {
            suspicious: true,
            claimedBrand: brand,
            actualDomain: senderDomain
          };
        }
      }
    }

    return { suspicious: false };
  }

  checkSuspiciousTld(emailData) {
    const senderDomain = emailData.sender.split('@')[1] || '';
    
    for (const tld of this.suspiciousTlds) {
      if (senderDomain.endsWith(tld)) {
        return {
          suspicious: true,
          tld: tld,
          domain: senderDomain
        };
      }
    }

    return { suspicious: false };
  }

  checkNameDomainMismatch(emailData) {
    const displayName = (emailData.displayName || '').toLowerCase();
    const senderDomain = emailData.sender.split('@')[1] || '';

    for (const [brand, domains] of Object.entries(this.legitimateDomains)) {
      if (displayName.includes(brand)) {
        const domainMatch = domains.some(d => senderDomain.includes(d));
        if (!domainMatch) {
          return {
            mismatch: true,
            claimedBrand: brand,
            actualDomain: senderDomain
          };
        }
      }
    }

    return { mismatch: false };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SenderIdentityLayer;
}
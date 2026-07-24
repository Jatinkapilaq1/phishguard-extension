/**
 * Layer 4: Content Analysis
 * NLP-based psychological manipulation detection
 * Detects: Urgency, Fear, Authority, Social Engineering, Emotional Triggers
 */

class ContentAnalysisLayer {
  constructor() {
    this.psychologicalTactics = {
      urgency: {
        keywords: [
          'immediately', 'urgent', 'right now', 'act now', 'hurry', 'quick',
          'fast', 'asap', 'dont delay', 'dont wait', 'time sensitive',
          'deadline', 'expires', 'limited time', 'last chance', 'final',
          'only hours left', 'today only', 'before its too late'
        ],
        patterns: [
          /expires?\s+(today|tonight|soon|in\s+\d+\s+hours?)/i,
          /only\s+\d+\s+(minutes?|hours?|days?)\s+left/i,
          /act\s+now\s+or/i,
          /immediate\s+action\s+required/i,
          /time\s+sensitive/i,
          /before\s+\w+\s+expires?/i,
          /final\s+(notice|warning|reminder)/i,
          /dont\s+miss\s+out/i,
          /limited\s+time\s+(offer|deal)/i
        ],
        weight: 12,
        description: 'Creates false urgency to prevent rational thinking'
      },
      
      fear: {
        keywords: [
          'suspended', 'locked', 'closed', 'terminated', 'blocked',
          'compromised', 'breach', 'hack', 'stolen', 'unauthorized',
          'illegal', 'police', 'arrest', 'court', 'legal action',
          'lawsuit', 'prosecution', 'penalty', 'fine', 'consequences'
        ],
        patterns: [
          /account\s+(will\s+be|has\s+been|is)\s+(suspended|locked|closed|terminated)/i,
          /unauthorized\s+(access|activity|transaction)/i,
          /security\s+(breach|alert|incident)/i,
          /your\s+account\s+has\s+been\s+compromised/i,
          /legal\s+action\s+(will\s+be|has\s+been)/i,
          /police\s+(report|investigation)/i,
          /fines?\s+(will|may|could)\s+be/i,
          /immediate\s+(termination|suspension)/i,
          /last\s+warning/i,
          /final\s+notice/i
        ],
        weight: 15,
        description: 'Uses fear and threats to force immediate compliance'
      },
      
      authority: {
        keywords: [
          'official', 'government', 'irs', 'tax', 'fbi', 'police',
          'bank', 'security team', 'admin', 'system', 'automated',
          'certified', 'authorized', 'verified', 'official notice',
          'legal department', 'compliance', 'regulatory'
        ],
        patterns: [
          /this\s+is\s+(an?\s+)?(official|legal|authorized)/i,
          /from\s+the\s+(irs|fbi|police|government|bank)/i,
          /security\s+(team|department|office)/i,
          /system\s+(administrator|admin|notice)/i,
          /automated\s+(notification|alert|message)/i,
          /authorized\s+(personnel|representative)/i,
          /compliance\s+(department|notice|requirement)/i,
          /regulatory\s+(body|authority|requirement)/i
        ],
        weight: 10,
        description: 'Impersonates authority figures to gain trust'
      },
      
      financial: {
        keywords: [
          'wire transfer', 'payment', 'invoice', 'refund', 'claim',
          'winner', 'lottery', 'prize', 'inheritance', 'tax refund',
          'credit card', 'bank account', 'routing number', 'swift',
          'bitcoin', 'crypto', 'gift card', 'western union', 'moneygram'
        ],
        patterns: [
          /you\s+(have\s+)?(won|been\s+selected|been\s+chosen)/i,
          /claim\s+(your|the)\s+(prize|reward|money|inheritance)/i,
          /lottery\s+(winner|prize|notification)/i,
          /tax\s+refund\s+(pending|available|approved)/i,
          /wire\s+transfer\s+(required|requested|needed)/i,
          /send\s+(money|payment|funds)\s+to/i,
          /bitcoin\s+payment\s+required/i,
          /gift\s+card\s+payment/i,
          /inheritance\s+(claim|notification|release)/i,
          /credit\s+card\s+(number|details|information)/i,
          /bank\s+account\s+(number|details)/i
        ],
        weight: 18,
        description: 'Targets financial greed or fear of financial loss'
      },
      
      credential: {
        keywords: [
          'verify', 'confirm', 'validate', 'update', 're-enter',
          'password', 'username', 'login', 'credentials', 'account',
          'sign in', 'log in', 'authenticate', 'security check'
        ],
        patterns: [
          /verify\s+(your|the)\s+(account|identity|email|information)/i,
          /confirm\s+(your|the)\s+(password|identity|account)/i,
          /update\s+(your|the)\s+(payment|billing|account|information)/i,
          /re[-\s]?enter\s+(your|the)\s+(password|credentials)/i,
          /password\s+(has\s+expired|expired|needs?\s+update)/i,
          /account\s+(verification|security\s+check)/i,
          /sign\s+in\s+(to\s+verify|to\s+confirm|now)/i,
          /log\s+in\s+(to\s+verify|to\s+confirm|now)/i,
          /validate\s+(your|the)\s+(credentials|identity)/i,
          /security\s+(check|verification|review)\s+required/i
        ],
        weight: 20,
        description: 'Attempts to harvest login credentials'
      },
      
      reward: {
        keywords: [
          'congratulations', 'winner', 'selected', 'chosen', 'special',
          'exclusive', 'free', 'bonus', 'gift', 'reward', 'offer',
          'opportunity', 'limited', 'premium', 'vip', 'upgrade'
        ],
        patterns: [
          /congratulations\s*[!.]?/i,
          /you\s+(have\s+)?(won|been\s+selected|been\s+chosen)/i,
          /exclusive\s+(offer|deal|opportunity)/i,
          /free\s+(gift|trial|offer|upgrade|bonus)/i,
          /claim\s+(your|the)\s+(prize|reward|gift|bonus)/i,
          /special\s+(offer|promotion|deal)/i,
          /limited\s+time\s+offer/i,
          /vip\s+(access|membership|offer)/i,
          /upgrade\s+(to\s+)?(premium|vip|pro)/i,
          /bonus\s+(reward|gift|offer)/i
        ],
        weight: 12,
        description: 'Uses greed and excitement to lower guard'
      },
      
      social: {
        keywords: [
          'friend', 'family', 'colleague', 'boss', 'ceo', 'manager',
          'hr', 'human resources', 'coworker', 'teammate', 'client',
          'customer', 'partner', 'vendor', 'supplier'
        ],
        patterns: [
          /from\s+(your|the)\s+(boss|ceo|manager|hr|colleague)/i,
          /urgent\s+request\s+from/i,
          /please\s+(help|assist|handle|process)/i,
          /confidential\s+(request|task|assignment)/i,
          /don'?t\s+tell\s+(anyone|anybody)/i,
          /keep\s+(this\s+)?(confidential|quiet|secret)/i,
          /as\s+per\s+(your|the)\s+(boss|ceo|manager)/i,
          /immediate\s+assistance\s+needed/i,
          /time[-\s]sensitive\s+(task|request|assignment)/i,
          /wire\s+transfer\s+request/i
        ],
        weight: 15,
        description: 'Exploits workplace relationships and trust'
      },
      
      curiosity: {
        keywords: [
          'secret', 'hidden', 'mysterious', 'exclusive', 'insider',
          'breaking', 'developing', 'uncovered', 'revealed', 'exposed',
          'shocking', 'surprising', 'unbelievable', 'incredible'
        ],
        patterns: [
          /you\s+(won'?t\s+believe|won'?t\s+guess)/i,
          /shocking\s+(revelation|discovery|news)/i,
          /secret\s+(revealed|exposed|discovered)/i,
          /insider\s+(information|knowledge|secret)/i,
          /breaking\s+(news|story|development)/i,
          /unbelievable\s+(offer|discovery|news)/i,
          /click\s+to\s+(see|find\s+out|discover)/i,
          /what\s+they\s+don'?t\s+want\s+you\s+to\s+know/i
        ],
        weight: 8,
        description: 'Uses curiosity to entice clicking'
      }
    };

    // Legitimate email patterns (reduce score)
    this.legitimatePatterns = [
      {
        patterns: [
          /you\s+can\s+ignore\s+this/i,
          /no\s+(action\s+)?required/i,
          /this\s+is\s+a\s+(courtesy|notification|reminder)/i,
          /if\s+this\s+was\s+you/i,
          /if\s+this\s+wasn'?t\s+you/i,
          /manage\s+your\s+preferences/i,
          /unsubscribe/i,
          /view\s+in\s+browser/i
        ],
        weight: -15,
        description: 'Standard legitimate email patterns'
      },
      {
        patterns: [
          /dear\s+\w+,/i,
          /hi\s+\w+,/i,
          /hello\s+\w+,/i
        ],
        weight: -5,
        description: 'Personalized greeting (indicates legitimate sender)'
      },
      {
        patterns: [
          /best\s+regards/i,
          /sincerely/i,
          /thank\s+you/i,
          /team\s+\w+/i,
          /\bregards\b/i
        ],
        weight: -5,
        description: 'Professional sign-off'
      }
    ];

    // Known safe email types
    this.safeEmailTypes = [
      {
        patterns: [
          /login\s+(notification|alert|activity)/i,
          /new\s+sign[-\s]?in/i,
          /sign[-\s]?in\s+(from|on|activity)/i,
          /device\s+:/i,
          /ip\s+address\s*:/i,
          /browser\s+/i,
          /location\s*:/i
        ],
        weight: -20,
        description: 'Security notification email (login alerts, etc.)'
      },
      {
        patterns: [
          /order\s+(confirmation|update|shipped|delivered)/i,
          /tracking\s+(number|link)/i,
          /delivery\s+(update|notification)/i,
          /your\s+order/i
        ],
        weight: -15,
        description: 'Order/shipping notification'
      },
      {
        patterns: [
          /newsletter/i,
          /weekly\s+(digest|update|summary)/i,
          /monthly\s+(report|update)/i,
          /your\s+(report|summary|digest)/i
        ],
        weight: -10,
        description: 'Newsletter or digest email'
      }
    ];
  }

  async analyze(emailData) {
    const evidence = [];
    let score = 0;
    let confidence = 0.75;

    const text = (emailData.body || emailData.text || '').toLowerCase();
    const subject = (emailData.subject || '').toLowerCase();
    const fullText = `${subject} ${text}`;

    // 1. Check for legitimate patterns first
    const legitimateScore = this.checkLegitimatePatterns(fullText);
    score += legitimateScore;

    // 2. Check for safe email types
    const safeTypeScore = this.checkSafeEmailTypes(fullText);
    score += safeTypeScore;

    // 3. Analyze psychological tactics
    for (const [tactic, config] of Object.entries(this.psychologicalTactics)) {
      const tacticResult = this.analyzeTactic(fullText, tactic, config);
      if (tacticResult.detected) {
        score += tacticResult.score;
        evidence.push({
          type: `psychological_${tactic}`,
          severity: tacticResult.score > 15 ? 'high' : 'medium',
          finding: tacticResult.message,
          explanation: tacticResult.explanation,
          confidence: tacticResult.confidence
        });
      }
    }

    // 4. Check for manipulation combinations
    const comboResult = this.checkManipulationCombinations(fullText);
    if (comboResult.suspicious) {
      score += comboResult.score;
      evidence.push({
        type: 'manipulation_combination',
        severity: 'critical',
        finding: comboResult.message,
        explanation: comboResult.explanation
      });
    }

    // 5. Check for writing style anomalies
    const styleResult = this.checkWritingStyle(text);
    if (styleResult.suspicious) {
      score += styleResult.score;
      evidence.push({
        type: 'writing_style',
        severity: 'medium',
        finding: styleResult.message,
        explanation: styleResult.explanation
      });
    }

    // 6. Check for personalization
    const personalResult = this.checkPersonalization(emailData, text);
    if (personalResult.legitimate) {
      score += personalResult.score; // Negative score = reduces risk
      evidence.push({
        type: 'personalization',
        severity: 'info',
        finding: personalResult.message,
        explanation: personalResult.explanation
      });
    }

    // Normalize score
    score = Math.max(-30, Math.min(score, 100));

    return {
      score: score,
      confidence: confidence,
      evidence: evidence,
      details: {
        tactics_detected: evidence.filter(e => e.type.startsWith('psychological_')).map(e => e.type.replace('psychological_', '')),
        legitimate_signals: evidence.filter(e => e.severity === 'info').length,
        risk_signals: evidence.filter(e => e.severity !== 'info').length
      }
    };
  }

  checkLegitimatePatterns(text) {
    let adjustment = 0;
    
    for (const pattern of this.legitimatePatterns) {
      if (pattern.patterns.some(p => p.test(text))) {
        adjustment += pattern.weight;
      }
    }

    return adjustment;
  }

  checkSafeEmailTypes(text) {
    let adjustment = 0;
    
    for (const safeType of this.safeEmailTypes) {
      if (safeType.patterns.every(p => p.test(text))) {
        adjustment += safeType.weight;
        break;
      }
    }

    return adjustment;
  }

  analyzeTactic(text, tacticName, config) {
    let matches = [];
    let score = 0;

    // Check keywords
    for (const keyword of config.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        matches.push(keyword);
      }
    }

    // Check patterns
    for (const pattern of config.patterns) {
      const match = text.match(pattern);
      if (match) {
        matches.push(match[0]);
      }
    }

    if (matches.length > 0) {
      score = config.weight * Math.min(matches.length, 3); // Cap at 3x weight
      
      const confidence = Math.min(0.6 + (matches.length * 0.1), 0.95);
      
      return {
        detected: true,
        score: score,
        matches: matches.slice(0, 5),
        confidence: confidence,
        message: `${tacticName.charAt(0).toUpperCase() + tacticName.slice(1)} tactics detected: "${matches.slice(0, 3).join('", "')}"`,
        explanation: `${config.description}. Found ${matches.length} indicator(s) of this manipulation technique.`
      };
    }

    return { detected: false };
  }

  checkManipulationCombinations(text) {
    const tacticsFound = [];
    
    for (const [tactic, config] of Object.entries(this.psychologicalTactics)) {
      if (config.patterns.some(p => p.test(text))) {
        tacticsFound.push(tactic);
      }
    }

    // Dangerous combinations
    const dangerousCombos = [
      ['urgency', 'fear'],
      ['urgency', 'credential'],
      ['fear', 'authority'],
      ['fear', 'credential'],
      ['authority', 'credential'],
      ['financial', 'urgency'],
      ['financial', 'fear']
    ];

    for (const combo of dangerousCombos) {
      if (combo.every(t => tacticsFound.includes(t))) {
        return {
          suspicious: true,
          score: 20,
          message: `Multiple manipulation tactics combined: ${combo.join(' + ')}`,
          explanation: `This email combines ${combo.length} psychological manipulation techniques (${combo.join(' and ')}). This is a sophisticated social engineering attempt designed to overwhelm your critical thinking.`
        };
      }
    }

    return { suspicious: false };
  }

  checkWritingStyle(text) {
    const issues = [];

    // Check for generic greetings
    const genericGreetings = ['dear valued customer', 'dear user', 'dear account holder', 'dear customer', 'dear member'];
    if (genericGreetings.some(g => text.includes(g))) {
      issues.push('generic_greeting');
    }

    // Check for poor grammar/spelling
    const grammarErrors = [
      'we has', 'your account is been', 'please to', 'kindly do the needful',
      'revert back', 'do the needful', 'click on the below'
    ];
    if (grammarErrors.some(e => text.includes(e))) {
      issues.push('grammar_errors');
    }

    // Check for excessive punctuation
    if ((text.match(/!/g) || []).length > 3) {
      issues.push('excessive_punctuation');
    }

    // Check for ALL CAPS words
    const words = text.split(/\s+/);
    const capsWords = words.filter(w => w.length > 3 && w === w.toUpperCase() && /[A-Z]/.test(w));
    if (capsWords.length > 2) {
      issues.push('excessive_caps');
    }

    if (issues.length > 0) {
      return {
        suspicious: true,
        score: issues.length * 4,
        message: `Writing style anomalies: ${issues.join(', ')}`,
        explanation: 'The email shows signs of being mass-produced or written by non-native speakers, which is common in phishing campaigns.'
      };
    }

    return { suspicious: false };
  }

  checkPersonalization(emailData, text) {
    // Check if email is personalized (sign of legitimacy)
    const hasPersonalName = emailData.to && text.includes(emailData.to.split('@')[0]);
    const hasAccountInfo = /\b(account|order|subscription)\s*#?\d+/i.test(text);
    const hasSpecificDetails = /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}/.test(text); // Partial card/account numbers

    if (hasPersonalName || hasAccountInfo || hasSpecificDetails) {
      return {
        legitimate: true,
        score: -8,
        message: 'Email contains personalized details',
        explanation: 'The email references specific account details, indicating it may be from a legitimate service you use.'
      };
    }

    return { legitimate: false };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContentAnalysisLayer;
}
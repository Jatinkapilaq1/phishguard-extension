/**
 * Layer 7: Behavior Analysis
 * Detects malicious behaviors in email content
 */

class BehaviorAnalysisLayer {
  constructor() {
    this.maliciousBehaviors = {
      javascript: {
        patterns: [
          /<script[\s>]/gi,
          /javascript:/gi,
          /on(?:load|error|click|mouse\w+)\s*=/gi,
          /eval\s*\(/gi,
          /document\.(cookie|write|location)/gi,
          /window\.(location|open)/gi,
          /XMLHttpRequest/gi,
          /fetch\s*\(/gi
        ],
        weight: 30,
        description: 'JavaScript execution can steal data or redirect to phishing pages'
      },
      
      forms: {
        patterns: [
          /<form[^>]*>/gi,
          /<input[^>]*type=["']password["'][^>]*>/gi,
          /<input[^>]*(?:name|id)=["'](?:password|pass|pwd|credential)[^>]*>/gi,
          /action=["'][^"']*["'][^>]*method/gi
        ],
        weight: 25,
        description: 'Forms can be used to harvest credentials'
      },
      
      redirections: {
        patterns: [
          /window\.location\s*=/gi,
          /location\.href\s*=/gi,
          /location\.replace\s*\(/gi,
          /location\.assign\s*\(/gi,
          /<meta[^>]*http-equiv=["']refresh["'][^>]*content=["']\d+;\s*url/gi
        ],
        weight: 20,
        description: 'Automatic redirections can lead to phishing sites'
      },
      
      clipboard: {
        patterns: [
          /clipboard/gi,
          /document\.execCommand\s*\(\s*["']copy/gi,
          /navigator\.clipboard/gi,
          /oncopy|oncut|onpaste/gi
        ],
        weight: 15,
        description: 'Clipboard access can steal copied data'
      },
      
      keyboard: {
        patterns: [
          /onkeydown|onkeyup|onkeypress/gi,
          /addEventListener\s*\(\s*["']key/gi,
          /keyboard/gi
        ],
        weight: 15,
        description: 'Keyboard listeners can capture keystrokes including passwords'
      },
      
      cookies: {
        patterns: [
          /document\.cookie/gi,
          /cookie/gi
        ],
        weight: 10,
        description: 'Cookie access can steal session data'
      },
      
      storage: {
        patterns: [
          /localStorage/gi,
          /sessionStorage/gi,
          /indexedDB/gi
        ],
        weight: 10,
        description: 'Local storage access can store/retrieve sensitive data'
      },
      
      externalResources: {
        patterns: [
          /<img[^>]*src=["']https?:\/\/[^"']+["'][^>]*>/gi,
          /<link[^>]*href=["']https?:\/\/[^"']+["'][^>]*>/gi,
          /<script[^>]*src=["']https?:\/\/[^"']+["'][^>]*>/gi,
          /@import\s+["']https?:\/\//gi
        ],
        weight: 8,
        description: 'Loading external resources can track users or load malicious content'
      }
    };

    this.safePatterns = {
      unsubscribe: {
        patterns: [
          /unsubscribe/gi,
          /opt[-\s]?out/gi,
          /manage\s+preferences/gi,
          /email\s+preferences/gi
        ],
        weight: -10,
        description: 'Unsubscribe links indicate legitimate marketing emails'
      },
      tracking: {
        patterns: [
          /view\s+in\s+browser/gi,
          /having\s+trouble\s+viewing/gi,
          /email\s+not\s+displaying/gi
        ],
        weight: -8,
        description: 'View in browser links are common in legitimate emails'
      }
    };
  }

  async analyze(emailData) {
    const evidence = [];
    let score = 0;
    let confidence = 0.8;

    const html = emailData.html || '';

    // Check for malicious behaviors
    for (const [behavior, config] of Object.entries(this.maliciousBehaviors)) {
      const matches = this.findMatches(html, config.patterns);
      
      if (matches.length > 0) {
        const behaviorScore = config.weight * Math.min(matches.length, 3);
        score += behaviorScore;
        
        evidence.push({
          type: `behavior_${behavior}`,
          severity: config.weight >= 25 ? 'critical' : config.weight >= 15 ? 'high' : 'medium',
          finding: `${behavior.charAt(0).toUpperCase() + behavior.slice(1)} behavior detected (${matches.length} instance(s))`,
          explanation: config.description
        });
      }
    }

    // Check for safe patterns (reduce score)
    for (const [pattern, config] of Object.entries(this.safePatterns)) {
      const matches = this.findMatches(html, config.patterns);
      
      if (matches.length > 0) {
        score += config.weight; // Negative weight
        evidence.push({
          type: `safe_${pattern}`,
          severity: 'info',
          finding: `${pattern.charAt(0).toUpperCase() + pattern.slice(1)} link detected`,
          explanation: config.description
        });
      }
    }

    // Normalize score
    score = Math.max(-20, Math.min(score, 100));

    return {
      score: score,
      confidence: confidence,
      evidence: evidence,
      details: {
        behaviors_detected: evidence.filter(e => e.type.startsWith('behavior_')).length,
        safe_signals: evidence.filter(e => e.type.startsWith('safe_')).length
      }
    };
  }

  findMatches(html, patterns) {
    const matches = [];
    for (const pattern of patterns) {
      const found = html.match(pattern);
      if (found) {
        matches.push(...found);
      }
    }
    return [...new Set(matches)]; // Unique matches
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BehaviorAnalysisLayer;
}
/**
 * AI Memory Module
 * Learns from legitimate communications to improve detection
 */

class AIMemory {
  constructor() {
    this.knownLegitimate = new Map();
    this.knownMalicious = new Map();
    this.communicationPatterns = new Map();
    this.maxEntries = 1000;
  }

  async init() {
    try {
      const stored = await chrome.storage.local.get(['phishguard_memory']);
      if (stored.phishguard_memory) {
        this.knownLegitimate = new Map(stored.phishguard_memory.legitimate || []);
        this.knownMalicious = new Map(stored.phishguard_memory.malicious || []);
        this.communicationPatterns = new Map(stored.phishguard_memory.patterns || []);
      }
    } catch (e) {
      console.log('Memory init:', e);
    }
  }

  async save() {
    try {
      await chrome.storage.local.set({
        phishguard_memory: {
          legitimate: Array.from(this.knownLegitimate.entries()),
          malicious: Array.from(this.knownMalicious.entries()),
          patterns: Array.from(this.communicationPatterns.entries())
        }
      });
    } catch (e) {
      console.log('Memory save:', e);
    }
  }

  async checkSender(sender) {
    const domain = sender.split('@')[1] || '';
    
    // Check if known legitimate
    if (this.knownLegitimate.has(domain)) {
      const data = this.knownLegitimate.get(domain);
      data.lastSeen = Date.now();
      data.count++;
      await this.save();
      
      return {
        status: 'known_legitimate',
        confidence: Math.min(0.9, 0.6 + (data.count * 0.05)),
        message: `This sender has been verified as legitimate through ${data.count} previous safe communications`,
        firstSeen: new Date(data.firstSeen).toLocaleDateString(),
        lastSeen: new Date(data.lastSeen).toLocaleDateString()
      };
    }

    // Check if known malicious
    if (this.knownMalicious.has(domain)) {
      const data = this.knownMalicious.get(domain);
      return {
        status: 'known_malicious',
        confidence: 0.95,
        message: `This sender has been flagged as malicious`,
        reason: data.reason,
        flaggedDate: new Date(data.flaggedDate).toLocaleDateString()
      };
    }

    // Check for similar patterns
    const similarPattern = this.findSimilarPattern(domain);
    if (similarPattern) {
      return {
        status: 'similar_to_known',
        confidence: 0.7,
        message: `This domain is similar to known ${similarPattern.type}: ${similarPattern.domain}`,
        recommendation: similarPattern.type === 'legitimate' ? 
          'May be legitimate but verify carefully' : 
          'Suspicious - exercise extreme caution'
      };
    }

    return null;
  }

  async markLegitimate(sender, emailData) {
    const domain = sender.split('@')[1] || '';
    
    if (!this.knownLegitimate.has(domain)) {
      this.knownLegitimate.set(domain, {
        firstSeen: Date.now(),
        lastSeen: Date.now(),
        count: 1,
        patterns: this.extractPatterns(emailData)
      });
    } else {
      const data = this.knownLegitimate.get(domain);
      data.lastSeen = Date.now();
      data.count++;
    }

    // Remove from malicious if it was there
    if (this.knownMalicious.has(domain)) {
      this.knownMalicious.delete(domain);
    }

    await this.save();
  }

  async markMalicious(sender, reason) {
    const domain = sender.split('@')[1] || '';
    
    this.knownMalicious.set(domain, {
      flaggedDate: Date.now(),
      reason: reason
    });

    // Remove from legitimate if it was there
    if (this.knownLegitimate.has(domain)) {
      this.knownLegitimate.delete(domain);
    }

    await this.save();
  }

  extractPatterns(emailData) {
    return {
      senderPattern: this.normalizeDomain(emailData.sender),
      subjectKeywords: this.extractKeywords(emailData.subject),
      hasAttachments: (emailData.attachments || []).length > 0,
      isHTML: !!(emailData.html)
    };
  }

  normalizeDomain(sender) {
    const domain = sender.split('@')[1] || '';
    // Remove subdomains for pattern matching
    const parts = domain.split('.');
    return parts.slice(-2).join('.');
  }

  extractKeywords(text) {
    if (!text) return [];
    const words = text.toLowerCase().split(/\s+/);
    const stopWords = ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 'of', 'with'];
    return words.filter(w => w.length > 3 && !stopWords.includes(w)).slice(0, 5);
  }

  findSimilarPattern(domain) {
    const rootDomain = domain.split('.').slice(-2).join('.');

    // Check legitimate domains for similarity
    for (const [legitDomain] of this.knownLegitimate) {
      if (this.isSimilar(legitDomain, rootDomain)) {
        return { type: 'legitimate', domain: legitDomain };
      }
    }

    // Check malicious domains for similarity
    for (const [malDomain] of this.knownMalicious) {
      if (this.isSimilar(malDomain, rootDomain)) {
        return { type: 'malicious', domain: malDomain };
      }
    }

    return null;
  }

  isSimilar(domain1, domain2) {
    // Simple similarity check
    if (domain1 === domain2) return true;
    
    // Check for typosquatting
    const distance = this.levenshteinDistance(domain1, domain2);
    if (distance <= 2 && Math.abs(domain1.length - domain2.length) <= 2) {
      return true;
    }

    return false;
  }

  levenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(null));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1,
            dp[i][j - 1] + 1,
            dp[i - 1][j - 1] + 1
          );
        }
      }
    }

    return dp[m][n];
  }

  getStats() {
    return {
      knownLegitimate: this.knownLegitimate.size,
      knownMalicious: this.knownMalicious.size,
      patternsLearned: this.communicationPatterns.size
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIMemory;
}
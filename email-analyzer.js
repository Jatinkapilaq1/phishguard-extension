const EmailAnalyzer = {
  suspiciousHeaders: [
    'X-Originating-IP',
    'X-Mailer',
    'Received-SPF',
    'Authentication-Results'
  ],

  spoofingIndicators: [
    'fail',
    'softfail',
    'neutral',
    'none'
  ],

  analyzeHeaders(headers) {
    const results = {
      isSuspicious: false,
      issues: [],
      score: 0
    };

    if (!headers) return results;

    const headerLines = headers.split('\n');
    
    headerLines.forEach(line => {
      if (line.startsWith('From:')) {
        const fromAnalysis = this.analyzeFromHeader(line);
        if (fromAnalysis.suspicious) {
          results.issues.push(...fromAnalysis.issues);
          results.score += fromAnalysis.score;
        }
      }

      if (line.startsWith('Received:')) {
        const receivedAnalysis = this.analyzeReceivedHeader(line);
        if (receivedAnalysis.suspicious) {
          results.issues.push(...receivedAnalysis.issues);
          results.score += receivedAnalysis.score;
        }
      }

      if (line.startsWith('Return-Path:') && line.includes('<>') === false) {
        const returnPath = line.split(':')[1]?.trim();
        if (returnPath && !returnPath.includes('@')) {
          results.issues.push({
            type: 'invalid_return_path',
            message: 'Return path is malformed',
            severity: 'medium'
          });
          results.score += 3;
        }
      }
    });

    const spfResult = this.extractSPFResult(headers);
    if (spfResult) {
      const spfAnalysis = this.analyzeSPF(spfResult);
      if (spfAnalysis.suspicious) {
        results.issues.push(...spfAnalysis.issues);
        results.score += spfAnalysis.score;
      }
    }

    const dkimResult = this.extractDKIMResult(headers);
    if (dkimResult) {
      const dkimAnalysis = this.analyzeDKIM(dkimResult);
      if (dkimAnalysis.suspicious) {
        results.issues.push(...dkimAnalysis.issues);
        results.score += dkimAnalysis.score;
      }
    }

    results.isSuspicious = results.score >= 5 || results.issues.some(i => i.severity === 'high');
    
    return results;
  },

  analyzeFromHeader(header) {
    const result = { suspicious: false, issues: [], score: 0 };
    const fromEmail = header.split(':')[1]?.trim();
    
    if (!fromEmail) return result;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(fromEmail)) {
      result.issues.push({
        type: 'invalid_email_format',
        message: 'From address has invalid format',
        severity: 'medium'
      });
      result.score += 2;
      result.suspicious = true;
    }

    const displayMatch = fromEmail.match(/"(.*?)"\s*<(.+?)>/);
    if (displayMatch) {
      const displayName = displayMatch[1];
      const actualEmail = displayMatch[2];
      
      const knownBrands = ['paypal', 'amazon', 'microsoft', 'google', 'apple', 'facebook'];
      const displayLower = displayName.toLowerCase();
      const emailDomain = actualEmail.split('@')[1]?.toLowerCase();
      
      knownBrands.forEach(brand => {
        if (displayLower.includes(brand) && emailDomain && !emailDomain.includes(brand)) {
          result.issues.push({
            type: 'brand_impersonation',
            message: `Display name mentions ${brand} but email domain is ${emailDomain}`,
            severity: 'high'
          });
          result.score += 5;
          result.suspicious = true;
        }
      });
    }

    return result;
  },

  analyzeReceivedHeader(header) {
    const result = { suspicious: false, issues: [], score: 0 };
    
    const ipMatch = header.match(/\[(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\]/);
    if (ipMatch) {
      const ip = ipMatch[1];
      const ipParts = ip.split('.');
      
      if (ipParts[0] === '10' || 
          ipParts[0] === '192' && ipParts[1] === '168' ||
          ipParts[0] === '172' && parseInt(ipParts[1]) >= 16 && parseInt(ipParts[1]) <= 31) {
        result.issues.push({
          type: 'private_ip',
          message: 'Email originated from private IP address',
          severity: 'low'
        });
        result.score += 1;
      }
    }

    return result;
  },

  extractSPFResult(headers) {
    const spfMatch = headers.match(/Received-SPF:\s*(\w+)/i);
    return spfMatch ? spfMatch[1].toLowerCase() : null;
  },

  analyzeSPF(spfResult) {
    const result = { suspicious: false, issues: [], score: 0 };
    
    if (this.spoofingIndicators.includes(spfResult)) {
      result.issues.push({
        type: 'spf_fail',
        message: `SPF check ${spfResult} - possible email spoofing`,
        severity: spfResult === 'fail' ? 'high' : 'medium'
      });
      result.score = spfResult === 'fail' ? 5 : 3;
      result.suspicious = true;
    }
    
    return result;
  },

  extractDKIMResult(headers) {
    const dkimMatch = headers.match(/dkim=\s*(\w+)/i);
    return dkimMatch ? dkimMatch[1].toLowerCase() : null;
  },

  analyzeDKIM(dkimResult) {
    const result = { suspicious: false, issues: [], score: 0 };
    
    if (dkimResult === 'fail' || dkimResult === 'none') {
      result.issues.push({
        type: 'dkim_fail',
        message: `DKIM check ${dkimResult} - email integrity cannot be verified`,
        severity: dkimResult === 'fail' ? 'high' : 'medium'
      });
      result.score = dkimResult === 'fail' ? 5 : 3;
      result.suspicious = true;
    }
    
    return result;
  },

  analyzeEmailContent(content) {
    const result = {
      urgencyScore: 0,
      suspiciousPatterns: []
    };

    const urgencyKeywords = [
      'urgent', 'immediate', 'action required', 'account suspended',
      'verify your account', 'click here now', 'limited time',
      'expires today', 'final warning', 'legal action'
    ];

    const contentLower = content.toLowerCase();
    
    urgencyKeywords.forEach(keyword => {
      if (contentLower.includes(keyword)) {
        result.urgencyScore++;
        result.suspiciousPatterns.push({
          pattern: keyword,
          type: 'urgency'
        });
      }
    });

    const linkCount = (content.match(/<a\s/gi) || []).length;
    if (linkCount > 5) {
      result.suspiciousPatterns.push({
        pattern: `Contains ${linkCount} links`,
        type: 'excessive_links'
      });
    }

    const shortenedUrls = content.match(/bit\.ly|tinyurl|goo\.gl|t\.co|is\.gd/gi);
    if (shortenedUrls) {
      result.suspiciousPatterns.push({
        pattern: 'Contains shortened URLs',
        type: 'shortened_urls'
      });
    }

    return result;
  },

  generateReport(analysisResults) {
    let report = 'Email Security Analysis Report\n';
    report += '================================\n\n';
    
    if (analysisResults.isSuspicious) {
      report += '⚠️  WARNING: This email shows signs of potential phishing\n\n';
    } else {
      report += '✅  This email appears to be legitimate\n\n';
    }

    if (analysisResults.issues.length > 0) {
      report += 'Issues Found:\n';
      analysisResults.issues.forEach((issue, index) => {
        report += `${index + 1}. [${issue.severity.toUpperCase()}] ${issue.message}\n`;
      });
      report += '\n';
    }

    report += `Risk Score: ${analysisResults.score}/15\n`;
    
    if (analysisResults.score >= 10) {
      report += 'Recommendation: DO NOT interact with this email\n';
    } else if (analysisResults.score >= 5) {
      report += 'Recommendation: Exercise caution\n';
    } else {
      report += 'Recommendation: Safe to proceed\n';
    }

    return report;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = EmailAnalyzer;
}
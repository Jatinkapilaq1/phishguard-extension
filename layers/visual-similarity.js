/**
 * Layer 6: Visual Similarity AI
 * Detects fake login pages by comparing visual elements
 */

class VisualSimilarityLayer {
  constructor() {
    this.knownBrands = {
      'google': {
        colors: ['#4285F4', '#EA4335', '#FBBC04', '#34A853'],
        patterns: ['google', 'gmail', 'youtube'],
        loginDomains: ['accounts.google.com', 'myaccount.google.com']
      },
      'microsoft': {
        colors: ['#00A4EF', '#7FBA00', '#F25022', '#FFB900'],
        patterns: ['microsoft', 'outlook', 'office365', 'live'],
        loginDomains: ['login.microsoftonline.com', 'login.live.com']
      },
      'apple': {
        colors: ['#A2AAAD', '#000000', '#F5F5F7'],
        patterns: ['apple', 'icloud'],
        loginDomains: ['appleid.apple.com', 'icloud.com']
      },
      'amazon': {
        colors: ['#FF9900', '#232F3E', '#FFFFFF'],
        patterns: ['amazon', 'prime'],
        loginDomains: ['amazon.com', 'signin.amazon.com']
      },
      'paypal': {
        colors: ['#003087', '#009CDE', '#FFFFFF'],
        patterns: ['paypal'],
        loginDomains: ['paypal.com', 'www.paypal.com']
      },
      'facebook': {
        colors: ['#1877F2', '#42B72A', '#FFFFFF'],
        patterns: ['facebook', 'fb', 'meta'],
        loginDomains: ['facebook.com', 'www.facebook.com']
      },
      'netflix': {
        colors: ['#E50914', '#000000', '#FFFFFF'],
        patterns: ['netflix'],
        loginDomains: ['netflix.com', 'www.netflix.com']
      },
      'linkedin': {
        colors: ['#0A66C2', '#FFFFFF'],
        patterns: ['linkedin'],
        loginDomains: ['linkedin.com', 'www.linkedin.com']
      }
    };

    this.phishingIndicators = {
      forms: ['password', 'credential', 'login', 'signin', 'email', 'username'],
      buttons: ['sign in', 'log in', 'continue', 'submit', 'verify', 'confirm'],
      security: ['secure', 'encrypted', 'protected', 'verified', 'trusted']
    };
  }

  async analyze(emailData) {
    const evidence = [];
    let score = 0;
    let confidence = 0.6;

    // 1. Check for login page indicators in HTML
    const loginPageResult = this.checkForLoginPage(emailData);
    if (loginPageResult.detected) {
      score += loginPageResult.score;
      evidence.push(...loginPageResult.evidence);
    }

    // 2. Check for brand impersonation in content
    const brandResult = this.checkBrandImpersonation(emailData);
    if (brandResult.suspicious) {
      score += brandResult.score;
      evidence.push(...brandResult.evidence);
    }

    // 3. Check for visual deception patterns
    const deceptionResult = this.checkVisualDeception(emailData);
    if (deceptionResult.suspicious) {
      score += deceptionResult.score;
      evidence.push(...deceptionResult.evidence);
    }

    // 4. Check for embedded images tracking pixels
    const trackingResult = this.checkTrackingPixels(emailData);
    if (trackingResult.suspicious) {
      score += trackingResult.score;
      evidence.push({
        type: 'tracking_pixel',
        severity: 'low',
        finding: 'Email contains tracking pixels',
        explanation: 'Tracking pixels can be used to confirm you opened the email, validating your email address to attackers.'
      });
    }

    return {
      score: Math.min(score, 100),
      confidence: confidence,
      evidence: evidence,
      details: {}
    };
  }

  checkForLoginPage(emailData) {
    const html = emailData.html || '';
    const text = (emailData.body || '').toLowerCase();
    const evidence = [];
    let score = 0;
    let detected = false;

    // Check for form elements
    const hasLoginForm = /<form[^>]*(?:login|signin|auth)[^>]*>/i.test(html);
    const hasPasswordField = /<input[^>]*type=["']password["'][^>]*>/i.test(html);
    const hasEmailField = /<input[^>]*type=["'](?:email|text)["'][^>]*(?:name|id)=["'](?:email|username|login)[^>]*>/i.test(html);

    if (hasLoginForm || (hasPasswordField && hasEmailField)) {
      detected = true;
      score += 25;
      evidence.push({
        type: 'login_form_detected',
        severity: 'critical',
        finding: 'Email contains a login form',
        explanation: 'Legitimate companies rarely embed login forms in emails. This is a strong indicator of a phishing attempt.'
      });

      // Check form action
      const formActionMatch = html.match(/<form[^>]*action=["']([^"']*)["'][^>]*>/i);
      if (formActionMatch) {
        const action = formActionMatch[1];
        if (action && !action.startsWith('https://')) {
          score += 15;
          evidence.push({
            type: 'insecure_form_action',
            severity: 'critical',
            finding: `Form submits to insecure URL: ${action}`,
            explanation: 'The login form sends your credentials over an insecure connection. This is definitely a phishing attempt.'
          });
        }
      }
    }

    return { detected, score, evidence };
  }

  checkBrandImpersonation(emailData) {
    const html = (emailData.html || '').toLowerCase();
    const text = (emailData.body || '').toLowerCase();
    const sender = (emailData.sender || '').toLowerCase();
    const evidence = [];
    let score = 0;
    let suspicious = false;

    for (const [brand, config] of Object.entries(this.knownBrands)) {
      const brandMentions = config.patterns.filter(p => html.includes(p) || text.includes(p));
      
      if (brandMentions.length > 0) {
        // Check if sender domain matches
        const senderDomain = sender.split('@')[1] || '';
        const isLegitimateDomain = config.loginDomains.some(d => senderDomain.includes(d));
        
        if (!isLegitimateDomain) {
          suspicious = true;
          score += 20;
          evidence.push({
            type: 'brand_impersonation',
            severity: 'high',
            finding: `Email impersonates ${brand} but comes from ${senderDomain}`,
            explanation: `This email claims to be from ${brand} but the sender domain (${senderDomain}) is not an official ${brand} domain. Official emails come from ${config.loginDomains[0]}.`
          });

          // Check for color scheme matching
          const colorMatches = this.checkColorScheme(html, config.colors);
          if (colorMatches > 0) {
            score += 10;
            evidence.push({
              type: 'brand_colors_detected',
              severity: 'medium',
              finding: `Email uses ${brand}'s brand colors`,
              explanation: `The email uses color schemes similar to ${brand}'s official branding, attempting to appear legitimate.`
            });
          }

          // Check for logo references
          const logoReferences = html.match(new RegExp(`${brand}.*logo|logo.*${brand}`, 'i'));
          if (logoReferences) {
            score += 8;
            evidence.push({
              type: 'brand_logo_detected',
              severity: 'medium',
              finding: `Email references ${brand} logo`,
              explanation: 'References to brand logos are used to increase perceived legitimacy.'
            });
          }
        }
      }
    }

    return { suspicious, score, evidence };
  }

  checkColorScheme(html, brandColors) {
    let matches = 0;
    for (const color of brandColors) {
      if (html.includes(color.toLowerCase())) {
        matches++;
      }
    }
    return matches;
  }

  checkVisualDeception(emailData) {
    const html = emailData.html || '';
    const evidence = [];
    let score = 0;
    let suspicious = false;

    // Check for hidden elements
    const hiddenElements = html.match(/<[^>]*style=["'][^"']*visibility:\s*hidden[^"']*["'][^>]*>/gi);
    if (hiddenElements && hiddenElements.length > 0) {
      suspicious = true;
      score += 15;
      evidence.push({
        type: 'hidden_elements',
        severity: 'high',
        finding: 'Email contains hidden HTML elements',
        explanation: 'Hidden elements can be used to inject malicious content or tracking code while remaining invisible to users.'
      });
    }

    // Check for iframe usage
    const iframes = html.match(/<iframe[^>]*>/gi);
    if (iframes && iframes.length > 0) {
      suspicious = true;
      score += 20;
      evidence.push({
        type: 'iframe_detected',
        severity: 'critical',
        finding: `Email contains ${iframes.length} iframe(s)`,
        explanation: 'Iframes can load external content including phishing pages or malware. This is a serious security risk.'
      });
    }

    // Check for obfuscated JavaScript
    const scriptTags = html.match(/<script[^>]*>/gi);
    if (scriptTags && scriptTags.length > 0) {
      suspicious = true;
      score += 25;
      evidence.push({
        type: 'javascript_detected',
        severity: 'critical',
        finding: 'Email contains JavaScript code',
        explanation: 'JavaScript in emails can execute malicious code, steal credentials, or redirect to phishing sites.'
      });
    }

    // Check for data: URIs
    const dataUris = html.match(/data:[^"'\s]*/gi);
    if (dataUris && dataUris.length > 0) {
      suspicious = true;
      score += 15;
      evidence.push({
        type: 'data_uri',
        severity: 'high',
        finding: 'Email contains data: URIs',
        explanation: 'Data URIs can embed malicious content directly in the email, bypassing security filters.'
      });
    }

    return { suspicious, score, evidence };
  }

  checkTrackingPixels(emailData) {
    const html = emailData.html || '';
    
    // Common tracking pixel patterns
    const trackingPatterns = [
      /<img[^>]*width=["']1["'][^>]*height=["']1["'][^>]*>/gi,
      /<img[^>]*style=["'][^"']*display:\s*none[^"']*["'][^>]*>/gi,
      /<img[^>]*src=["'][^"']*tracking[^"']*["'][^>]*>/gi,
      /<img[^>]*src=["'][^"']*pixel[^"']*["'][^>]*>/gi,
      /<img[^>]*src=["'][^"']*open\.php[^"']*["'][^>]*>/gi
    ];

    for (const pattern of trackingPatterns) {
      if (pattern.test(html)) {
        return { suspicious: true, score: 5 };
      }
    }

    return { suspicious: false };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = VisualSimilarityLayer;
}
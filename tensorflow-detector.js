const TensorFlowDetector = {
  model: null,
  isLoaded: false,
  
  async init() {
    try {
      if (typeof tf !== 'undefined') {
        console.log('TensorFlow.js available');
        this.isLoaded = true;
      } else {
        console.log('TensorFlow.js not loaded - using fallback detection');
      }
    } catch (error) {
      console.error('TensorFlow init error:', error);
    }
  },

  async analyzeScreenshot(screenshotData) {
    if (!this.isLoaded) {
      return this.fallbackAnalysis();
    }

    try {
      const img = new Image();
      img.src = screenshotData;
      
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });

      const tensor = tf.browser.fromPixels(img)
        .resizeBilinear([224, 224])
        .expandDims(0)
        .div(255.0);

      const prediction = this.model ? await this.model.predict(tensor).data() : [0.5];
      
      tensor.dispose();
      
      return {
        isSuspicious: prediction[0] > 0.7,
        confidence: prediction[0],
        type: 'visual_analysis'
      };
    } catch (error) {
      console.error('TensorFlow analysis error:', error);
      return this.fallbackAnalysis();
    }
  },

  fallbackAnalysis() {
    return {
      isSuspicious: false,
      confidence: 0,
      type: 'fallback',
      message: 'Visual analysis unavailable - using pattern matching'
    };
  },

  analyzeLoginForm() {
    const forms = document.querySelectorAll('form');
    const suspiciousPatterns = [];

    forms.forEach(form => {
      const inputs = form.querySelectorAll('input');
      const hasPassword = Array.from(inputs).some(i => i.type === 'password');
      const hasEmail = Array.from(inputs).some(i => 
        i.type === 'email' || i.name?.includes('email') || i.name?.includes('user')
      );

      if (hasPassword && hasEmail) {
        const action = form.action || '';
        const method = form.method?.toLowerCase() || 'get';

        if (method === 'get') {
          suspiciousPatterns.push({
            issue: 'Credentials sent via GET',
            severity: 'high',
            element: form
          });
        }

        if (action && !action.startsWith('https://')) {
          suspiciousPatterns.push({
            issue: 'Form submits to non-HTTPS URL',
            severity: 'medium',
            element: form
          });
        }

        const hostname = window.location.hostname;
        if (action && !action.includes(hostname)) {
          suspiciousPatterns.push({
            issue: 'Form submits to different domain',
            severity: 'high',
            element: form
          });
        }
      }
    });

    return suspiciousPatterns;
  },

  detectBrandImpersonation() {
    const hostname = window.location.hostname.toLowerCase();
    const pageText = document.body?.innerText?.toLowerCase() || '';
    
    const brands = {
      paypal: {
        keywords: ['paypal', 'pay pal'],
        domains: ['paypal.com', 'paypal.me'],
        logoPatterns: ['paypal-logo', 'paypal-icon']
      },
      amazon: {
        keywords: ['amazon', 'amzn'],
        domains: ['amazon.com', 'amazon.co.uk', 'amazon.in'],
        logoPatterns: ['amazon-logo', 'a-logo']
      },
      google: {
        keywords: ['google', 'gmail', 'google account'],
        domains: ['google.com', 'gmail.com', 'google.co.uk'],
        logoPatterns: ['google-logo', 'gs-logo']
      },
      microsoft: {
        keywords: ['microsoft', 'outlook', 'office 365', 'live.com'],
        domains: ['microsoft.com', 'outlook.com', 'live.com'],
        logoPatterns: ['microsoft-logo', 'ms-logo']
      },
      apple: {
        keywords: ['apple', 'icloud', 'apple id'],
        domains: ['apple.com', 'icloud.com'],
        logoPatterns: ['apple-logo', 'apple-icon']
      },
      facebook: {
        keywords: ['facebook', 'fb', 'meta'],
        domains: ['facebook.com', 'fb.com', 'meta.com'],
        logoPatterns: ['facebook-logo', 'fb-logo']
      }
    };

    const detectedBrands = [];

    Object.entries(brands).forEach(([brand, config]) => {
      const mentioned = config.keywords.some(keyword => pageText.includes(keyword));
      const domainMatch = config.domains.some(domain => hostname.includes(domain));
      const logoPresent = config.logoPatterns.some(pattern => 
        document.querySelector(`[class*="${pattern}"], [id*="${pattern}"]`)
      );

      if ((mentioned || logoPresent) && !domainMatch) {
        detectedBrands.push({
          brand: brand,
          confidence: (mentioned ? 0.4 : 0) + (logoPresent ? 0.6 : 0),
          evidence: {
            textMention: mentioned,
            logoDetected: logoPresent,
            domainMismatch: !domainMatch
          }
        });
      }
    });

    return detectedBrands;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TensorFlowDetector;
}
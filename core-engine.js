/**
 * PhishGuard AI - Core Analysis Engine
 * Enterprise-Grade Email Security Copilot
 * 
 * Architecture: Multi-Layered AI Analysis System
 * Implements 8 analysis layers like enterprise security tools
 */

class PhishGuardEngine {
  constructor() {
    this.layers = {
      identity: new SenderIdentityLayer(),
      domain: new DomainIntelligenceLayer(),
      url: new URLIntelligenceLayer(),
      content: new ContentAnalysisLayer(),
      attachment: new AttachmentAnalysisLayer(),
      visual: new VisualSimilarityLayer(),
      behavior: new BehaviorAnalysisLayer(),
      threatIntel: new ThreatIntelligenceLayer()
    };
    
    this.memory = new AIMemory();
    this.scoring = new WeightedScoringEngine();
    this.explainer = new ExplainableAI();
    
    this.weights = {
      identity: 15,
      domain: 20,
      url: 20,
      content: 10,
      attachment: 10,
      visual: 10,
      behavior: 10,
      threatIntel: 5
    };
  }

  async analyzeEmail(emailData) {
    const layerResults = {};
    const evidence = [];
    
    // Run all layers in parallel for performance
    const layerPromises = Object.entries(this.layers).map(async ([name, layer]) => {
      try {
        const result = await layer.analyze(emailData);
        layerResults[name] = result;
        if (result.evidence) {
          evidence.push(...result.evidence.map(e => ({ ...e, layer: name })));
        }
      } catch (error) {
        layerResults[name] = { score: 0, confidence: 0, error: error.message };
      }
    });
    
    await Promise.all(layerPromises);
    
    // Memory check
    const memoryInsight = await this.memory.checkSender(emailData.sender);
    if (memoryInsight) {
      layerResults.memory = memoryInsight;
    }
    
    // Calculate final score
    const finalScore = this.scoring.calculate(layerResults, this.weights);
    
    // Generate explanation
    const explanation = this.explainer.generate(finalScore, layerResults, evidence);
    
    // Determine risk level
    const riskLevel = this.determineRiskLevel(finalScore);
    
    // Generate recommendation
    const recommendation = this.generateRecommendation(riskLevel, layerResults);
    
    return {
      threatScore: finalScore.threat,
      legitimacyScore: finalScore.legitimacy,
      confidence: finalScore.confidence,
      riskLevel: riskLevel,
      explanation: explanation,
      recommendation: recommendation,
      layerResults: layerResults,
      evidence: evidence,
      timestamp: new Date().toISOString()
    };
  }

  determineRiskLevel(score) {
    if (score >= 85) return { level: 'CRITICAL', color: '#ff1744', label: 'Almost Certain Phishing' };
    if (score >= 70) return { level: 'HIGH', color: '#f44336', label: 'Likely Phishing' };
    if (score >= 50) return { level: 'MEDIUM', color: '#ff9800', label: 'Suspicious - Proceed with Caution' };
    if (score >= 30) return { level: 'LOW', color: '#ffc107', label: 'Minor Concerns Detected' };
    return { level: 'SAFE', color: '#4caf50', label: 'Appears Legitimate' };
  }

  generateRecommendation(riskLevel, layerResults) {
    const recommendations = {
      CRITICAL: {
        action: 'BLOCK',
        message: 'Do NOT interact with this email. Delete immediately or report to IT security.',
        details: [
          'Do not click any links',
          'Do not download attachments',
          'Do not reply with any information',
          'Report as phishing if possible',
          'If you already clicked, change passwords immediately'
        ]
      },
      HIGH: {
        action: 'WARN',
        message: 'High probability of phishing. Do not proceed without verification.',
        details: [
          'Do not click links - hover to preview destinations',
          'Verify sender through official channels (not replying to this email)',
          'Check for domain spoofing and display name manipulation',
          'Contact the supposed sender through known phone number or website'
        ]
      },
      MEDIUM: {
        action: 'CAUTION',
        message: 'Suspicious indicators detected. Verify before taking action.',
        details: [
          'Hover over all links before clicking',
          'Verify sender identity through secondary channel',
          'Check for urgency tactics and pressure language',
          'If requesting credentials, verify through official app/website'
        ]
      },
      LOW: {
        action: 'REVIEW',
        message: 'Minor concerns detected. Exercise normal caution.',
        details: [
          'Review sender address carefully',
          'Check links before clicking',
          'Be aware of social engineering tactics',
          'Trust your instincts - if something feels off, verify'
        ]
      },
      SAFE: {
        action: 'ALLOW',
        message: 'This email appears legitimate based on our analysis.',
        details: [
          'Standard security practices still apply',
          'Verify links before clicking',
          'Be cautious with unexpected attachments',
          'Report if something seems wrong'
        ]
      }
    };
    
    return recommendations[riskLevel.level];
  }
}

// Export for use in extension
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PhishGuardEngine;
}
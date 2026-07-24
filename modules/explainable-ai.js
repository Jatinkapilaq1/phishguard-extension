/**
 * Explainable AI Module
 * Generates human-readable explanations for threat analysis
 */

class ExplainableAI {
  constructor() {
    this.severityDescriptions = {
      critical: 'Immediate threat - likely malicious',
      high: 'Strong indicators of phishing',
      medium: 'Suspicious patterns detected',
      low: 'Minor concerns noted',
      info: 'Informational - no threat'
    };

    this.attackCategories = {
      credential_harvesting: 'Attempts to steal login credentials',
      brand_impersonation: 'Impersonates a trusted brand',
      social_engineering: 'Uses psychological manipulation',
      malware_delivery: 'Attempts to deliver malicious software',
      financial_fraud: 'Targets financial information',
      identity_theft: 'Attempts to steal personal identity',
      data_exfiltration: 'Attempts to steal sensitive data',
      session_hijacking: 'Attempts to steal session tokens',
      none: 'No attack detected'
    };
  }

  generate(finalScore, layerResults, evidence) {
    const explanation = {
      summary: this.generateSummary(finalScore, evidence),
      topFindings: this.getTopFindings(evidence),
      detailedAnalysis: this.generateDetailedAnalysis(layerResults, evidence),
      riskFactors: this.getRiskFactors(evidence),
      positiveSignals: this.getPositiveSignals(evidence),
      attackVector: this.classifyAttackVector(evidence),
      confidenceExplanation: this.explainConfidence(finalScore, layerResults),
      actionableInsights: this.getActionableInsights(finalScore, evidence)
    };

    return explanation;
  }

  generateSummary(finalScore, evidence) {
    const threatLevel = finalScore.threat;
    const confidence = finalScore.confidence;

    let summary = '';

    if (threatLevel >= 85) {
      summary = `This email exhibits strong indicators of a phishing attack. Our analysis detected multiple critical threat signals with ${Math.round(confidence * 100)}% confidence. Immediate action is recommended.`;
    } else if (threatLevel >= 70) {
      summary = `This email is likely a phishing attempt. Several high-severity indicators were detected with ${Math.round(confidence * 100)}% confidence. Do not interact with this email without verification.`;
    } else if (threatLevel >= 50) {
      summary = `This email contains suspicious elements that warrant caution. Our analysis found moderate risk indicators with ${Math.round(confidence * 100)}% confidence. Verify the sender before taking any action.`;
    } else if (threatLevel >= 30) {
      summary = `This email shows minor concerns but appears relatively low-risk. Our analysis found ${Math.round(confidence * 100)}% confidence in this assessment. Standard security practices apply.`;
    } else {
      summary = `This email appears legitimate based on our analysis. We found ${finalScore.legitimacy}% legitimacy indicators with ${Math.round(confidence * 100)}% confidence. Standard security practices still apply.`;
    }

    return summary;
  }

  getTopFindings(evidence) {
    // Sort by severity and get top 5
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
    
    return evidence
      .filter(e => e.severity !== 'info')
      .sort((a, b) => (severityOrder[a.severity] || 5) - (severityOrder[b.severity] || 5))
      .slice(0, 5)
      .map(e => ({
        finding: e.finding,
        severity: e.severity,
        layer: e.layer || 'unknown'
      }));
  }

  generateDetailedAnalysis(layerResults, evidence) {
    const analysis = {};

    for (const [layerName, result] of Object.entries(layerResults)) {
      if (result && result.score !== undefined) {
        analysis[layerName] = {
          score: result.score,
          assessment: this.getLayerAssessment(layerName, result.score),
          evidenceCount: result.evidence ? result.evidence.length : 0,
          hasCriticalFindings: result.evidence ? 
            result.evidence.some(e => e.severity === 'critical') : false
        };
      }
    }

    return analysis;
  }

  getLayerAssessment(layerName, score) {
    if (score >= 30) return 'Critical concerns detected';
    if (score >= 20) return 'Significant risk indicators';
    if (score >= 10) return 'Moderate concerns found';
    if (score > 0) return 'Minor issues noted';
    return 'No concerns detected';
  }

  getRiskFactors(evidence) {
    return evidence
      .filter(e => e.severity === 'critical' || e.severity === 'high')
      .map(e => ({
        factor: e.finding,
        severity: e.severity,
        explanation: e.explanation
      }));
  }

  getPositiveSignals(evidence) {
    return evidence
      .filter(e => e.severity === 'info')
      .map(e => ({
        signal: e.finding,
        explanation: e.explanation
      }));
  }

  classifyAttackVector(evidence) {
    const vectors = {
      credential_harvesting: 0,
      brand_impersonation: 0,
      social_engineering: 0,
      malware_delivery: 0,
      financial_fraud: 0,
      identity_theft: 0
    };

    for (const e of evidence) {
      if (e.type && e.type.includes('credential')) vectors.credential_harvesting += 2;
      if (e.type && e.type.includes('brand')) vectors.brand_impersonation += 2;
      if (e.type && e.type.includes('social') || e.type && e.type.includes('psychological')) vectors.social_engineering += 2;
      if (e.type && e.type.includes('attachment') || e.type && e.type.includes('download')) vectors.malware_delivery += 2;
      if (e.type && e.type.includes('financial')) vectors.financial_fraud += 2;
      if (e.type && e.type.includes('identity')) vectors.identity_theft += 2;
    }

    const maxVector = Object.entries(vectors).reduce((a, b) => a[1] > b[1] ? a : b);
    
    if (maxVector[1] === 0) {
      return { type: 'none', description: 'No specific attack vector identified' };
    }

    return {
      type: maxVector[0],
      description: this.attackCategories[maxVector[0]],
      confidence: Math.min(maxVector[1] / 6, 1)
    };
  }

  explainConfidence(finalScore, layerResults) {
    const layersAnalyzed = Object.keys(layerResults).length;
    const layersWithEvidence = Object.values(layerResults).filter(r => 
      r && r.evidence && r.evidence.length > 0
    ).length;

    let explanation = `Analysis covered ${layersAnalyzed} security layers. `;
    
    if (layersWithEvidence > 0) {
      explanation += `${layersWithEvidence} layer(s) produced findings. `;
    }

    if (finalScore.confidence >= 0.8) {
      explanation += 'High confidence in this assessment due to consistent signals across multiple layers.';
    } else if (finalScore.confidence >= 0.6) {
      explanation += 'Moderate confidence. Some layers produced conflicting signals.';
    } else {
      explanation += 'Lower confidence due to limited or ambiguous signals. Manual review recommended.';
    }

    return explanation;
  }

  getActionableInsights(finalScore, evidence) {
    const insights = [];
    const threatLevel = finalScore.threat;

    if (threatLevel >= 70) {
      insights.push({
        action: 'DO NOT click any links in this email',
        reason: 'High probability of phishing'
      });
      insights.push({
        action: 'DO NOT download or open any attachments',
        reason: 'May contain malware'
      });
      insights.push({
        action: 'Report this email as phishing',
        reason: 'Helps protect others'
      });
      insights.push({
        action: 'Delete this email',
        reason: 'Eliminates risk'
      });
    } else if (threatLevel >= 50) {
      insights.push({
        action: 'Verify sender through official channels',
        reason: 'Confirm legitimacy before acting'
      });
      insights.push({
        action: 'Hover over all links before clicking',
        reason: 'Verify destinations are legitimate'
      });
      insights.push({
        action: 'Do not provide any personal information',
        reason: 'Potential credential harvesting'
      });
    } else if (threatLevel >= 30) {
      insights.push({
        action: 'Exercise normal caution',
        reason: 'Minor concerns detected'
      });
      insights.push({
        action: 'Verify unexpected requests',
        reason: 'Standard security practice'
      });
    } else {
      insights.push({
        action: 'Safe to proceed with normal caution',
        reason: 'No significant threats detected'
      });
    }

    return insights;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ExplainableAI;
}
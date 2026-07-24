/**
 * Weighted Scoring Engine
 * Combines layer results into final threat score
 */

class WeightedScoringEngine {
  constructor() {
    // Layer weights (must sum to 100)
    this.defaultWeights = {
      identity: 15,
      domain: 20,
      url: 20,
      content: 10,
      attachment: 10,
      visual: 10,
      behavior: 10,
      threatIntel: 5
    };

    // Confidence thresholds
    this.confidenceThresholds = {
      high: 0.8,
      medium: 0.6,
      low: 0.4
    };
  }

  calculate(layerResults, weights = this.defaultWeights) {
    let weightedSum = 0;
    let totalWeight = 0;
    let maxConfidence = 0;
    let layerScores = {};

    // Calculate weighted score
    for (const [layerName, result] of Object.entries(layerResults)) {
      if (result && typeof result.score === 'number') {
        const weight = weights[layerName] || 10;
        const score = Math.max(0, Math.min(100, result.score)); // Clamp 0-100
        const confidence = result.confidence || 0.5;

        weightedSum += score * weight * confidence;
        totalWeight += weight * confidence;

        maxConfidence = Math.max(maxConfidence, confidence);

        layerScores[layerName] = {
          rawScore: result.score,
          normalizedScore: score,
          weight: weight,
          weightedContribution: (score * weight * confidence) / 100
        };
      }
    }

    // Calculate final threat score
    const threatScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

    // Calculate legitimacy score (inverse with adjustments)
    const legitimacyScore = this.calculateLegitimacyScore(threatScore, layerResults);

    // Calculate overall confidence
    const confidence = this.calculateConfidence(layerResults, maxConfidence);

    // Calculate certainty (how sure we are about the classification)
    const certainty = this.calculateCertainty(threatScore, confidence);

    return {
      threat: threatScore,
      legitimacy: legitimacyScore,
      confidence: confidence,
      certainty: certainty,
      layerScores: layerScores,
      breakdown: this.generateBreakdown(layerResults, weights)
    };
  }

  calculateLegitimacyScore(threatScore, layerResults) {
    // Start with inverse of threat score
    let legitimacy = 100 - threatScore;

    // Boost for positive signals
    const positiveLayers = ['identity', 'domain', 'threatIntel'];
    for (const layer of positiveLayers) {
      if (layerResults[layer] && layerResults[layer].evidence) {
        const positiveSignals = layerResults[layer].evidence.filter(e => 
          e.severity === 'info' || (e.type && e.type.includes('trusted'))
        );
        legitimacy += positiveSignals.length * 5;
      }
    }

    // Reduce for multiple negative signals
    let negativeCount = 0;
    for (const layer of Object.keys(layerResults)) {
      if (layerResults[layer] && layerResults[layer].evidence) {
        negativeCount += layerResults[layer].evidence.filter(e => 
          e.severity === 'critical' || e.severity === 'high'
        ).length;
      }
    }
    
    if (negativeCount > 3) {
      legitimacy -= (negativeCount - 3) * 5;
    }

    return Math.max(0, Math.min(100, Math.round(legitimacy)));
  }

  calculateConfidence(layerResults, maxConfidence) {
    const confidences = [];
    let evidenceCount = 0;
    let layersWithEvidence = 0;

    for (const [layerName, result] of Object.entries(layerResults)) {
      if (result && result.confidence) {
        confidences.push(result.confidence);
      }
      if (result && result.evidence && result.evidence.length > 0) {
        layersWithEvidence++;
        evidenceCount += result.evidence.length;
      }
    }

    // Base confidence from average layer confidence
    let confidence = confidences.length > 0 
      ? confidences.reduce((a, b) => a + b, 0) / confidences.length 
      : 0.5;

    // Adjust based on evidence quantity
    if (evidenceCount > 5) {
      confidence += 0.1;
    } else if (evidenceCount === 0) {
      confidence -= 0.2;
    }

    // Adjust based on layer coverage
    const layerCoverage = layersWithEvidence / Object.keys(layerResults).length;
    confidence += (layerCoverage - 0.5) * 0.2;

    // Cap confidence
    return Math.max(0.3, Math.min(0.98, confidence));
  }

  calculateCertainty(threatScore, confidence) {
    // How certain are we about the classification?
    // High certainty when score is far from thresholds and confidence is high
    
    const distanceFromThreshold = Math.min(
      Math.abs(threatScore - 30), // Low-Medium threshold
      Math.abs(threatScore - 50), // Medium-High threshold
      Math.abs(threatScore - 70)  // High-Critical threshold
    );

    const certainty = (confidence * 0.6) + ((distanceFromThreshold / 50) * 0.4);
    
    return Math.max(0.3, Math.min(0.95, certainty));
  }

  generateBreakdown(layerResults, weights) {
    const breakdown = {};

    for (const [layerName, result] of Object.entries(layerResults)) {
      if (result) {
        breakdown[layerName] = {
          score: result.score || 0,
          weight: weights[layerName] || 10,
          contribution: ((result.score || 0) * (weights[layerName] || 10) / 100).toFixed(2),
          evidenceCount: result.evidence ? result.evidence.length : 0,
          hasEvidence: result.evidence && result.evidence.length > 0
        };
      }
    }

    return breakdown;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = WeightedScoringEngine;
}
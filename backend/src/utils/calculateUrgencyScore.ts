/**
 * SETU – AI Urgency Score Calculator
 * Calculates urgency score on 0-140 scale based on multiple factors
 * 
 * Score Breakdown:
 * - Category Impact: 0-30 points
 * - Student Count: 0-25 points
 * - Time Sensitivity: 0-25 points
 * - Safety Risk: 0-30 points
 * - Days Since Submission: 0-20 points
 * - Principal Endorsement: +10 points
 */

export interface IssueData {
  category: 'water' | 'electricity' | 'building' | 'safety' | 'finance' | 'other';
  description: string;
  selfReportedUrgency: 'low' | 'medium' | 'high';
  studentsAffected?: number;
  hasPhoto?: boolean;
  hasVoiceNote?: boolean;
  daysSinceSubmission: number;
  isPrincipalEndorsed?: boolean;
}

/**
 * Category Impact Scores (0-30 points)
 */
const CATEGORY_WEIGHTS = {
  safety: 30,      // Immediate safety risks
  water: 25,       // Basic necessity
  electricity: 20, // Essential utility
  building: 20,    // Infrastructure
  finance: 15,     // Administrative
  other: 10,       // Miscellaneous
};

/**
 * Self-Reported Urgency Multiplier
 */
const URGENCY_MULTIPLIERS = {
  low: 0.7,
  medium: 1.0,
  high: 1.3,
};

/**
 * Calculate AI Urgency Score (0-140 scale)
 */
export function calculateUrgencyScore(issue: IssueData): number {
  let score = 0;

  // 1. Category Impact (0-30 points)
  score += CATEGORY_WEIGHTS[issue.category] || 10;

  // 2. Student Count (0-25 points)
  if (issue.studentsAffected) {
    if (issue.studentsAffected >= 100) score += 25;
    else if (issue.studentsAffected >= 50) score += 20;
    else if (issue.studentsAffected >= 20) score += 15;
    else if (issue.studentsAffected >= 10) score += 10;
    else score += 5;
  }

  // 3. Self-Reported Urgency (0-25 points)
  const baseUrgencyScore = 15;
  const urgencyMultiplier = URGENCY_MULTIPLIERS[issue.selfReportedUrgency];
  score += baseUrgencyScore * urgencyMultiplier;

  // 4. Safety Keywords in Description (0-30 points)
  const safetyKeywords = [
    'injury', 'injured', 'hurt', 'danger', 'dangerous', 'unsafe', 'emergency',
    'fire', 'broken glass', 'electric shock', 'leak', 'leaking', 'flood',
    'health', 'sick', 'illness', 'contaminated', 'poison', 'toxic',
    'collapse', 'crack', 'fall', 'fell', 'accident'
  ];
  
  const descriptionLower = issue.description.toLowerCase();
  const safetyMatches = safetyKeywords.filter(keyword => 
    descriptionLower.includes(keyword)
  ).length;
  
  score += Math.min(safetyMatches * 10, 30);

  // 5. Days Since Submission (0-20 points)
  // Issues get more urgent as they age
  if (issue.daysSinceSubmission >= 7) score += 20;
  else if (issue.daysSinceSubmission >= 5) score += 15;
  else if (issue.daysSinceSubmission >= 3) score += 10;
  else if (issue.daysSinceSubmission >= 2) score += 5;

  // 6. Evidence Provided (0-10 points)
  if (issue.hasPhoto) score += 5;
  if (issue.hasVoiceNote) score += 5;

  // 7. Principal Endorsement (+10 points)
  if (issue.isPrincipalEndorsed) score += 10;

  // Apply self-reported urgency multiplier to total
  const finalScore = Math.round(score * urgencyMultiplier);

  // Clamp to 0-140 range
  return Math.max(0, Math.min(140, finalScore));
}

/**
 * Get urgency level from score
 * 
 * UI Design Guide v1.1 ranges:
 * - 0-39: Low (Grey)
 * - 40-69: Medium (Blue)
 * - 70-99: High (Amber)
 * - 100-140: Critical (Red, pulsing)
 */
export function getUrgencyLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
  if (score >= 100) return 'critical';
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

/**
 * Get urgency color from score
 * 
 * UI Design Guide v1.1 color mapping:
 * - Low (0-39): Grey #9CA3AF
 * - Medium (40-69): Blue #3B82F6
 * - High (70-99): Amber #F59E0B
 * - Critical (100-140): Red #DC2626
 */
export function getUrgencyColor(score: number): string {
  if (score >= 100) return '#DC2626'; // Red (Critical)
  if (score >= 70) return '#F59E0B';  // Amber (High)
  if (score >= 40) return '#3B82F6';  // Blue (Medium)
  return '#9CA3AF'; // Grey (Low)
}

/**
 * Should the urgency badge pulse?
 */
export function shouldPulse(score: number): boolean {
  return score >= 100;
}

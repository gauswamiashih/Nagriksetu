import { IssueCategory, IssueSeverity } from '@/types';

// High severity keywords indicating urgent/dangerous issues
const HIGH_SEVERITY_KEYWORDS = [
  'accident', 'danger', 'dangerous', 'emergency', 'urgent', 'critical',
  'collapsed', 'broken', 'flooded', 'fire', 'hazard', 'life-threatening',
  'injured', 'death', 'explosion', 'toxic', 'blocked', 'impassable'
];

// Medium severity keywords
const MEDIUM_SEVERITY_KEYWORDS = [
  'leak', 'leaking', 'broken', 'not working', 'outage', 'overflow',
  'clogged', 'damaged', 'faulty', 'malfunction', 'polluted', 'contaminated'
];

/**
 * AI-based severity calculation using rule-based logic
 * Analyzes issue category and description to determine severity
 */
export function calculateSeverity(
  category: IssueCategory,
  title: string,
  description: string
): IssueSeverity {
  const combinedText = `${title} ${description}`.toLowerCase();
  
  // Check for high severity keywords first
  const hasHighSeverityKeyword = HIGH_SEVERITY_KEYWORDS.some(
    keyword => combinedText.includes(keyword)
  );
  
  // Check for medium severity keywords
  const hasMediumSeverityKeyword = MEDIUM_SEVERITY_KEYWORDS.some(
    keyword => combinedText.includes(keyword)
  );

  // Category-based severity rules
  switch (category) {
    case 'road':
      // Road issues with danger keywords are always high
      if (hasHighSeverityKeyword) return 'high';
      // Road damage/potholes affecting traffic flow
      if (combinedText.includes('pothole') || combinedText.includes('crack')) {
        return hasMediumSeverityKeyword ? 'high' : 'medium';
      }
      return 'medium';

    case 'water':
      // Water supply issues affect health
      if (hasHighSeverityKeyword) return 'high';
      if (combinedText.includes('no water') || combinedText.includes('contaminated')) {
        return 'high';
      }
      return hasMediumSeverityKeyword ? 'medium' : 'medium';

    case 'electricity':
      // Electrical issues can be dangerous
      if (hasHighSeverityKeyword) return 'high';
      if (combinedText.includes('exposed wire') || combinedText.includes('sparking')) {
        return 'high';
      }
      return hasMediumSeverityKeyword ? 'medium' : 'medium';

    case 'drainage':
      // Drainage issues affecting sanitation
      if (hasHighSeverityKeyword) return 'high';
      if (combinedText.includes('sewage') || combinedText.includes('overflow')) {
        return 'high';
      }
      return hasMediumSeverityKeyword ? 'medium' : 'low';

    case 'streetlight':
      // Streetlight issues - safety concern at night
      if (hasHighSeverityKeyword) return 'high';
      if (combinedText.includes('dark area') || combinedText.includes('no light')) {
        return 'medium';
      }
      return 'low';

    case 'garbage':
      // Garbage/sanitation - health concern
      if (hasHighSeverityKeyword) return 'high';
      if (combinedText.includes('pile') || combinedText.includes('smell')) {
        return 'medium';
      }
      return 'low';

    default:
      // Other category
      if (hasHighSeverityKeyword) return 'high';
      if (hasMediumSeverityKeyword) return 'medium';
      return 'low';
  }
}

/**
 * Get severity display properties
 */
export function getSeverityConfig(severity: IssueSeverity) {
  switch (severity) {
    case 'high':
      return {
        label: 'High Priority',
        className: 'severity-high',
        color: 'hsl(0 84% 60%)',
      };
    case 'medium':
      return {
        label: 'Medium Priority',
        className: 'severity-medium',
        color: 'hsl(45 93% 47%)',
      };
    case 'low':
      return {
        label: 'Low Priority',
        className: 'severity-low',
        color: 'hsl(145 63% 42%)',
      };
  }
}

/**
 * Get status display properties
 */
export function getStatusConfig(status: string) {
  switch (status) {
    case 'pending':
      return {
        label: 'Pending',
        className: 'status-pending',
        color: 'hsl(45 93% 47%)',
      };
    case 'in-progress':
      return {
        label: 'In Progress',
        className: 'status-in-progress',
        color: 'hsl(210 100% 50%)',
      };
    case 'resolved':
      return {
        label: 'Resolved',
        className: 'status-resolved',
        color: 'hsl(145 63% 32%)',
      };
    default:
      return {
        label: status,
        className: '',
        color: 'gray',
      };
  }
}

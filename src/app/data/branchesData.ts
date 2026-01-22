/**
 * Common branches/departments available in Indian colleges
 * Organized by college type (Engineering, Arts, Commerce, etc.)
 */

// Common Engineering Branches
export const engineeringBranches = [
  "Computer Science and Engineering (CSE)",
  "Information Technology (IT)",
  "Electronics and Communication Engineering (ECE)",
  "Electrical Engineering (EE)",
  "Mechanical Engineering (ME)",
  "Civil Engineering (CE)",
  "Chemical Engineering",
  "Biotechnology",
  "Aerospace Engineering",
  "Automobile Engineering",
  "Industrial Engineering",
  "Production Engineering",
  "Instrumentation Engineering",
  "Metallurgical Engineering",
  "Mining Engineering",
  "Petroleum Engineering",
  "Agricultural Engineering",
  "Environmental Engineering",
  "Artificial Intelligence and Machine Learning (AI/ML)",
  "Data Science",
  "Cyber Security",
  "Internet of Things (IoT)",
  "Robotics and Automation",
];

// Common Arts/Science Branches
export const artsScienceBranches = [
  "Physics",
  "Chemistry",
  "Mathematics",
  "Biology",
  "Zoology",
  "Botany",
  "Microbiology",
  "Biochemistry",
  "Statistics",
  "Computer Science",
  "Electronics",
  "English Literature",
  "Hindi Literature",
  "History",
  "Political Science",
  "Economics",
  "Sociology",
  "Psychology",
  "Philosophy",
  "Geography",
  "Environmental Science",
];

// Common Commerce Branches
export const commerceBranches = [
  "B.Com (General)",
  "B.Com (Honors)",
  "Accounting and Finance",
  "Banking and Insurance",
  "Business Economics",
  "Corporate Secretaryship",
  "E-Commerce",
  "Taxation",
];

// Common Management Branches
export const managementBranches = [
  "MBA (General)",
  "Finance",
  "Marketing",
  "Human Resource Management (HRM)",
  "Operations Management",
  "Business Analytics",
  "International Business",
  "Entrepreneurship",
  "Information Technology Management",
  "Supply Chain Management",
  "Healthcare Management",
];

// Common Medical Branches
export const medicalBranches = [
  "MBBS",
  "BDS (Dental)",
  "BAMS (Ayurveda)",
  "BHMS (Homeopathy)",
  "BUMS (Unani)",
  "B.Pharm (Pharmacy)",
  "Nursing (B.Sc Nursing)",
  "Physiotherapy (BPT)",
  "Occupational Therapy",
  "Medical Lab Technology",
  "Radiology and Imaging Technology",
];

// Common Law Branches
export const lawBranches = [
  "B.A. LL.B",
  "B.Com LL.B",
  "B.Sc LL.B",
  "LL.B (3 Year)",
  "LL.M (Master of Laws)",
  "Corporate Law",
  "Criminal Law",
  "Intellectual Property Law",
  "International Law",
];

/**
 * Get branches based on college name
 * This is a simplified version - you can expand it to be more specific
 */
export function getBranchesByCollege(collegeName: string): string[] {
  const lowerCollege = collegeName.toLowerCase();
  
  // IITs, NITs, and Engineering Colleges
  if (
    lowerCollege.includes('iit') ||
    lowerCollege.includes('nit') ||
    lowerCollege.includes('engineering') ||
    lowerCollege.includes('technology') ||
    lowerCollege.includes('iiit') ||
    lowerCollege.includes('bits')
  ) {
    return engineeringBranches;
  }
  
  // IIMs and Management Institutes
  if (
    lowerCollege.includes('iim') ||
    lowerCollege.includes('management') ||
    lowerCollege.includes('business')
  ) {
    return managementBranches;
  }
  
  // Medical Colleges
  if (
    lowerCollege.includes('medical') ||
    lowerCollege.includes('aiims') ||
    lowerCollege.includes('health')
  ) {
    return medicalBranches;
  }
  
  // Law Colleges
  if (
    lowerCollege.includes('law') ||
    lowerCollege.includes('nlu')
  ) {
    return lawBranches;
  }
  
  // Commerce Colleges
  if (
    lowerCollege.includes('commerce') ||
    lowerCollege.includes('srcc')
  ) {
    return commerceBranches;
  }
  
  // General Universities - return all branches
  if (
    lowerCollege.includes('university') ||
    lowerCollege.includes('college')
  ) {
    return [
      ...engineeringBranches,
      ...artsScienceBranches,
      ...commerceBranches,
      ...managementBranches,
    ];
  }
  
  // Default: return engineering branches (most common)
  return engineeringBranches;
}

/**
 * Search branches by query
 */
export function searchBranches(branches: string[], query: string): string[] {
  if (!query.trim()) {
    return branches;
  }
  
  const lowerQuery = query.toLowerCase();
  return branches.filter(branch =>
    branch.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get all available branches
 */
export function getAllBranches(): string[] {
  return [
    ...new Set([
      ...engineeringBranches,
      ...artsScienceBranches,
      ...commerceBranches,
      ...managementBranches,
      ...medicalBranches,
      ...lawBranches,
    ])
  ].sort();
}

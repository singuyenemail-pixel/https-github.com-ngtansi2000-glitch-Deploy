export type JobSourceType = 'company_direct' | 'facebook_group' | 'tech_forum' | 'ats_direct' | 'raw_cleaned';

export interface Job {
  id: string;
  title: string;
  company: string;
  logoUrl?: string;
  city: string; // e.g. "Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Bình Dương", "Cần Thơ"
  district: string; // e.g. "Quận 1", "Cầu Giấy", "Hải Châu"
  address: string;
  workMode: 'On-site' | 'Hybrid' | 'Remote';
  minSalary: number; // in VND, e.g. 15000000
  maxSalary: number; // in VND, e.g. 35000000
  experienceLevel: 'Fresher' | 'Junior' | 'Middle' | 'Senior' | 'Lead';
  roleCategory: 'Engineering' | 'Design' | 'Marketing' | 'Product' | 'Data' | 'Operations' | 'Sales';
  recruiterEmail: string; // Direct recruiter address, e.g. "tuyendung@fpt.vn"
  recruiterName: string; // e.g. "Ms. Thu Hà - Talent Acquisition Lead"
  recruiterPhone?: string;
  postedDate: string; // YYYY-MM-DD
  postedHoursAgo?: number; // relative freshness
  description: string[];
  requirements: string[];
  benefits: string[];
  verifiedDirectEmail: boolean;
  sourceType?: JobSourceType;
  sourceName?: string;
  sourceUrl?: string;
  rawSourceSnippet?: string;
}

export interface CareerMilestone {
  period: string; // e.g. "1992 - 2005"
  company: string; // e.g. "KEENNESS INDUSTRIAL CO., Ltd."
  role: string; // e.g. "Manager / Full Authority"
  location: string; // e.g. "Taiwan, Vietnam & Cambodia"
  description: string;
  achievements: string[];
  category?: 'Trading' | 'Technology' | 'Manufacturing' | 'FMCG' | 'Management';
}

export interface CandidateProfile {
  fullName: string;
  englishName?: string;
  vietnameseName?: string;
  dateOfBirth?: string; // e.g. "05-04-1971"
  citizenId?: string; // e.g. "089071000050"
  gender?: string; // e.g. "Male"
  email: string;
  phone: string;
  currentTitle: string;
  experienceYears: number;
  skills: string[];
  targetSalaryVnd: number; // e.g. 25000000
  cvFileName: string | null;
  cvFileSize?: string;
  cvFileContent?: string;
  cvUploadedAt?: string;
  originalFileDataUrl?: string; // Exact uploaded file base64 data URL to keep original file without changing content
  originalFileName?: string;
  originalFileType?: string;
  originalFileSizeBytes?: number;
  portfolioUrl?: string;
  photoUrl?: string; // Self image data URL or image path
  coverBackgroundUrl?: string; // Background image data URL or preset ID
  coverHeadline?: string;
  coverTagline?: string;
  careerMilestones?: CareerMilestone[];
  educationSummary?: string[];
  tradingSpecialties?: string[];
  softwareCapabilities?: string[];
}

export interface PresentationSlide {
  id: string;
  slideNumber: number;
  title: string;
  subtitle?: string;
  category: 'cover' | 'profile' | 'trading' | 'experience' | 'achievements' | 'tech_office' | 'contact';
  bulletPoints: string[];
  badge?: string;
  highlightStat?: { number: string; label: string };
  calloutBox?: string;
  photoVisible?: boolean;
}

export interface ApplicationRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  recruiterEmail: string;
  appliedSalaryVnd: number;
  generatedSentence: string;
  fullEmailBody: string;
  appliedAt: string;
  status: 'Draft' | 'Sent_Via_Email' | 'Interviewing' | 'Accepted';
}

export interface FilterState {
  searchQuery: string;
  minSalary: number; // Min 10M
  maxSalary: number; // Max 50M
  userLocation: string; // text input or preset
  workMode: string; // All, On-site, Hybrid, Remote
  experienceLevel: string; // All, Junior, Middle, Senior, Lead
  roleCategory: string; // All or specific category
}

export interface CvImprovementSuggestion {
  id: string;
  category: 'missing_skill' | 'experience_depth' | 'quantifiable_impact' | 'salary_positioning' | 'profile_completeness';
  title: string;
  description: string;
  actionableSkill?: string;
  priority: 'high' | 'medium' | 'low';
  impactPercentage: number;
}

export interface CvStrengthReport {
  overallScore: number; // 0 - 100
  ratingLevel: 'Xuất sắc' | 'Khá mạnh' | 'Cần cải thiện' | 'Chưa hoàn thiện';
  bookmarkedJobCount: number;
  skillsCoverageScore: number; // 0 - 100
  experienceScore: number;
  salaryCompetitivenessScore: number;
  completenessScore: number;
  topMatchedSkills: string[];
  topMissingSkills: { skill: string; frequency: number }[];
  suggestions: CvImprovementSuggestion[];
  targetBookmarkedTitles: string[];
}


import { CandidateProfile, Job, CvStrengthReport, CvImprovementSuggestion } from '../types/job';
import { formatSalaryMillion } from './formatters';

// Common technical and business skills database for frequency matching
const FREQUENT_JOB_KEYWORDS: string[] = [
  'React', 'TypeScript', 'Node.js', 'Next.js', 'Tailwind CSS', 'Redux', 'Zustand',
  'Golang', 'Java', 'Python', 'SQL', 'PostgreSQL', 'MongoDB', 'Docker', 'Kubernetes',
  'AWS', 'CI/CD', 'GitOps', 'Terraform', 'Kafka', 'Redis', 'Microservices',
  'Figma', 'UI/UX', 'Design System', 'User Research', 'Prototyping',
  'Performance Marketing', 'Google Ads', 'Meta Ads', 'GA4', 'Mixpanel', 'AppsFlyer',
  'Data Analysis', 'PowerBI', 'Tableau', 'Pandas',
  'Automation Testing', 'Playwright', 'Cypress', 'Selenium', 'Unit Test',
  'B2B Sales', 'Lead Generation', 'Contract Negotiation'
];

function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9#+.]/gi, ' ').trim();
}

function skillMatches(candidateSkill: string, targetKeyword: string): boolean {
  const normCandidate = normalize(candidateSkill);
  const normTarget = normalize(targetKeyword);
  if (normCandidate === normTarget) return true;
  if (normCandidate.includes(normTarget) || normTarget.includes(normCandidate)) return true;
  return false;
}

/**
 * Scans candidate CV against bookmarked jobs requirements
 * and compiles a comprehensive CV Strength Report with actionable suggestions.
 */
export function analyzeCvStrength(
  profile: CandidateProfile,
  bookmarkedJobs: Job[],
  fallbackJobs: Job[] = []
): CvStrengthReport {
  const referenceJobs = bookmarkedJobs.length > 0 ? bookmarkedJobs : fallbackJobs.slice(0, 4);
  const isUsingBookmarks = bookmarkedJobs.length > 0;

  // 1. Completeness Score (0-100)
  let completenessScore = 0;
  if (profile.cvFileName) completenessScore += 35;
  if (profile.email && profile.phone) completenessScore += 25;
  if (profile.skills && profile.skills.length >= 3) completenessScore += 25;
  if (profile.portfolioUrl) completenessScore += 15;

  // 2. Aggregate Requirements from reference jobs
  const combinedJobText = referenceJobs
    .map(j => `${j.title} ${j.requirements.join(' ')} ${j.description.join(' ')}`)
    .join(' ');
  const normJobText = normalize(combinedJobText);

  // Extract skills requested across reference jobs
  const keywordFrequency: Record<string, number> = {};
  for (const job of referenceJobs) {
    const jobText = normalize(`${job.title} ${job.requirements.join(' ')} ${job.description.join(' ')}`);
    for (const kw of FREQUENT_JOB_KEYWORDS) {
      if (jobText.includes(normalize(kw))) {
        keywordFrequency[kw] = (keywordFrequency[kw] || 0) + 1;
      }
    }
  }

  // Identify Matched vs Missing Skills
  const candidateSkills = profile.skills || [];
  const topMatchedSkills: string[] = [];
  const missingSkillsList: { skill: string; frequency: number }[] = [];

  for (const [kw, freq] of Object.entries(keywordFrequency)) {
    const hasSkill = candidateSkills.some(cs => skillMatches(cs, kw));
    if (hasSkill) {
      if (!topMatchedSkills.includes(kw)) {
        topMatchedSkills.push(kw);
      }
    } else {
      missingSkillsList.push({ skill: kw, frequency: freq });
    }
  }

  // Sort missing skills by frequency in bookmarked jobs
  missingSkillsList.sort((a, b) => b.frequency - a.frequency);

  // Skills Coverage Score
  const totalRequestedUnique = Object.keys(keywordFrequency).length;
  const coverageRatio = totalRequestedUnique > 0
    ? Math.min(1, topMatchedSkills.length / Math.min(totalRequestedUnique, 6))
    : 0.6;
  const skillsCoverageScore = Math.round(coverageRatio * 100);

  // 3. Experience & Seniority Alignment
  let avgExpectedYears = 3;
  let totalExpScores = 0;
  for (const job of referenceJobs) {
    let reqMin = 2;
    if (job.experienceLevel === 'Fresher') reqMin = 0;
    else if (job.experienceLevel === 'Junior') reqMin = 1;
    else if (job.experienceLevel === 'Middle') reqMin = 3;
    else if (job.experienceLevel === 'Senior') reqMin = 4;
    else if (job.experienceLevel === 'Lead') reqMin = 6;

    const diff = profile.experienceYears - reqMin;
    if (diff >= 0) totalExpScores += 100;
    else if (diff === -1) totalExpScores += 80;
    else totalExpScores += 50;
  }
  const experienceScore = Math.round(totalExpScores / Math.max(1, referenceJobs.length));

  // 4. Salary Competitiveness Alignment
  let totalSalaryScore = 0;
  const candidateSalary = profile.targetSalaryVnd || 25000000;
  for (const job of referenceJobs) {
    if (candidateSalary >= job.minSalary && candidateSalary <= job.maxSalary) {
      totalSalaryScore += 100;
    } else if (candidateSalary < job.minSalary) {
      totalSalaryScore += 85; // highly competitive / budget friendly
    } else {
      const excess = candidateSalary - job.maxSalary;
      totalSalaryScore += Math.max(40, 100 - Math.round(excess / 2000000) * 10);
    }
  }
  const salaryCompetitivenessScore = Math.round(totalSalaryScore / Math.max(1, referenceJobs.length));

  // 5. Total Weighted Overall Score
  const overallScore = Math.round(
    skillsCoverageScore * 0.40 +
    experienceScore * 0.25 +
    completenessScore * 0.20 +
    salaryCompetitivenessScore * 0.15
  );

  let ratingLevel: CvStrengthReport['ratingLevel'] = 'Cần cải thiện';
  if (overallScore >= 85) ratingLevel = 'Xuất sắc';
  else if (overallScore >= 70) ratingLevel = 'Khá mạnh';
  else if (overallScore < 50) ratingLevel = 'Chưa hoàn thiện';

  // 6. Generate Actionable Suggestions
  const suggestions: CvImprovementSuggestion[] = [];

  // Suggestion 1: Missing Top Skills from Bookmarked Jobs
  if (missingSkillsList.length > 0) {
    const topMissing = missingSkillsList[0];
    suggestions.push({
      id: 'sug-skill-1',
      category: 'missing_skill',
      title: `Bổ sung kỹ năng "${topMissing.skill}"`,
      description: `Kỹ năng này xuất hiện trong ${topMissing.frequency}/${referenceJobs.length} việc làm bạn đã lưu nhưng chưa có trong danh sách kỹ năng CV. Thêm vào sẽ giúp tăng khả năng vượt qua vòng lọc hồ sơ.`,
      actionableSkill: topMissing.skill,
      priority: 'high',
      impactPercentage: 15,
    });
  }

  if (missingSkillsList.length > 1) {
    const secondMissing = missingSkillsList[1];
    suggestions.push({
      id: 'sug-skill-2',
      category: 'missing_skill',
      title: `Bổ sung kỹ năng "${secondMissing.skill}"`,
      description: `Được yêu cầu bởi các nhà tuyển dụng hàng đầu trong danh sách bạn quan tâm (${secondMissing.frequency} vị trí yêu cầu).`,
      actionableSkill: secondMissing.skill,
      priority: 'high',
      impactPercentage: 10,
    });
  }

  // Suggestion 2: Profile Completeness
  if (!profile.cvFileName) {
    suggestions.push({
      id: 'sug-cv-file',
      category: 'profile_completeness',
      title: 'Tải lên tập tin CV thực tế (PDF / DOCX)',
      description: 'Chưa có file CV nào được nạp vào thanh tải file. Hãy nạp file để gửi đính kèm trực tiếp cho HR.',
      priority: 'high',
      impactPercentage: 20,
    });
  }

  if (!profile.portfolioUrl) {
    suggestions.push({
      id: 'sug-portfolio',
      category: 'profile_completeness',
      title: 'Đính kèm liên kết Portfolio hoặc GitHub / LinkedIn',
      description: 'Nhà tuyển dụng kỹ thuật và sáng tạo ưu tiên 2x hồ sơ có liên kết sản phẩm thực tế, kho code hoặc showcase dự án.',
      priority: 'medium',
      impactPercentage: 10,
    });
  }

  // Suggestion 3: Quantifiable Impact
  suggestions.push({
    id: 'sug-quantifiable',
    category: 'quantifiable_impact',
    title: 'Bổ sung số liệu định lượng (Metrics & ROI) vào mô tả',
    description: 'Thay vì chỉ viết "phát triển tính năng web", hãy dùng công thức: [Hành động] + [Công nghệ] + [Kết quả số liệu cụ thể] (ví dụ: "Tối ưu React component giúp giảm 35% thời gian render và phục vụ 500k DAU").',
    priority: 'medium',
    impactPercentage: 12,
  });

  // Suggestion 4: Salary Positioning
  const avgMinSalary = Math.round(referenceJobs.reduce((acc, j) => acc + j.minSalary, 0) / referenceJobs.length);
  const avgMaxSalary = Math.round(referenceJobs.reduce((acc, j) => acc + j.maxSalary, 0) / referenceJobs.length);

  if (candidateSalary < avgMinSalary) {
    suggestions.push({
      id: 'sug-salary',
      category: 'salary_positioning',
      title: 'Có thể tự tin nâng mức lương kỳ vọng',
      description: `Mức lương kỳ vọng của bạn (${formatSalaryMillion(candidateSalary)}) đang thấp hơn mức sàn trung bình (${formatSalaryMillion(avgMinSalary)} - ${formatSalaryMillion(avgMaxSalary)}) của các vị trí bạn đã lưu.`,
      priority: 'low',
      impactPercentage: 8,
    });
  } else if (candidateSalary > avgMaxSalary) {
    suggestions.push({
      id: 'sug-salary',
      category: 'salary_positioning',
      title: 'Chuẩn bị luận điểm chứng minh năng lực tương xứng thu nhập',
      description: `Kỳ vọng ${formatSalaryMillion(candidateSalary)} của bạn chạm mức trần ngân sách (${formatSalaryMillion(avgMaxSalary)}). Hãy nêu bật các dự án lớn và impact nổi bật trong câu ứng tuyển gửi HR.`,
      priority: 'medium',
      impactPercentage: 8,
    });
  }

  return {
    overallScore,
    ratingLevel,
    bookmarkedJobCount: bookmarkedJobs.length,
    skillsCoverageScore,
    experienceScore,
    salaryCompetitivenessScore,
    completenessScore,
    topMatchedSkills: topMatchedSkills.slice(0, 6),
    topMissingSkills: missingSkillsList.slice(0, 6),
    suggestions,
    targetBookmarkedTitles: referenceJobs.map(j => `${j.title} (${j.company})`),
  };
}

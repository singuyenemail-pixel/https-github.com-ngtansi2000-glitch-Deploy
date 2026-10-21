import { CandidateProfile, Job } from '../types/job';

export interface MatchResult {
  totalScore: number; // 0 - 100
  level: 'exceptional' | 'strong' | 'moderate' | 'low';
  levelLabel: string;
  matchedSkills: string[];
  missingSkills: string[];
  skillScore: number;
  experienceScore: number;
  salaryScore: number;
  roleScore: number;
  summary: string;
  badgeClass: string;
}

// Synonyms and aliases map for technical and business domains
const SKILL_ALIASES: Record<string, string[]> = {
  react: ['reactjs', 'react.js', 'react native', 'nextjs', 'next.js', 'frontend'],
  typescript: ['ts', 'typescript', 'javascript', 'js'],
  javascript: ['js', 'es6', 'javascript', 'typescript'],
  nodejs: ['node.js', 'node', 'express', 'nestjs', 'backend'],
  'tailwind css': ['tailwind', 'tailwindcss', 'css3', 'css'],
  nextjs: ['next.js', 'nextjs', 'react'],
  python: ['pandas', 'numpy', 'django', 'fastapi', 'data analysis', 'ai'],
  sql: ['postgresql', 'mysql', 'database', 'sql queries', 'bi', 'queries'],
  golang: ['go', 'golang', 'microservices'],
  figma: ['ui/ux', 'product design', 'design system', 'prototyping', 'ux', 'ui'],
  'ui/ux': ['figma', 'product design', 'user research', 'ui designer', 'ux designer'],
  devops: ['docker', 'kubernetes', 'k8s', 'ci/cd', 'aws', 'cloud', 'terraform', 'linux'],
  kubernetes: ['k8s', 'docker', 'devops', 'helm'],
  marketing: ['performance marketing', 'growth marketing', 'seo', 'digital marketing', 'meta ads', 'google ads'],
  sales: ['b2b', 'b2b sales', 'kinh doanh', 'account executive', 'client development'],
  qa: ['automation test', 'automation testing', 'playwright', 'cypress', 'selenium', 'tester', 'qc'],
};

function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9#+.]/gi, ' ').trim();
}

function doesSkillMatchText(skill: string, text: string): boolean {
  const normSkill = normalize(skill);
  const normText = normalize(text);

  if (normText.includes(normSkill)) return true;

  // Check aliases
  for (const [key, aliases] of Object.entries(SKILL_ALIASES)) {
    const isTargetSkill = key === normSkill || aliases.some(a => normSkill.includes(a));
    if (isTargetSkill) {
      if (normText.includes(key) || aliases.some(a => normText.includes(a))) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Calculates a match score between a candidate profile and a job opening.
 * Evaluates:
 * 1. Skill overlap (50% weight)
 * 2. Experience level match (25% weight)
 * 3. Salary target alignment (15% weight)
 * 4. Role title relevance (10% weight)
 */
export function calculateJobMatchScore(candidate: CandidateProfile, job: Job): MatchResult {
  const jobFullText = [
    job.title,
    ...job.requirements,
    ...job.description,
    job.roleCategory,
  ].join(' ');

  // 1. Skill Matching
  const matchedSkills: string[] = [];
  const candidateSkills = candidate.skills || [];

  for (const skill of candidateSkills) {
    if (doesSkillMatchText(skill, jobFullText)) {
      matchedSkills.push(skill);
    }
  }

  // Extract key requirement keywords to determine missing skills
  const potentialMissing: string[] = [];
  const commonTech = [
    'React', 'TypeScript', 'Node.js', 'Golang', 'Python', 'SQL',
    'Figma', 'Kubernetes', 'Docker', 'AWS', 'Playwright', 'Performance Marketing'
  ];

  for (const tech of commonTech) {
    if (doesSkillMatchText(tech, jobFullText) && !matchedSkills.some(s => doesSkillMatchText(s, tech))) {
      potentialMissing.push(tech);
    }
  }

  const skillRatio = candidateSkills.length > 0
    ? Math.min(1, matchedSkills.length / Math.min(candidateSkills.length, 3))
    : 0.5;
  const skillScore = Math.round(skillRatio * 100);

  // 2. Experience Level Matching
  const candidateYears = candidate.experienceYears || 2;
  let expectedYearsMin = 1;
  let expectedYearsMax = 3;

  switch (job.experienceLevel) {
    case 'Fresher':
      expectedYearsMin = 0;
      expectedYearsMax = 1;
      break;
    case 'Junior':
      expectedYearsMin = 1;
      expectedYearsMax = 3;
      break;
    case 'Middle':
      expectedYearsMin = 2;
      expectedYearsMax = 5;
      break;
    case 'Senior':
      expectedYearsMin = 4;
      expectedYearsMax = 8;
      break;
    case 'Lead':
      expectedYearsMin = 5;
      expectedYearsMax = 12;
      break;
  }

  let expScore = 70;
  if (candidateYears >= expectedYearsMin && candidateYears <= expectedYearsMax) {
    expScore = 100;
  } else if (candidateYears < expectedYearsMin) {
    const diff = expectedYearsMin - candidateYears;
    expScore = Math.max(30, 100 - diff * 25);
  } else {
    // Slightly over-qualified
    expScore = 85;
  }

  // 3. Salary Target Alignment
  const targetSalary = candidate.targetSalaryVnd || 25000000;
  let salaryScore = 70;
  if (targetSalary >= job.minSalary && targetSalary <= job.maxSalary) {
    salaryScore = 100;
  } else if (targetSalary < job.minSalary) {
    // Candidate asks for less than minimum: advantageous for employer
    salaryScore = 90;
  } else {
    // Candidate asks for more than maxSalary
    const excess = targetSalary - job.maxSalary;
    const penalty = Math.min(60, Math.round((excess / 10000000) * 20));
    salaryScore = Math.max(40, 100 - penalty);
  }

  // 4. Role Title Keyword Relevance
  let roleScore = 60;
  const normTitle = normalize(job.title);
  const normCandidateTitle = normalize(candidate.currentTitle || '');
  if (normTitle.includes(normCandidateTitle) || normCandidateTitle.includes(normTitle)) {
    roleScore = 100;
  } else {
    const titleWords = normCandidateTitle.split(' ').filter(w => w.length > 2);
    const matches = titleWords.filter(w => normTitle.includes(w));
    if (matches.length > 0) {
      roleScore = 85;
    }
  }

  // Weighted Total
  const totalScore = Math.round(
    skillScore * 0.50 +
    expScore * 0.25 +
    salaryScore * 0.15 +
    roleScore * 0.10
  );

  // Grade level
  let level: MatchResult['level'] = 'moderate';
  let levelLabel = 'Tương Đối';
  let badgeClass = 'text-amber-800 bg-amber-50 border-amber-200';

  if (totalScore >= 85) {
    level = 'exceptional';
    levelLabel = 'Rất Phù Hợp';
    badgeClass = 'text-emerald-800 bg-emerald-50 border-emerald-300';
  } else if (totalScore >= 70) {
    level = 'strong';
    levelLabel = 'Phù Hợp Cao';
    badgeClass = 'text-sky-800 bg-sky-50 border-sky-300';
  } else if (totalScore < 50) {
    level = 'low';
    levelLabel = 'Cần Bổ Sung';
    badgeClass = 'text-slate-700 bg-slate-100 border-slate-300';
  }

  let summary = '';
  if (matchedSkills.length > 0) {
    summary = `Trùng khớp ${matchedSkills.length} kỹ năng chính (${matchedSkills.slice(0, 3).join(', ')}).`;
  } else {
    summary = `Kinh nghiệm ${candidateYears} năm phù hợp cấp bậc ${job.experienceLevel}.`;
  }

  return {
    totalScore,
    level,
    levelLabel,
    matchedSkills,
    missingSkills: potentialMissing.slice(0, 3),
    skillScore,
    experienceScore: expScore,
    salaryScore,
    roleScore,
    summary,
    badgeClass,
  };
}

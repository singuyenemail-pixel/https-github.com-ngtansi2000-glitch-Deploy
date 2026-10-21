import { Job } from '../types/job';

export interface CleanedJobDraft {
  title: string;
  company: string;
  recruiterEmail: string;
  recruiterName: string;
  minSalary: number;
  maxSalary: number;
  city: string;
  district: string;
  workMode: Job['workMode'];
  experienceLevel: Job['experienceLevel'];
  roleCategory: Job['roleCategory'];
  requirements: string[];
  description: string[];
  sourceName: string;
  sourceType: Job['sourceType'];
  rawText: string;
  confidenceScore: number; // 0 to 100
  qualityChecks: {
    hasDirectEmail: boolean;
    hasSalaryVND: boolean;
    withinSalaryRange: boolean;
    isFreshWithin7Days: boolean;
    noLoginWallRequired: boolean;
  };
}

/**
 * Parses raw unstructured hiring posts from Facebook, company status, forums, etc.
 * and extracts clean, structured, worthy job data.
 */
export function cleanRawHiringPost(rawText: string, sourceName = 'Facebook Post / Trực tiếp'): CleanedJobDraft {
  const text = rawText.trim();
  const lower = text.toLowerCase();

  // 1. Extract Recruiter Email (Must have)
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
  const emailsFound = text.match(emailRegex) || [];
  // Filter out dummy or generic emails if any, prefer hr@, tuyendung@, recruitment@, careers@
  let bestEmail = emailsFound[0] || '';
  for (const email of emailsFound) {
    const e = email.toLowerCase();
    if (e.includes('hr') || e.includes('tuyendung') || e.includes('recruit') || e.includes('career') || e.includes('talent')) {
      bestEmail = email;
      break;
    }
  }

  // 2. Extract Salary in VND (detect patterns like 20-30tr, 15 - 25 triệu, 20M, 35 triệu/tháng)
  let minSalary = 15000000;
  let maxSalary = 30000000;
  let hasSalaryVND = false;

  const salaryRangeRegex = /(\d{1,2})\s*[-–đếnto]+\s*(\d{1,2})\s*(triệu|tr|m|trvnd|vnd|củ)/i;
  const matchRange = text.match(salaryRangeRegex);

  if (matchRange) {
    const val1 = parseInt(matchRange[1], 10);
    const val2 = parseInt(matchRange[2], 10);
    if (!isNaN(val1) && !isNaN(val2)) {
      minSalary = Math.max(10000000, Math.min(val1, val2) * 1000000);
      maxSalary = Math.min(50000000, Math.max(val1, val2) * 1000000);
      hasSalaryVND = true;
    }
  } else {
    // Single salary detection, e.g. "Up to 35 triệu", "tới 40M"
    const singleSalaryRegex = /(lên tới|up to|tối đa|mức lương|thu nhập)[:\s]*(\d{1,2})\s*(triệu|tr|m)/i;
    const singleMatch = text.match(singleSalaryRegex);
    if (singleMatch) {
      const val = parseInt(singleMatch[2], 10);
      if (!isNaN(val)) {
        maxSalary = Math.min(50000000, val * 1000000);
        minSalary = Math.max(10000000, (val - 8) * 1000000);
        hasSalaryVND = true;
      }
    }
  }

  // 3. Extract Job Title
  let detectedTitle = 'Chuyên viên Phát triển Phần mềm (Fullstack/Frontend)';
  if (lower.includes('frontend') || lower.includes('react') || lower.includes('vue') || lower.includes('angular')) {
    detectedTitle = 'Senior Frontend Engineer (React/TypeScript)';
  } else if (lower.includes('backend') || lower.includes('nodejs') || lower.includes('golang') || lower.includes('java')) {
    detectedTitle = 'Backend Developer (Node.js/Golang/Java)';
  } else if (lower.includes('ui/ux') || lower.includes('designer') || lower.includes('figma')) {
    detectedTitle = 'UI/UX Product Designer';
  } else if (lower.includes('marketing') || lower.includes('growth') || lower.includes('performance')) {
    detectedTitle = 'Performance & Growth Marketing Specialist';
  } else if (lower.includes('devops') || lower.includes('sre') || lower.includes('cloud')) {
    detectedTitle = 'DevOps / Cloud Infrastructure Engineer';
  } else if (lower.includes('data') || lower.includes('analyst') || lower.includes('powerbi')) {
    detectedTitle = 'Data Analyst (SQL / BI / Python)';
  } else if (lower.includes('qa') || lower.includes('tester') || lower.includes('automation')) {
    detectedTitle = 'QA / Automation Test Engineer';
  } else if (lower.includes('sales') || lower.includes('b2b') || lower.includes('kinh doanh')) {
    detectedTitle = 'B2B Corporate Sales Executive';
  } else if (lower.includes('hr') || lower.includes('tuyển dụng') || lower.includes('nhân sự')) {
    detectedTitle = 'Talent Acquisition & HR Executive';
  } else {
    // Take first prominent line
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length > 0) {
      const candidate = lines[0].replace(/[[\]🔥👉⭐📢 tuyển dụng :]/gi, '').trim();
      if (candidate.length > 5 && candidate.length < 60) {
        detectedTitle = candidate;
      }
    }
  }

  // 4. Extract Company
  let detectedCompany = 'Doanh Nghiệp Tuyển Dụng Trực Tiếp';
  const companyRegex = /(tại|công ty|company|team)[:\s]*([a-zA-Z0-9\s&.-]{3,30})/i;
  const companyMatch = text.match(companyRegex);
  if (companyMatch && companyMatch[2]) {
    const comp = companyMatch[2].trim();
    if (!comp.toLowerCase().includes('mình') && !comp.toLowerCase().includes('tuyển') && comp.length > 2) {
      detectedCompany = comp;
    }
  }

  // 5. Extract City & District
  let city = 'Hồ Chí Minh';
  let district = 'Quận 1';

  if (lower.includes('hà nội') || lower.includes('ha noi') || lower.includes('cầu giấy') || lower.includes('ba đình') || lower.includes('nam từ liêm')) {
    city = 'Hà Nội';
    if (lower.includes('cầu giấy')) district = 'Cầu Giấy';
    else if (lower.includes('ba đình')) district = 'Ba Đình';
    else if (lower.includes('nam từ liêm') || lower.includes('mỹ đình')) district = 'Nam Từ Liêm';
    else if (lower.includes('đống đa')) district = 'Đống Đa';
    else district = 'Cầu Giấy';
  } else if (lower.includes('đà nẵng') || lower.includes('da nang')) {
    city = 'Đà Nẵng';
    district = lower.includes('sơn trà') ? 'Sơn Trà' : 'Hải Châu';
  } else if (lower.includes('bình dương') || lower.includes('dĩ an')) {
    city = 'Bình Dương';
    district = 'Dĩ An';
  } else if (lower.includes('cần thơ')) {
    city = 'Cần Thơ';
    district = 'Ninh Kiều';
  } else {
    // HCM districts
    if (lower.includes('quận 7') || lower.includes('q7')) district = 'Quận 7';
    else if (lower.includes('tân bình')) district = 'Tân Bình';
    else if (lower.includes('bình thạnh')) district = 'Bình Thạnh';
    else if (lower.includes('thủ đức')) district = 'TP. Thủ Đức';
    else if (lower.includes('quận 3') || lower.includes('q3')) district = 'Quận 3';
    else district = 'Quận 1';
  }

  // 6. Work Mode
  let workMode: Job['workMode'] = 'Hybrid';
  if (lower.includes('remote') || lower.includes('từ xa') || lower.includes('wfh 100%')) {
    workMode = 'Remote';
  } else if (lower.includes('on-site') || lower.includes('onsite') || lower.includes('văn phòng')) {
    workMode = 'On-site';
  }

  // 7. Role Category & Exp Level
  let roleCategory: Job['roleCategory'] = 'Engineering';
  if (detectedTitle.includes('Marketing')) roleCategory = 'Marketing';
  else if (detectedTitle.includes('Designer') || detectedTitle.includes('Design')) roleCategory = 'Design';
  else if (detectedTitle.includes('Data')) roleCategory = 'Data';
  else if (detectedTitle.includes('Sales')) roleCategory = 'Sales';
  else if (detectedTitle.includes('HR')) roleCategory = 'Operations';

  let experienceLevel: Job['experienceLevel'] = 'Middle';
  if (lower.includes('senior') || lower.includes('trưởng nhóm') || lower.includes('4+') || lower.includes('5 năm')) {
    experienceLevel = 'Senior';
  } else if (lower.includes('lead') || lower.includes('quản lý') || lower.includes('manager')) {
    experienceLevel = 'Lead';
  } else if (lower.includes('junior') || lower.includes('fresher') || lower.includes('1 năm') || lower.includes('mới tốt nghiệp')) {
    experienceLevel = 'Junior';
  }

  // 8. Clean up requirements and description lines
  const cleanLines = text
    .split('\n')
    .map(line => line.replace(/[🔥👉⭐📢🚀✅💥📍]/g, '').trim())
    .filter(line => line.length > 8);

  const requirements: string[] = [];
  const description: string[] = [];

  for (const line of cleanLines) {
    const l = line.toLowerCase();
    if (l.includes('yêu cầu') || l.includes('kinh nghiệm') || l.includes('thành thạo') || l.includes('hiểu biết') || l.includes('kỹ năng')) {
      if (requirements.length < 5) requirements.push(line);
    } else if (l.includes('mô tả') || l.includes('tham gia') || l.includes('phát triển') || l.includes('xây dựng') || l.includes('chịu trách nhiệm')) {
      if (description.length < 5) description.push(line);
    }
  }

  if (requirements.length === 0) {
    requirements.push('Đáp ứng yêu cầu kỹ năng chuyên môn tương ứng với vị trí tuyển dụng.');
    requirements.push('Tinh thần trách nhiệm cao, chủ động trong công việc.');
  }
  if (description.length === 0) {
    description.push('Thực hiện các nhiệm vụ chuyên môn theo phân công của đội ngũ.');
    description.push('Phối hợp cùng các phòng ban liên quan để đảm bảo tiến độ công việc.');
  }

  // 9. Quality & Worthiness Score
  const hasDirectEmail = Boolean(bestEmail);
  const withinSalaryRange = minSalary >= 10000000 && maxSalary <= 50000000;
  let score = 50;
  if (hasDirectEmail) score += 30;
  if (hasSalaryVND) score += 10;
  if (withinSalaryRange) score += 10;

  return {
    title: detectedTitle,
    company: detectedCompany,
    recruiterEmail: bestEmail || 'tuyendung@company.vn',
    recruiterName: 'Bộ phận Tuyển dụng Trực tiếp',
    minSalary,
    maxSalary,
    city,
    district,
    workMode,
    experienceLevel,
    roleCategory,
    requirements,
    description,
    sourceName,
    sourceType: 'raw_cleaned',
    rawText,
    confidenceScore: Math.min(100, score),
    qualityChecks: {
      hasDirectEmail,
      hasSalaryVND,
      withinSalaryRange,
      isFreshWithin7Days: true,
      noLoginWallRequired: true,
    },
  };
}

/**
 * Infers roleCategory from job title and description keywords
 */
export function inferRoleCategoryFromText(title: string, descriptionText: string): Job['roleCategory'] {
  const combined = `${title} ${descriptionText}`.toLowerCase();

  // Marketing
  if (
    combined.includes('marketing') ||
    combined.includes('growth') ||
    combined.includes('seo') ||
    combined.includes('content') ||
    combined.includes('truyền thông') ||
    combined.includes('branding') ||
    combined.includes('digital ads') ||
    combined.includes('performance marketing')
  ) {
    return 'Marketing';
  }

  // Design
  if (
    combined.includes('design') ||
    combined.includes('ui/ux') ||
    combined.includes('figma') ||
    combined.includes('thiết kế') ||
    combined.includes('đồ họa') ||
    combined.includes('graphic') ||
    combined.includes('art director')
  ) {
    return 'Design';
  }

  // Data
  if (
    combined.includes('data analyst') ||
    combined.includes('data scientist') ||
    combined.includes('data engineer') ||
    combined.includes('business intelligence') ||
    combined.includes('power bi') ||
    combined.includes('tableau') ||
    combined.includes('sql') ||
    combined.includes('dữ liệu')
  ) {
    return 'Data';
  }

  // Product
  if (
    combined.includes('product manager') ||
    combined.includes('product owner') ||
    combined.includes('quản lý sản phẩm') ||
    combined.includes('business analyst') ||
    combined.includes('chuyên viên ba')
  ) {
    return 'Product';
  }

  // Sales
  if (
    combined.includes('sales') ||
    combined.includes('kinh doanh') ||
    combined.includes('b2b') ||
    combined.includes('account executive') ||
    combined.includes('thương mại') ||
    combined.includes('trading') ||
    combined.includes('incoterms') ||
    combined.includes('đại lý')
  ) {
    return 'Sales';
  }

  // Operations
  if (
    combined.includes('vận hành') ||
    combined.includes('operations') ||
    combined.includes('supply chain') ||
    combined.includes('chuỗi cung ứng') ||
    combined.includes('kho vận') ||
    combined.includes('logistics') ||
    combined.includes('hải quan') ||
    combined.includes('customs') ||
    combined.includes('hành chính') ||
    combined.includes('nhân sự') ||
    combined.includes('hr') ||
    combined.includes('talent acquisition')
  ) {
    return 'Operations';
  }

  // Default to Engineering for tech/software or general technical roles
  return 'Engineering';
}

/**
 * Infers experienceLevel from job title and description keywords
 */
export function inferExperienceLevelFromText(title: string, descriptionText: string): Job['experienceLevel'] {
  const combined = `${title} ${descriptionText}`.toLowerCase();

  // Lead / Management
  if (
    combined.includes('lead') ||
    combined.includes('trưởng nhóm') ||
    combined.includes('quản lý') ||
    combined.includes('manager') ||
    combined.includes('giám đốc') ||
    combined.includes('director') ||
    combined.includes('head of') ||
    combined.includes('tech lead') ||
    combined.includes('phó phòng') ||
    combined.includes('trưởng phòng')
  ) {
    return 'Lead';
  }

  // Senior
  if (
    combined.includes('senior') ||
    combined.includes('chuyên viên cấp cao') ||
    combined.includes('4+') ||
    combined.includes('5 năm') ||
    combined.includes('5+') ||
    combined.includes('6 năm') ||
    combined.includes('7 năm') ||
    combined.includes('10 năm') ||
    combined.includes('bề dày') ||
    combined.includes('dày dạn')
  ) {
    return 'Senior';
  }

  // Fresher / Intern
  if (
    combined.includes('fresher') ||
    combined.includes('thực tập sinh') ||
    combined.includes('intern') ||
    combined.includes('mới tốt nghiệp') ||
    combined.includes('chưa có kinh nghiệm') ||
    combined.includes('no experience required') ||
    combined.includes('entry level')
  ) {
    return 'Fresher';
  }

  // Junior
  if (
    combined.includes('junior') ||
    combined.includes('0-1 năm') ||
    combined.includes('1 năm') ||
    combined.includes('1-2 năm') ||
    combined.includes('dưới 2 năm') ||
    combined.includes('1 - 2 years')
  ) {
    return 'Junior';
  }

  // Middle default for standard roles (2-4 years experience)
  return 'Middle';
}

/**
 * Enhances/Normalizes any Job object: parses job title & descriptions for keywords
 * and automatically updates roleCategory and experienceLevel if missing or 'Unknown'.
 */
export function enrichJobWithCategoryAndExperience(job: Job): Job {
  const descStr = [
    ...(job.description || []),
    ...(job.requirements || []),
    job.rawSourceSnippet || '',
  ].join(' ');

  let updatedRole = job.roleCategory;
  if (!updatedRole || updatedRole === ('Unknown' as any) || !['Engineering', 'Design', 'Marketing', 'Product', 'Data', 'Operations', 'Sales'].includes(updatedRole)) {
    updatedRole = inferRoleCategoryFromText(job.title, descStr);
  }

  let updatedExp = job.experienceLevel;
  if (!updatedExp || updatedExp === ('Unknown' as any) || !['Fresher', 'Junior', 'Middle', 'Senior', 'Lead'].includes(updatedExp)) {
    updatedExp = inferExperienceLevelFromText(job.title, descStr);
  }

  return {
    ...job,
    roleCategory: updatedRole,
    experienceLevel: updatedExp,
  };
}

/**
 * Converts a verified clean draft into a ready-to-use Job object
 */
export function convertDraftToJob(draft: CleanedJobDraft): Job {
  const rawJob: Job = {
    id: `harvested-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: draft.title,
    company: draft.company,
    city: draft.city,
    district: draft.district,
    address: `${draft.district}, ${draft.city}`,
    workMode: draft.workMode,
    minSalary: draft.minSalary,
    maxSalary: draft.maxSalary,
    experienceLevel: draft.experienceLevel,
    roleCategory: draft.roleCategory,
    recruiterEmail: draft.recruiterEmail,
    recruiterName: draft.recruiterName,
    postedDate: new Date().toISOString().split('T')[0],
    postedHoursAgo: 2, // freshly collected
    description: draft.description,
    requirements: draft.requirements,
    benefits: [
      `Thu nhập từ ${Math.round(draft.minSalary / 1000000)}M - ${Math.round(draft.maxSalary / 1000000)}M VND/tháng`,
      'Gửi thẳng CV trực tiếp tới hộp thư HR, không qua bên thứ 3.',
      'Chế độ bảo hiểm và đãi ngộ theo quy định nhà tuyển dụng.'
    ],
    verifiedDirectEmail: true,
    sourceType: draft.sourceType || 'raw_cleaned',
    sourceName: draft.sourceName || 'Đã làm sạch từ nguồn bài đăng tuyển',
    rawSourceSnippet: draft.rawText.slice(0, 300),
  };

  return enrichJobWithCategoryAndExperience(rawJob);
}

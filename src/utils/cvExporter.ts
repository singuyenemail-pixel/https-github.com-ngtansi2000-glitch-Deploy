import { CandidateProfile } from '../types/job';
import { formatSalaryMillion } from './formatters';

/**
 * Generates an executive English version CV ready for international recruiters.
 */
export function generateEnglishCvContent(profile: CandidateProfile): string {
  const name = profile.englishName || profile.fullName || 'SIMON NGUYEN (NGUYEN TAN SI)';
  const title = profile.currentTitle || 'Domestic & International Trade & Projects';
  const phone = profile.phone || 'Zalo/Whatsapp 0702499445';
  const email = profile.email || 'singuyenemail@gmail.com';
  const dob = profile.dateOfBirth || '1970-08-10';
  const idNum = profile.citizenId || '089071000050';
  const expYears = profile.experienceYears || 30;
  const salaryM = profile.targetSalaryVnd ? `${formatSalaryMillion(profile.targetSalaryVnd)}/month (From 15M up)` : 'From 15 Million VND / Month up';
  const skills = profile.skills.length > 0
    ? profile.skills.join(', ')
    : 'International Trade, Incoterms, Contract Negotiation, Cross-Border Logistics, Project Management';

  let content = `================================================================================
                         CURRICULUM VITAE (ENGLISH VERSION)
================================================================================

1. PERSONAL INFORMATION
--------------------------------------------------------------------------------
- Full Name: ${name}
- Professional Title: ${title}
- Total Hands-on Experience: ${expYears}+ Years
- Date of Birth: ${dob}
- Citizen / ID Number: ${idNum}
- Direct Phone: ${phone}
- Official Email: ${email}
- Primary Location: Ho Chi Minh City & Lam Dong, Vietnam (Open to Global Travel)
- Target Compensation: ${salaryM}

2. EXECUTIVE SUMMARY & VALUE PROPOSITION
--------------------------------------------------------------------------------
A seasoned international executive with over 30 years of hands-on leadership spanning
Foreign Direct Investment (FDI) projects, Cross-Border Trade, Turnkey Industrial Manufacturing,
and EPC Infrastructure across Taiwan, the United States, South Korea, Cambodia, and Vietnam.

Key Strengths:
* 20+ years of fluent business English communication, directly drafting, reviewing,
  and executing high-value commercial agreements without intermediaries.
* Master of Incoterms, shipping logistics, and international trade finance (L/C, T/T, Bank Guarantees).
* Strong leadership in cross-functional governance, linking international buyers with local suppliers.
* Modern technology adopter: advanced AI Prompting (Gemini 3.8 Flash), Office automation, and AutoCAD.

3. CORE COMPETENCIES & TECHNICAL PROFICIENCY
--------------------------------------------------------------------------------
- Core Competencies: ${skills}
- Languages: Fluent Business English (20+ years executive working proficiency), Native Vietnamese, Conversational Mandarin Chinese.
- Technical & Software: AI Workflows (Gemini, Automation), Microsoft 365 (PowerPoint, Excel Financials, Word), AutoCAD, PC Hardware & Network Systems.

4. CAREER MILESTONES & LEADERSHIP HISTORY
--------------------------------------------------------------------------------
`;

  if (profile.careerMilestones && profile.careerMilestones.length > 0) {
    profile.careerMilestones.forEach((m, idx) => {
      content += `
[${idx + 1}] PERIOD: ${m.period}
- Organization: ${m.company}
- Executive Role: ${m.role}
- Location: ${m.location}
- Industry / Sector: ${m.category || 'Executive Management & Global Trade'}
- Scope of Responsibilities: ${m.description}
- Key Signature Achievements:
  ${m.achievements && m.achievements.length > 0 ? m.achievements.map((a) => `* ${a}`).join('\n  ') : '* Successfully executed assigned revenue and operational targets'}
`;
    });
  } else {
    content += `
- 2018 - 2025: AN NGOC DA LAT CO., LTD. — General Project Manager
  * Led high-tech agricultural processing and energy-efficient dehydration plant projects.
- 2016 - 2018: HAPPY FARM CO., LTD. (Korean Conglomerate with 36 VN Plants) — Factory Director
  * Directed IQF cold storage operations and raw material processing supplying CJ Foods.
- 2006 - 2016: SUNSPAN CO., LTD. (Korea Kungan Group) — EPC Turnkey Project Director
  * Delivered turnkey architectural construction for Long Phu Power Plant (featured on VTC National TV); Exclusive agent for Evertop Cables generating multi-billion VND monthly revenue.
- 1997 - 2003: TECHPIE PROGRAM PTE (USA) — Technical Lead Manager
  * Supervised 6-12 software engineers building enterprise applications for US clients.
- 1992 - 2005: KEENNESS INDUSTRIAL CO., LTD. (Taiwan) — Full Authority Legal Representative
  * Managed regional representative branches across Taiwan, Cambodia, and Vietnam.
`;
  }

  return content;
}

/**
 * Generates bilingual / Vietnamese CV content.
 */
export function generateBilingualCvContent(profile: CandidateProfile): string {
  const name = profile.fullName || 'SIMON NGUYEN (NGUYỄN TẤN SĨ)';
  const enName = profile.englishName || 'Simon Nguyen';
  const vnName = profile.vietnameseName || 'Nguyễn Tấn Sĩ';
  const title = profile.currentTitle || 'Thương Mại Quốc Nội , Quốc Tế & Dự Án';
  const phone = profile.phone || 'Zalo/Whatsapp 0702499445';
  const email = profile.email || 'singuyenemail@gmail.com';
  const dob = profile.dateOfBirth || '1970-08-10';
  const idNum = profile.citizenId || '052070002130';
  const expYears = profile.experienceYears || 30;
  const salaryM = profile.targetSalaryVnd ? `${formatSalaryMillion(profile.targetSalaryVnd)}/tháng (Từ 15M trở lên)` : 'Từ 15 triệu VND/tháng trở lên';
  const skills = profile.skills.length > 0 ? profile.skills.join(', ') : 'Quản lý thương mại, Incoterms, Đàm phán quốc tế';

  let content = `================================================================================
                    CURRICULUM VITAE / HỒ SƠ ỨNG VIÊN
================================================================================

1. THÔNG TIN CÁ NHÂN (PERSONAL INFORMATION)
--------------------------------------------------------------------------------
- Họ và tên (Full Name): ${name}
- Tên tiếng Anh (English Name): ${enName}
- Tên tiếng Việt (Vietnamese Name): ${vnName}
- Vị trí chuyên môn hiện tại: ${title}
- Số năm kinh nghiệm: ${expYears}+ năm
- Ngày sinh (Date of Birth): ${dob}
- Số CCCD/ID: ${idNum}
- Số điện thoại (Phone): ${phone}
- Email liên hệ: ${email}
- Địa chỉ/Khu vực: TP. Hồ Chí Minh & Lâm Đồng, Việt Nam
- Mức thu nhập kỳ vọng: ${salaryM}

2. MỤC TIÊU NGHỀ NGHIỆP & TUYÊN NGÔN GIÁ TRỊ (EXECUTIVE OBJECTIVES)
--------------------------------------------------------------------------------
Sở hữu hơn 30 năm kinh nghiệm thực chiến trong lĩnh vực Quản lý Dự án, Thương mại Quốc tế,
Xúc tiến Đầu tư Nước ngoài (FDI) và Quản trị Nhà máy Công nghiệp tại Đài Loan, Campuchia và Việt Nam.
Thành thạo đàm phán hợp đồng thương mại song ngữ Anh - Việt, quản trị hợp đồng xuất nhập khẩu,
quy tắc Incoterms và thanh toán quốc tế (L/C, T/T).

3. KỸ NĂNG CHUYÊN MÔN & CÔNG NGHỆ (CORE SKILLS & TECH STACK)
--------------------------------------------------------------------------------
- Kỹ năng cốt lõi: ${skills}
- Ngoại ngữ: Tiếng Anh lưu loát (Bilingual Business Working Proficiency), Tiếng Việt bản ngữ, Tiếng Hoa giao tiếp.
- Công nghệ & Kỹ thuật: AI Prompting, Microsoft Office (PowerPoint, Excel, Word), AutoCAD, Quản trị mạng & Phần cứng PC.

4. QUÁ TRÌNH CÔNG TÁC & THÀNH TỰU TIÊU BIỂU (CAREER MILESTONES)
--------------------------------------------------------------------------------
`;

  if (profile.careerMilestones && profile.careerMilestones.length > 0) {
    profile.careerMilestones.forEach((m, idx) => {
      content += `
[${idx + 1}] GIAI ĐOẠN: ${m.period}
- Đơn vị: ${m.company}
- Vị trí: ${m.role}
- Địa điểm: ${m.location}
- Lĩnh vực: ${m.category || 'Quản lý & Thương mại'}
- Mô tả công việc: ${m.description}
- Thành tựu tiêu biểu:
  ${m.achievements && m.achievements.length > 0 ? m.achievements.map((a) => `* ${a}`).join('\n  ') : '* Hoàn thành xuất sắc chỉ tiêu được giao'}
`;
    });
  } else {
    content += `
- 2018 - 2025: AN NGOC DA LAT Co., LTD. — General Project Manager
  * Phụ trách xúc tiến dự án nông nghiệp công nghệ cao và hợp tác xuất nhập khẩu quốc tế.
- 2014 - 2017: MINH DUONG FOOD CO., LTD. — Import-Export & Project Director
  * Điều hành toàn bộ chuỗi cung ứng xuất nhập khẩu nông sản sang các thị trường quốc tế.
- 2006 - 2013: DONG NAI PLASTIC & INDUSTRIAL JV — Sales & Commercial Director
  * Đàm phán trực tiếp các hợp đồng cung ứng vật liệu xây dựng và nhựa kỹ thuật cao.
- 1992 - 2005: KEENNESS INDUSTRIAL CO., LTD. — Manager / Full Authority Director
  * Điều phối mạng lưới văn phòng đại diện tại Đài Loan, Campuchia và Việt Nam.
`;
  }

  return content;
}

export function generateCvContent(profile: CandidateProfile, language: 'en' | 'vi' = 'en'): string {
  return language === 'en' ? generateEnglishCvContent(profile) : generateBilingualCvContent(profile);
}

export function downloadCvToPc(
  profile: CandidateProfile,
  filenamePrefix: string = 'CV',
  language: 'en' | 'vi' = 'en'
) {
  const content = generateCvContent(profile, language);
  const safeName = (profile.fullName || 'Candidate')
    .replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF]/g, '_')
    .replace(/_+/g, '_');

  const langTag = language === 'en' ? 'English_Version' : 'Bilingual';
  const filename = `${filenamePrefix}_${langTag}_${safeName}_${new Date().toISOString().slice(0, 10)}.txt`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads the exact original file uploaded by the user without modifying any bytes or content.
 */
export function downloadOriginalUploadedFile(profile: CandidateProfile): boolean {
  if (profile.originalFileDataUrl) {
    const a = document.createElement('a');
    a.href = profile.originalFileDataUrl;
    a.download = profile.originalFileName || profile.cvFileName || 'Original_CV_Document.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return true;
  }

  // If no raw data url stored, fall back to downloading structured plain text CV
  downloadCvToPc(profile);
  return false;
}


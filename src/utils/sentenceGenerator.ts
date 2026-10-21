import { CandidateProfile, Job } from '../types/job';

export type PitchTone = 'direct_confident' | 'value_driven' | 'concise_impact' | 'formal_polite' | 'english_international';

export interface GeneratedPitch {
  shortSentence: string;
  emailSubject: string;
  fullEmailBody: string;
  mailtoUrl: string;
  gmailComposeUrl: string;
}

export function generateShortPitchSentence(
  candidate: CandidateProfile,
  job: Job,
  tone: PitchTone = 'direct_confident',
  targetSalaryVnd?: number
): string {
  const salaryM = Math.round((targetSalaryVnd || candidate.targetSalaryVnd || job.minSalary) / 1_000_000);
  const years = candidate.experienceYears || 3;
  const skillsList = candidate.skills.length > 0 
    ? candidate.skills.slice(0, 3).join(', ') 
    : 'kỹ năng chuyên môn';
  const candidateName = candidate.fullName || 'Ứng viên';
  const recruiter = job.recruiterName ? job.recruiterName : `Bộ phận Tuyển dụng ${job.company}`;

  switch (tone) {
    case 'direct_confident':
      return `Kính gửi ${recruiter}, tôi (${candidateName}) xin gửi kèm CV ứng tuyển vị trí ${job.title} tại ${job.company} với ${years} năm kinh nghiệm chuyên sâu về ${skillsList}, hoàn toàn phù hợp với định hướng mức thu nhập ${salaryM} triệu VND/tháng theo ngân sách của quý công ty.`;

    case 'value_driven':
      return `Kính gửi ${recruiter}, với nền tảng vững chắc trong mảng ${skillsList} cùng ${years} năm kinh nghiệm thực chiến, tôi xin gửi hồ sơ ứng tuyển ${job.title} với mong muốn đóng góp giá trị tức thì cho ${job.company}, tương thích với mức đãi ngộ ${salaryM} triệu VND/tháng.`;

    case 'concise_impact':
      return `Gửi ${recruiter}: Tôi gửi kèm CV ứng tuyển vị trí ${job.title}; sở hữu ${years} năm kinh nghiệm mảng ${skillsList}, tôi tự tin đáp ứng trọn vẹn yêu cầu công việc với mức lương mục tiêu ${salaryM} triệu VND/tháng.`;

    case 'formal_polite':
      return `Kính gửi anh/chị phụ trách tuyển dụng tại ${job.company}, tôi xin phép gửi hồ sơ CV ứng tuyển cho vị trí ${job.title}. Với ${years} năm kinh nghiệm phù hợp với các tiêu chí của công ty, tôi rất mong có cơ hội trao đổi trực tiếp và thảo luận về mức thu nhập ${salaryM} triệu VND/tháng.`;

    case 'english_international':
      return `Dear ${job.company} Hiring Team, please find attached my CV for the ${job.title} position; with over ${years} years of hands-on expertise in ${skillsList}, I am excited to contribute to your goals aligned with your ${salaryM}M VND monthly compensation target.`;

    default:
      return `Kính gửi ${recruiter}, tôi xin gửi kèm CV ứng tuyển vị trí ${job.title} tại ${job.company} với ${years} năm kinh nghiệm về ${skillsList}, mức lương mục tiêu ${salaryM} triệu VND/tháng.`;
  }
}

export function buildCompleteApplicationPitch(
  candidate: CandidateProfile,
  job: Job,
  tone: PitchTone = 'direct_confident',
  customSentence?: string,
  targetSalaryVnd?: number
): GeneratedPitch {
  const shortSentence = customSentence || generateShortPitchSentence(candidate, job, tone, targetSalaryVnd);
  const salaryM = Math.round((targetSalaryVnd || candidate.targetSalaryVnd || job.minSalary) / 1_000_000);
  const cvRef = candidate.cvFileName ? `[File đính kèm: ${candidate.cvFileName}]` : `[CV đính kèm]`;
  const candidateName = candidate.fullName || 'Ứng viên';

  const isEn = tone === 'english_international';
  
  const emailSubject = isEn
    ? `[Job Application] ${job.title} - ${candidateName} - CV Attached`
    : `[Ứng tuyển] ${job.title} - ${candidateName} - Kèm CV`;

  const bodyGreeting = isEn 
    ? `Dear ${job.recruiterName || 'Hiring Team'},`
    : `Kính gửi ${job.recruiterName || 'Bộ phận Tuyển dụng ' + job.company},`;

  const bodyClosing = isEn
    ? `Thank you for your time and consideration. Looking forward to your response.\n\nBest regards,\n${candidateName}\nPhone: ${candidate.phone || 'N/A'}\nEmail: ${candidate.email || 'N/A'}${candidate.portfolioUrl ? `\nPortfolio: ${candidate.portfolioUrl}` : ''}`
    : `Tôi đã đính kèm hồ sơ CV chi tiết ${cvRef} cùng email này để anh/chị tiện tra cứu.\n\nRất mong nhận được phản hồi và có cơ hội trao đổi sâu hơn trong buổi phỏng vấn.\n\nTrân trọng,\n${candidateName}\nSĐT: ${candidate.phone || 'N/A'}\nEmail: ${candidate.email || 'N/A'}${candidate.portfolioUrl ? `\nPortfolio: ${candidate.portfolioUrl}` : ''}`;

  const fullEmailBody = `${bodyGreeting}\n\n${shortSentence}\n\n${bodyClosing}`;

  const mailtoUrl = `mailto:${encodeURIComponent(job.recruiterEmail)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(fullEmailBody)}`;

  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(job.recruiterEmail)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(fullEmailBody)}`;

  return {
    shortSentence,
    emailSubject,
    fullEmailBody,
    mailtoUrl,
    gmailComposeUrl,
  };
}

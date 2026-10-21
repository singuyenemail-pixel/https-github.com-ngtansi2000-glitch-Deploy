export type EmailTemplateRoleCategory =
  | 'Executive'
  | 'Tech Developer'
  | 'Sales Commercial'
  | 'General'
  | 'Custom';

export interface EmailTemplate {
  id: string;
  name: string;
  roleCategory: EmailTemplateRoleCategory;
  subject: string;
  body: string;
  isDefault?: boolean;
  updatedAt: string;
  description?: string;
  language?: 'en' | 'vi';
}

export interface TemplateInterpolationContext {
  company: string;
  role: string;
  salary: string;
  candidate_name: string;
  phone: string;
  email: string;
  experience_years?: number | string;
  current_title?: string;
  skills?: string;
  recruiter_name?: string;
}

export const TEMPLATE_VARIABLES = [
  { key: '{{company}}', label: 'Tên Công Ty / Company', example: 'FPT Software' },
  { key: '{{role}}', label: 'Vị Trí / Role Title', example: 'Technical Director' },
  { key: '{{salary}}', label: 'Mức Lương / Target Salary', example: '45,000,000 VND/tháng' },
  { key: '{{candidate_name}}', label: 'Tên Ứng Viên / Candidate', example: 'SIMON NGUYEN' },
  { key: '{{phone}}', label: 'Số Điện Thoại / Phone', example: 'Zalo/Whatsapp 0702499445' },
  { key: '{{email}}', label: 'Email', example: 'singuyenemail@gmail.com' },
  { key: '{{current_title}}', label: 'Chức Danh Hiện Tại', example: 'Senior Director' },
  { key: '{{skills}}', label: 'Kỹ Năng Trọng Tâm', example: 'International Trading & AI' },
  { key: '{{recruiter_name}}', label: 'Người Tuyển Dụng', example: 'Ban Tuyển Dụng' },
] as const;

/**
 * Replaces placeholders like {{company}}, {{role}}, {{salary}}, etc. with context values.
 */
export function interpolateEmailText(
  text: string,
  context: TemplateInterpolationContext
): string {
  if (!text) return '';

  return text
    .replace(/\{\{company\}\}/gi, context.company || '[Công Ty]')
    .replace(/\{\{role\}\}/gi, context.role || '[Vị Trí Tuyển Dụng]')
    .replace(/\{\{salary\}\}/gi, context.salary || '[Mức Lương Kỳ Vọng]')
    .replace(/\{\{candidate_name\}\}/gi, context.candidate_name || '[Tên Ứng Viên]')
    .replace(/\{\{phone\}\}/gi, context.phone || 'Zalo/Whatsapp 0702499445')
    .replace(/\{\{email\}\}/gi, context.email || 'singuyenemail@gmail.com')
    .replace(/\{\{current_title\}\}/gi, context.current_title || 'Chuyên Gia Cấp Cao')
    .replace(/\{\{skills\}\}/gi, context.skills || 'Kỹ năng chuyên môn')
    .replace(/\{\{recruiter_name\}\}/gi, context.recruiter_name || 'Ban Tuyển Dụng');
}

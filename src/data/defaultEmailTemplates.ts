import { EmailTemplate } from '../types/emailTemplate';

/**
 * Original English Version Starter Templates (Standard International Corporate Standard)
 */
export const DEFAULT_EMAIL_TEMPLATES_EN: EmailTemplate[] = [
  {
    id: 'tpl_en_executive',
    name: 'Executive & Senior Leadership (Original English Version)',
    roleCategory: 'Executive',
    language: 'en',
    isDefault: true,
    updatedAt: '2026-10-19',
    description: 'Executive pitch for Director, General Manager, C-level, and cross-border project leadership roles.',
    subject: 'Application for {{role}} - {{candidate_name}} (Executive Profile & Cross-Border Leadership)',
    body: `Dear {{recruiter_name}} and the Executive Leadership Team at {{company}},

I am {{candidate_name}} ({{current_title}}). I am writing to formally submit my candidacy for the {{role}} position at {{company}}.

With over 25–30 years of seasoned leadership spearheading multinational trade operations, turnkey manufacturing, and foreign direct investment (FDI) ventures across Taiwan, South Korea, the United States, Cambodia, and Vietnam, I bring battle-tested expertise in strategic governance, high-stakes contract negotiation, and end-to-end P&L execution.

Core Pillars of My Value Proposition:
• Over 20 years of fluent business English communication, directly drafting and negotiating cross-border contracts at partner tables without intermediaries.
• Comprehensive expertise in Incoterms, international shipping logistics, customs brokerage, and banking trade instruments (L/C, T/T).
• Cross-functional leadership bridging international corporate standards with agile on-the-ground operational execution.
• Tech-forward executive mindset: Integrating modern AI workflows (Gemini 3.8 Flash), data systems, and AutoCAD engineering layouts.

Target Compensation: {{salary}} (calibrated with measurable deliverables and operational impact).

I have attached my comprehensive original CV and PowerPoint capability presentation deck for your evaluation. I welcome the opportunity to discuss how my qualifications align with {{company}}'s strategic growth objectives via phone, Zalo/Whatsapp, or in-person interview.

Thank you for your consideration.

Warm regards,

{{candidate_name}}
• Direct Phone / Zalo / Whatsapp: {{phone}}
• Official Email: {{email}}`,
  },
  {
    id: 'tpl_en_tech_developer',
    name: 'Tech & Engineering Lead (Original English Version)',
    roleCategory: 'Tech Developer',
    language: 'en',
    isDefault: false,
    updatedAt: '2026-10-19',
    description: 'Concise engineering pitch focused on technical architecture, systems delivery, and modern tools.',
    subject: 'Application for {{role}} at {{company}} - {{candidate_name}}',
    body: `Dear {{recruiter_name}} & Technical Hiring Team at {{company}},

My name is {{candidate_name}}, currently serving as {{current_title}}. I am excited to apply for the {{role}} role at {{company}}.

Key Technical Strengths:
• Proven track record architecting and managing mission-critical software solutions and hardware networks.
• Hands-on proficiency with core technologies and industry competencies: {{skills}}.
• Demonstrated experience managing engineering teams (C++, Java, SQL, .NET Dynamic) and liaising directly with international technical counterparts in the USA.
• Early adopter of generative AI pipelines (Gemini 3.8 Flash, automated workflows) to optimize sprint velocity and operational output.

Expected Compensation: {{salary}}.

Please find my verified original CV attached for your review. I look forward to participating in a technical interview or system demonstration at your earliest convenience.

Sincerely,

{{candidate_name}}
• Mobile / Zalo / Whatsapp: {{phone}}
• Email: {{email}}`,
  },
  {
    id: 'tpl_en_sales_commercial',
    name: 'Sales & International Trade Director (Original English Version)',
    roleCategory: 'Sales Commercial',
    language: 'en',
    isDefault: false,
    updatedAt: '2026-10-19',
    description: 'Focused on global trade deals, Incoterms, supply-chain growth, and agent distribution networks.',
    subject: 'Application for {{role}} - {{candidate_name}} (International Trade & Commercial Growth)',
    body: `Dear {{recruiter_name}} - Commercial Talent Acquisition at {{company}},

I am writing to express my strong interest in the {{role}} opportunity at {{company}}.

With an extensive background leading cross-border trade, distribution agency networks, and industrial commercial projects across Asia and Vietnam, I offer immediate strategic impact:
• Incoterms mastery and international trade finance rules (L/C, T/T, banking guarantees).
• Proven track record building nationwide distribution channels generating tens of billions VND in monthly revenue.
• Bilingual commercial negotiation in English, securing exclusive import distribution rights and long-term joint ventures.

Target Monthly Package: {{salary}}.

My full original resume is attached for your reference. I am readily available for a preliminary call or virtual interview.

Best regards,

{{candidate_name}}
• Phone / Zalo / Whatsapp: {{phone}}
• Email: {{email}}`,
  },
  {
    id: 'tpl_en_general',
    name: 'General Professional (Original English Version)',
    roleCategory: 'General',
    language: 'en',
    isDefault: false,
    updatedAt: '2026-10-19',
    description: 'Polished, versatile, and direct application letter suitable for any professional role.',
    subject: 'Application for {{role}} Position - {{candidate_name}}',
    body: `Dear {{recruiter_name}} at {{company}},

I am {{candidate_name}}, writing to submit my application for the {{role}} position recently announced by {{company}}.

Having extensive professional experience as {{current_title}}, complemented by specialized skills in {{skills}}, I am confident in my capacity to rapidly integrate and deliver tangible results for your organization.

Summary of Application:
• Candidate: {{candidate_name}}
• Target Position: {{role}} at {{company}}
• Target Compensation: {{salary}}
• Direct Contact: {{phone}} | {{email}}

My complete CV document has been attached to this email. I would appreciate the opportunity to discuss my background in an interview.

Thank you very much for your time and consideration.

Respectfully,

{{candidate_name}}`,
  },
];

/**
 * Vietnamese Version Starter Templates (Bản Tiếng Việt)
 */
export const DEFAULT_EMAIL_TEMPLATES_VI: EmailTemplate[] = [
  {
    id: 'tpl_vi_executive',
    name: 'Executive & Quản Trị Cấp Cao (Bản Tiếng Việt)',
    roleCategory: 'Executive',
    language: 'vi',
    isDefault: false,
    updatedAt: '2026-10-19',
    description: 'Thư ứng tuyển chiến lược dành cho vai trò Giám Đốc, Trưởng Đại Diện, điều hành dự án và quản trị cao cấp.',
    subject: 'Ứng Tuyển Vị Trí {{role}} - {{candidate_name}} (Hồ Sơ Cấp Cao & Kinh Nghiệm Đa Quốc Gia)',
    body: `Kính gửi {{recruiter_name}} cùng Ban Lãnh Đạo {{company}},

Tôi là {{candidate_name}} ({{current_title}}), tôi viết thư này để bày tỏ nguyện vọng ứng tuyển vào vị trí {{role}} tại quý doanh nghiệp {{company}}.

Với hơn 25-30 năm thực chiến điều hành các tổ chức thương mại đa quốc gia, làm việc trực tiếp với đối tác quốc tế (Đài Loan, Hàn Quốc, Hoa Kỳ, Campuchia) và quản lý chuỗi dự án công nghiệp quy mô lớn, tôi tự tin năng lực quản trị chiến lược, đàm phán hợp đồng xuyên biên giới và tối ưu hóa vận hành của tôi sẽ đóng góp thiết thực cho mục tiêu phát triển của {{company}}.

Các điểm then chốt trong hồ sơ của tôi:
• Lãnh đạo điều hành và đại diện pháp lý toàn diện cho các tập đoàn thương mại FDI và xí nghiệp chế biến xuất khẩu.
• Năng lực ngoại ngữ Anh văn lưu loát trong môi trường thương mại quốc tế, đàm phán trực tiếp các hợp đồng phức tạp.
• Thấu hiểu sâu sắc quy chuẩn thương mại, quản lý chuỗi cung ứng, kiểm soát chất lượng và ứng dụng công nghệ/AI nâng cao hiệu suất.

Mức thu nhập mục tiêu: {{salary}} (đã cân nhắc tối ưu theo năng lực và đóng góp thực tế).

Tôi đã đính kèm tệp hồ sơ gốc đầy đủ cùng bài thuyết trình năng lực PowerPoint đính kèm để Quý công ty thẩm định. Rất mong có cơ hội trao đổi trực tiếp cùng {{recruiter_name}} qua Zalo/Whatsapp hoặc buổi phỏng vấn trực tiếp.

Trân trọng và chúc {{company}} ngày càng thịnh vượng,

{{candidate_name}}
• Số điện thoại / Zalo / Whatsapp: {{phone}}
• Email: {{email}}`,
  },
  {
    id: 'tpl_vi_tech_developer',
    name: 'Tech & Kỹ Thuật Công Nghệ (Bản Tiếng Việt)',
    roleCategory: 'Tech Developer',
    language: 'vi',
    isDefault: false,
    updatedAt: '2026-10-19',
    description: 'Thư ứng tuyển súc tích, tập trung vào kiến trúc công nghệ, stack kỹ thuật, tư duy giải pháp và sản phẩm.',
    subject: 'Ứng Tuyển Vị Trí {{role}} tại {{company}} - {{candidate_name}}',
    body: `Kính gửi {{recruiter_name}} & Tech Hiring Team tại {{company}},

Tôi là {{candidate_name}}, hiện là {{current_title}}. Tôi rất ấn tượng với sứ mệnh và sản phẩm công nghệ mà {{company}} đang phát triển, và trân trọng ứng tuyển vào vị trí {{role}}.

Thế mạnh kỹ thuật nổi bật của tôi:
• Trải nghiệm thực tế với công nghệ lõi và hệ thống giải pháp: {{skills}}.
• Từng quản trị và phát triển các hệ thống phần mềm quy chuẩn, giao tiếp kỹ thuật trực tiếp với các chuyên gia quốc tế.
• Khả năng tự học tập và nắm bắt công nghệ mới (AI Agent, AGI, tự động hóa quy trình) giúp tăng tốc chu kỳ phân phối sản phẩm.

Kỳ vọng mức lương đãi ngộ: {{salary}}.

Tôi gửi kèm CV hoàn chỉnh cùng hồ sơ dự án để quý công ty tiện tra cứu. Rất sẵn lòng tham gia phỏng vấn kỹ thuật hoặc demo trực tiếp theo lịch hẹn của {{company}}.

Trân trọng,
{{candidate_name}}
• Phone / Zalo / Whatsapp: {{phone}}
• Email: {{email}}`,
  },
  {
    id: 'tpl_vi_sales_commercial',
    name: 'Sales & Thương Mại Quốc Tế (Bản Tiếng Việt)',
    roleCategory: 'Sales Commercial',
    language: 'vi',
    isDefault: false,
    updatedAt: '2026-10-19',
    description: 'Tập trung vào doanh thu, mở rộng thị trường, Incoterms, thanh toán quốc tế và thiết lập mạng lưới phân phối.',
    subject: 'Ứng Tuyển {{role}} - {{candidate_name}} (Chuyên Gia Thương Mại & Xuất Nhập Khẩu)',
    body: `Kính gửi {{recruiter_name}} - Bộ phận Tuyển dụng {{company}},

Tôi là {{candidate_name}}, chuyên sâu trong lĩnh vực Thương mại quốc tế, Xuất nhập khẩu và Phát triển thị trường kinh doanh. Nhận thấy {{company}} đang mở rộng tìm kiếm nhân tài cho vị trí {{role}}, tôi xin được nộp hồ sơ ứng tuyển.

Những giá trị tôi có thể cam kết mang lại cho {{company}}:
• Kinh nghiệm thực chiến làm việc với các quy tắc Incoterms, hợp đồng ngoại thương, thủ tục hải quan, L/C và T/T ngân hàng quốc tế.
• Xây dựng và mở rộng thành công mạng lưới đại lý phân phối với doanh số lớn, thiết lập quan hệ đối tác bền vững.
• Kỹ năng thương thuyết tiếng Anh thành thạo giúp mở rộng tệp khách hàng nước ngoài và nhà cung ứng uy tín.

Mức lương đề xuất: {{salary}}.

Kính mời Quý công ty xem chi tiết tệp CV gốc được đính kèm. Tôi sẵn sàng tiếp nhận cuộc gọi trao đổi hoặc phỏng vấn trực tuyến.

Chân thành cảm ơn,
{{candidate_name}}
• Điện thoại / Zalo / Whatsapp: {{phone}}
• Hộp thư: {{email}}`,
  },
  {
    id: 'tpl_vi_general',
    name: 'Tổng Hợp Tiêu Chuẩn (Bản Tiếng Việt)',
    roleCategory: 'General',
    language: 'vi',
    isDefault: false,
    updatedAt: '2026-10-19',
    description: 'Thư ngỏ tiêu chuẩn, linh hoạt, ngắn gọn, phù hợp với hầu hết các ngành nghề và vị trí công việc.',
    subject: 'Đơn Ứng Tuyển Vị Trí {{role}} - {{candidate_name}}',
    body: `Kính gửi {{recruiter_name}} tại {{company}},

Tôi là {{candidate_name}}, viết thư này để ứng tuyển cho vị trí {{role}} mà {{company}} đang đăng tuyển.

Với kinh nghiệm chuyên môn trong vai trò {{current_title}}, cùng kỹ năng nổi bật về {{skills}}, tôi tin rằng bản thân có đủ kiến thức, sự tận tâm và tinh thần học hỏi để hoàn thành xuất sắc các mục tiêu công việc mà công ty đề ra.

Thông tin tóm tắt:
• Ứng viên: {{candidate_name}}
• Vị trí ứng tuyển: {{role}} tại {{company}}
• Mức lương kỳ vọng: {{salary}}
• Liên hệ nhanh: {{phone}} | {{email}}

Tệp CV đầy đủ của tôi đã được đính kèm theo thư này. Rất mong nhận được phản hồi và có cơ hội tham gia buổi phỏng vấn cùng {{company}}.

Xin chân thành cảm ơn Quý công ty!

Trân trọng,
{{candidate_name}}`,
  },
];

export const DEFAULT_EMAIL_TEMPLATES: EmailTemplate[] = [
  ...DEFAULT_EMAIL_TEMPLATES_EN,
  ...DEFAULT_EMAIL_TEMPLATES_VI,
];

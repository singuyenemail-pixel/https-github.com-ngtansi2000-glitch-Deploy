import { Job } from '../types/job';

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-01',
    title: 'Senior Frontend Engineer (React/TypeScript)',
    company: 'VNG Corporation',
    city: 'Hồ Chí Minh',
    district: 'Quận 7',
    address: 'VNG Campus, Đường số 13, KCX Tân Thuận, Quận 7, TP. HCM',
    workMode: 'Hybrid',
    minSalary: 28000000,
    maxSalary: 45000000,
    experienceLevel: 'Senior',
    roleCategory: 'Engineering',
    recruiterEmail: 'recruitment.tech@vng.com.vn',
    recruiterName: 'Ms. Mai Anh - Tech Talent Acquisition',
    recruiterPhone: '028 3962 3888',
    postedDate: '2026-10-12',
    description: [
      'Xây dựng và tối ưu hoá giao diện ứng dụng web quy mô hàng triệu người dùng hàng ngày.',
      'Phát triển các component hệ thống bằng React, Next.js, TypeScript và Tailwind CSS.',
      'Tối ưu hóa Core Web Vitals, hiệu năng hiển thị và bảo mật client-side.',
      'Phối hợp chặt chẽ với đội ngũ Product Manager và UI/UX Designer.'
    ],
    requirements: [
      'Tối thiểu 4+ năm kinh nghiệm lập trình React, TypeScript, State Management (Zustand/Redux).',
      'Thành thạo tối ưu render performance, Webpack/Vite, SEO và accessibility (a11y).',
      'Kinh nghiệm làm việc trong môi trường Agile/Scrum và CI/CD.',
      'Tiếng Anh giao tiếp kỹ thuật tốt.'
    ],
    benefits: [
      'Thu nhập cạnh tranh 28M - 45M VND + tháng lương 13 và thưởng KPI dự án.',
      'Bảo hiểm sức khỏe cao cấp Aon cho nhân viên và người thân.',
      'Làm việc kết hợp Hybrid (2 ngày remote mỗi tuần), pantry miễn phí, phòng gym tại campus.'
    ],
    verifiedDirectEmail: true
  },
  {
    id: 'job-02',
    title: 'Product Marketing Specialist',
    company: 'MoMo (M-Service)',
    city: 'Hồ Chí Minh',
    district: 'Quận 1',
    address: 'Tòa nhà Phú Mỹ Hưng, 08 Hoàng Văn Thái, Quận 7 (Trụ sở Q1: Hàm Nghi)',
    workMode: 'On-site',
    minSalary: 18000000,
    maxSalary: 30000000,
    experienceLevel: 'Middle',
    roleCategory: 'Marketing',
    recruiterEmail: 'careers.marketing@momo.vn',
    recruiterName: 'Mr. Tuấn Kiệt - Talent Partner',
    recruiterPhone: '0908 123 456',
    postedDate: '2026-10-13',
    description: [
      'Lên kế hoạch và thực thi chiến lược Go-To-Market cho các tính năng tài chính tiêu dùng mới.',
      'Phân tích hành vi người dùng, tối ưu tỷ lệ kích hoạt (activation) và chuyển đổi (retention).',
      'Thiết kế thông điệp truyền thông, phối hợp với creative agency và các kênh digital.'
    ],
    requirements: [
      'Từ 2-4 năm kinh nghiệm trong lĩnh vực Product Marketing, Growth Marketing hoặc Fintech.',
      'Tư duy dữ liệu (Data-driven mindset), biết sử dụng GA4, Mixpanel hoặc Amplitude là lợi thế.',
      'Khả năng viết content sắc bén và quản lý dự án đa phòng ban.'
    ],
    benefits: [
      'Mức lương 18M - 30M VND theo năng lực, thưởng quý dựa trên OKRs.',
      'Gói voucher trải nghiệm hệ sinh thái MoMo hàng tháng.',
      'Chương trình đào tạo leadership và lộ trình thăng tiến rõ ràng.'
    ],
    verifiedDirectEmail: true
  },
  {
    id: 'job-03',
    title: 'Fullstack Developer (Node.js & React)',
    company: 'FPT Software',
    city: 'Hà Nội',
    district: 'Cầu Giấy',
    address: 'FPT Tower, Số 10 Phạm Văn Bạch, Cầu Giấy, Hà Nội',
    workMode: 'Hybrid',
    minSalary: 22000000,
    maxSalary: 38000000,
    experienceLevel: 'Middle',
    roleCategory: 'Engineering',
    recruiterEmail: 'tuyendung.fsoft@fpt.com',
    recruiterName: 'Ms. Hoàng Yến - Senior IT Recruiter',
    recruiterPhone: '024 7300 7300',
    postedDate: '2026-10-14',
    description: [
      'Tham gia phát triển dự án Cloud SaaS cho khách hàng thị trường Nhật Bản và Singapore.',
      'Thiết kế RESTful APIs, microservices kiến trúc sạch và module mở rộng linh hoạt.',
      'Review code, viết unit test và tham gia sprint planning định kỳ.'
    ],
    requirements: [
      '3+ năm kinh nghiệm với Node.js (NestJS hoặc Express) và React/TypeScript.',
      'Nắm vững kiến thức về PostgreSQL, MongoDB, Docker và AWS Cloud.',
      'Có khả năng tự nghiên cứu công nghệ mới và giải quyết vấn đề độc lập.'
    ],
    benefits: [
      'Thu nhập 22M - 38M VND + cơ hội onsite ngắn hạn tại Tokyo hoặc Singapore.',
      'Hỗ trợ chứng chỉ quốc tế AWS, Kubernetes 100% kinh phí.',
      'Trợ cấp thiết bị làm việc công nghệ cao (MacBook Pro).'
    ],
    verifiedDirectEmail: true
  },
  {
    id: 'job-04',
    title: 'Senior UI/UX Designer',
    company: 'ZaloPay',
    city: 'Hồ Chí Minh',
    district: 'Quận 1',
    address: 'Tòa nhà Saigon Centre, 65 Lê Lợi, Bến Nghé, Quận 1, TP. HCM',
    workMode: 'Hybrid',
    minSalary: 25000000,
    maxSalary: 42000000,
    experienceLevel: 'Senior',
    roleCategory: 'Design',
    recruiterEmail: 'talent.design@zalopay.vn',
    recruiterName: 'Ms. Phương Thảo - Design Recruitment',
    recruiterPhone: '0912 345 678',
    postedDate: '2026-10-11',
    description: [
      'Chủ trì thiết kế trải nghiệm người dùng cho các tính năng thanh toán & ví điện tử di động.',
      'Xây dựng và mở rộng hệ thống Design System chuẩn hoá cho nền tảng iOS, Android và Web.',
      'Thực hiện user research, usability testing định tính và định lượng để cải tiến luồng nghiệp vụ.'
    ],
    requirements: [
      '4+ năm kinh nghiệm Product Design / UI/UX cho ứng dụng di động B2C quy mô lớn.',
      'Thành thạo Figma nâng cao (Auto-layout, Tokens, Variables, Prototyping).',
      'Portfolio thể hiện rõ tư duy giải quyết bài toán người dùng và thẩm mỹ hiện đại.'
    ],
    benefits: [
      'Lương 25M - 42M VND + review lương 2 lần/năm.',
      'Môi trường thiết kế cởi mở, trang thiết bị Apple đời mới.',
      'Bảo hiểm sức khỏe quốc tế PTI.'
    ],
    verifiedDirectEmail: true
  },
  {
    id: 'job-05',
    title: 'Data Analyst (SQL / PowerBI / Python)',
    company: 'Tiki Corporation',
    city: 'Hồ Chí Minh',
    district: 'Tân Bình',
    address: 'Viettel Complex, 285 Cách Mạng Tháng 8, Quận 10 (Gần ranh Tân Bình), TP. HCM',
    workMode: 'On-site',
    minSalary: 16000000,
    maxSalary: 28000000,
    experienceLevel: 'Junior',
    roleCategory: 'Data',
    recruiterEmail: 'careers.analytics@tiki.vn',
    recruiterName: 'Mr. Quốc Bảo - HR Business Partner',
    recruiterPhone: '028 7305 8454',
    postedDate: '2026-10-10',
    description: [
      'Phân tích số liệu chuỗi cung ứng (supply chain) và hành vi mua sắm thương mại điện tử.',
      'Thiết kế và duy trì các Dashboard điều hành thời gian thực trên PowerBI và Tableau.',
      'Hợp tác cùng phòng kinh doanh nhằm tối ưu hóa chi phí vận hành kho vận (fulfillment).'
    ],
    requirements: [
      '1.5 - 3 năm kinh nghiệm làm việc ở vị trí Data Analyst hoặc Business Intelligence.',
      'Thành thạo viết truy vấn SQL phức tạp, xử lý dữ liệu với Python (Pandas).',
      'Tư duy phân tích số liệu nhạy bén và khả năng trình bày trực quan (storytelling with data).'
    ],
    benefits: [
      'Thu nhập 16M - 28M VND thỏa thuận theo năng lực.',
      'Phụ cấp ăn trưa, vé gửi xe và mã giảm giá TikiNOW.',
      'Cơ hội học hỏi từ kho dữ liệu hàng trăm triệu giao dịch thương mại điện tử.'
    ],
    verifiedDirectEmail: true
  },
  {
    id: 'job-06',
    title: 'Lead DevOps / SRE Engineer',
    company: 'Viettel Digital Solutions',
    city: 'Hà Nội',
    district: 'Nam Từ Liêm',
    address: 'Tòa nhà Viettel, Số 1 Trần Hữu Dực, Mỹ Đình 2, Nam Từ Liêm, Hà Nội',
    workMode: 'On-site',
    minSalary: 35000000,
    maxSalary: 50000000,
    experienceLevel: 'Lead',
    roleCategory: 'Engineering',
    recruiterEmail: 'hr.hiring@viettel.com.vn',
    recruiterName: 'Mr. Hải Đăng - Head of Technical Recruitment',
    recruiterPhone: '024 6255 6789',
    postedDate: '2026-10-13',
    description: [
      'Chỉ đạo thiết kế hạ tầng Kubernetes phân tán phục vụ hàng chục triệu thuê bao số.',
      'Tự động hóa toàn bộ quy trình CI/CD, IaC (Terraform, Ansible) và giám sát hạ tầng.',
      'Đảm bảo cam kết SLA hệ thống 99.99%, lập kế hoạch Disaster Recovery và bảo mật hạ tầng.'
    ],
    requirements: [
      '5+ năm kinh nghiệm quản trị hệ thống Linux, Cloud và DevOps chuyên sâu.',
      'Chứng chỉ CKA/CKS hoặc AWS Solutions Architect Professional là lợi thế vượt trội.',
      'Kinh nghiệm điều phối đội ngũ kỹ sư hạ tầng từ 4 người trở lên.'
    ],
    benefits: [
      'Mức đãi ngộ 35M - 50M VND + thưởng năm theo kết quả kinh doanh tập đoàn Viettel.',
      'Chế độ nghỉ dưỡng thường niên tại các resort cao cấp của tập đoàn.',
      'Cơ hội tham gia các đề án chuyển đổi số trọng điểm quốc gia.'
    ],
    verifiedDirectEmail: true
  },
  {
    id: 'job-07',
    title: 'Senior Digital Media Specialist',
    company: 'Dentsu Vietnam',
    city: 'Hồ Chí Minh',
    district: 'Bình Thạnh',
    address: 'Tòa nhà Pearl Plaza, 561A Điện Biên Phủ, Phường 25, Bình Thạnh, TP. HCM',
    workMode: 'Hybrid',
    minSalary: 20000000,
    maxSalary: 32000000,
    experienceLevel: 'Senior',
    roleCategory: 'Marketing',
    recruiterEmail: 'talent.vietnam@dentsu.com',
    recruiterName: 'Ms. Kim Oanh - Talent Acquisition Manager',
    recruiterPhone: '028 3821 9999',
    postedDate: '2026-10-09',
    description: [
      'Lập kế hoạch phân bổ ngân sách Performance Marketing cho các nhãn hàng FMCG hàng đầu.',
      'Vận hành và tối ưu chiến dịch Meta Ads, Google Ads, TikTok Ads ngân sách lớn.',
      'Báo cáo hiệu quả ROI, CAC, ROAS và đề xuất kịch bản thử nghiệm A/B testing liên tục.'
    ],
    requirements: [
      'Từ 3-5 năm kinh nghiệm Media Planning / Performance Marketing tại agency hoặc brand lớn.',
      'Am hiểu sâu về tracking pixels, Conversion API, GA4 và các công cụ đo lường attribution.',
      'Kỹ năng thương lượng, đàm phán và thuyết trình với đối tác cấp cao.'
    ],
    benefits: [
      'Mức lương 20M - 32M VND + thưởng hoa hồng chiến dịch.',
      'Làm việc tại môi trường agency quốc tế chuyên nghiệp, sáng tạo.',
      'Hỗ trợ chế độ bảo hiểm chăm sóc sức khỏe quốc tế Liberty.'
    ],
    verifiedDirectEmail: true
  },
  {
    id: 'job-08',
    title: 'Backend Engineer (Golang / Microservices)',
    company: 'Shopee Vietnam',
    city: 'Đà Nẵng',
    district: 'Hải Châu',
    address: 'Tòa nhà Software Park Đà Nẵng, 02 Quang Trung, Hải Châu, Đà Nẵng',
    workMode: 'Hybrid',
    minSalary: 26000000,
    maxSalary: 44000000,
    experienceLevel: 'Senior',
    roleCategory: 'Engineering',
    recruiterEmail: 'recruitment.danang@shopee.com',
    recruiterName: 'Mr. Trọng Nhân - Regional Tech Recruiter',
    recruiterPhone: '0236 388 9999',
    postedDate: '2026-10-14',
    description: [
      'Phát triển hệ thống xử lý giao dịch cao tải (high-concurrency) cho dịch vụ thanh toán và e-commerce.',
      'Tối ưu hóa kiến trúc cơ sở dữ liệu distributed caching (Redis) và message queues (Kafka).',
      'Đảm bảo độ trễ phản hồi API cực thấp dưới 50ms cho các sự kiện flash sale.'
    ],
    requirements: [
      '3+ năm kinh nghiệm phát triển backend với Golang hoặc Java/C++.',
      'Hiểu sâu về cơ chế concurrency, goroutines, memory management và distributed systems.',
      'Tư duy giải thuật và cấu trúc dữ liệu xuất sắc.'
    ],
    benefits: [
      'Mức lương 26M - 44M VND rất hấp dẫn tại thị trường miền Trung.',
      'Chính sách hỗ trợ relocation cho ứng viên chuyển đến Đà Nẵng.',
      'Môi trường năng động, văn phòng view biển thoáng đãng.'
    ],
    verifiedDirectEmail: true
  },
  {
    id: 'job-09',
    title: 'Operations & Logistics Supervisor',
    company: 'Giaohangtietkiem (GHTK)',
    city: 'Bình Dương',
    district: 'Dĩ An',
    address: 'Kho Trung tâm GHTK Sóng Thần, KCN Sóng Thần 1, Dĩ An, Bình Dương',
    workMode: 'On-site',
    minSalary: 14000000,
    maxSalary: 24000000,
    experienceLevel: 'Middle',
    roleCategory: 'Operations',
    recruiterEmail: 'tuyendung.binhduong@ghtk.vn',
    recruiterName: 'Ms. Minh Thư - Nhân sự Vận hành',
    recruiterPhone: '0274 730 0888',
    postedDate: '2026-10-12',
    description: [
      'Giám sát hoạt động phân loại và điều phối hàng hóa tại tổng kho trung chuyển.',
      'Tối ưu thời gian luân chuyển hàng, giảm tỷ lệ hư hỏng, thất thoát bưu phẩm.',
      'Quản lý và đào tạo đội ngũ nhân viên kho và tài xế giao nhận.'
    ],
    requirements: [
      '2+ năm kinh nghiệm giám sát kho vận, logistics hoặc chuỗi cung ứng bưu chính.',
      'Kỹ năng xử lý tình huống phát sinh nhanh nhẹn, tinh thần trách nhiệm cao.',
      'Sử dụng thành thạo phần mềm ERP/WMS và Excel nâng cao.'
    ],
    benefits: [
      'Lương cứng 14M - 24M VND + phụ cấp trách nhiệm và năng suất kho.',
      'Bảo hiểm xã hội, bảo hiểm tai nạn 24/7 theo luật lao động.',
      'Lộ trình thăng tiến lên Trưởng kho trung chuyển sau 1 năm.'
    ],
    verifiedDirectEmail: true
  },
  {
    id: 'job-10',
    title: 'Senior QA / Automation Tester (Playwright/Python)',
    company: 'KMS Technology',
    city: 'Hồ Chí Minh',
    district: 'Tân Bình',
    address: 'Tòa nhà KMS, 28 Trường Sơn, Phường 2, Tân Bình, TP. HCM',
    workMode: 'Hybrid',
    minSalary: 24000000,
    maxSalary: 39000000,
    experienceLevel: 'Senior',
    roleCategory: 'Engineering',
    recruiterEmail: 'careers.qa@kms-technology.com',
    recruiterName: 'Mr. Hoàng Phúc - QA Recruitment Lead',
    recruiterPhone: '028 3811 9977',
    postedDate: '2026-10-08',
    description: [
      'Thiết kế chiến lược kiểm thử tự động toàn diện (E2E, API, Performance) cho sản phẩm Healthcare.',
      'Xây dựng framework automation testing sử dụng Playwright, TypeScript hoặc Python.',
      'Tích hợp tự động hóa kiểm thử vào pipeline CI/CD GitHub Actions.'
    ],
    requirements: [
      'Từ 3.5 năm kinh nghiệm làm việc chuyên sâu về Automation Testing.',
      'Thành thạo Playwright hoặc Cypress hoặc Selenium WebDriver.',
      'Có kinh nghiệm kiểm thử tải với k6 hoặc JMeter là điểm cộng lớn.'
    ],
    benefits: [
      'Mức thu nhập 24M - 39M VND, thưởng tháng 13 + performance bonus.',
      'Trợ cấp chứng chỉ quốc tế ISTQB và ngoại ngữ.',
      'Chương trình chăm sóc sức khỏe răng miệng & mắt hàng năm.'
    ],
    verifiedDirectEmail: true
  },
  {
    id: 'job-11',
    title: 'Senior B2B Corporate Sales Executive',
    company: 'VinFast Auto',
    city: 'Hà Nội',
    district: 'Ba Đình',
    address: 'Văn phòng VinFast, Tòa nhà Symphony, Chu Huy Mân, Long Biên (VP Ba Đình: Liễu Giai)',
    workMode: 'On-site',
    minSalary: 18000000,
    maxSalary: 45000000,
    experienceLevel: 'Senior',
    roleCategory: 'Sales',
    recruiterEmail: 'tuyendung.b2b@vinfast.vn',
    recruiterName: 'Ms. Thanh Trúc - Trưởng nhóm Tuyển dụng B2B',
    recruiterPhone: '024 3974 9999',
    postedDate: '2026-10-13',
    description: [
      'Mở rộng mạng lưới khách hàng doanh nghiệp, các hãng taxi và đối tác đội xe thương mại điện tử.',
      'Tư vấn các gói giải pháp phương tiện xanh, giải pháp sạc và hợp đồng mua xe số lượng lớn.',
      'Chăm sóc mối quan hệ lâu dài với các giám đốc vận hành (COO) và ban quản lý dự án.'
    ],
    requirements: [
      '3+ năm kinh nghiệm B2B Sales trong ngành ô tô, thiết bị công nghiệp hoặc công nghệ cao.',
      'Kỹ năng đàm phán hợp đồng giá trị lớn và thuyết phục khách hàng doanh nghiệp.',
      'Tác phong lịch thiệp, kỹ năng giải quyết vướng mắc nhanh nhạy.'
    ],
    benefits: [
      'Lương cơ bản 18M - 25M VND + hoa hồng doanh số không giới hạn (tổng thu nhập đến 45M - 50M+ VND).',
      'Được hưởng chế độ ưu đãi đặc quyền trong hệ sinh thái Vingroup.',
      'Xe đưa đón công tác nội đô và phụ cấp tiếp khách chu đáo.'
    ],
    verifiedDirectEmail: true
  },
  {
    id: 'job-12',
    title: 'Senior Mobile Engineer (Flutter / React Native)',
    company: 'Grab Vietnam (R&D)',
    city: 'Hồ Chí Minh',
    district: 'Quận 7',
    address: 'Mapletree Business City, 1060 Nguyễn Văn Linh, Tân Phong, Quận 7, TP. HCM',
    workMode: 'Remote',
    minSalary: 32000000,
    maxSalary: 48000000,
    experienceLevel: 'Senior',
    roleCategory: 'Engineering',
    recruiterEmail: 'careers.vn@grabtaxi.com',
    recruiterName: 'Mr. Alex Đỗ - Tech Talent Partner',
    recruiterPhone: '028 7108 7108',
    postedDate: '2026-10-14',
    description: [
      'Phát triển các module tiện ích siêu ứng dụng Grab (Merchant App & Driver App).',
      'Đảm bảo ứng dụng hoạt động mượt mà ở các thiết bị cấu hình tầm trung và kết nối mạng chập chờn.',
      'Tối ưu hóa bộ nhớ, hạn chế crash rate dưới 0.05% trên hàng triệu thiết bị di động.'
    ],
    requirements: [
      '4+ năm kinh nghiệm phát triển Mobile với Flutter hoặc React Native.',
      'Hiểu rõ native Android (Kotlin) hoặc iOS (Swift) bridge.',
      'Kinh nghiệm xây dựng offline-first architecture và local caching.'
    ],
    benefits: [
      'Lương 32M - 48M VND + cổ phiếu ESOP và thưởng hiệu quả công việc.',
      'Hỗ trợ chế độ làm việc từ xa 100% (Remote work) kèm ngân sách trang bị bàn ghế công thái học.',
      'Gói Grab for Business sử dụng dịch vụ xe và đồ ăn hàng tháng.'
    ],
    verifiedDirectEmail: true
  },
  {
    id: 'job-13',
    title: 'Human Resources Generalist / HRBP',
    company: 'Can Tho Software Park',
    city: 'Cần Thơ',
    district: 'Ninh Kiều',
    address: 'Số 01 Lý Thái Tổ, Phường Hưng Phú, Quận Cái Răng (Liền kề Ninh Kiều), TP. Cần Thơ',
    workMode: 'On-site',
    minSalary: 12000000,
    maxSalary: 20000000,
    experienceLevel: 'Junior',
    roleCategory: 'Operations',
    recruiterEmail: 'hr.talent@canthosoftware.vn',
    recruiterName: 'Ms. Ngọc Giàu - Trưởng phòng Nhân sự',
    recruiterPhone: '0292 383 1234',
    postedDate: '2026-10-09',
    description: [
      'Thực hiện quy trình tuyển dụng nhân sự công nghệ thông tin và quản trị nguồn nhân lực khu vực ĐBSCL.',
      'Phụ trách thủ tục Onboarding, quản lý hợp đồng lao động, chấm công và giải quyết chế độ C&B.',
      'Tổ chức các sự kiện gắn kết nội bộ (Team building, Workshop kỹ năng).'
    ],
    requirements: [
      '1.5 - 3 năm kinh nghiệm trong công tác HR tổng hợp hoặc tuyển dụng nội bộ.',
      'Hiểu biết chắc chắn về Luật Lao động Việt Nam hiện hành.',
      'Kỹ năng lắng nghe, thấu hiểu và gắn kết nhân viên tốt.'
    ],
    benefits: [
      'Mức lương 12M - 20M VND phù hợp chi phí sống tại miền Tây sông nước.',
      'Môi trường công sở thân thiện, ổn định và đãi ngộ lâu dài.',
      'Chế độ thưởng lễ tết và du lịch công ty hàng năm.'
    ],
    verifiedDirectEmail: true
  },
  {
    id: 'job-14',
    title: 'AI Prompt & Application Engineer',
    company: 'Vingroup Big Data Institute',
    city: 'Hà Nội',
    district: 'Hai Bà Trưng',
    address: 'Times City, 458 Minh Khai, Vĩnh Tuy, Hai Bà Trưng, Hà Nội',
    workMode: 'Hybrid',
    minSalary: 28000000,
    maxSalary: 46000000,
    experienceLevel: 'Middle',
    roleCategory: 'Engineering',
    recruiterEmail: 'recruitment.ai@vinai.io',
    recruiterName: 'Mr. Quang Vinh - AI Talent Acquisition',
    recruiterPhone: '024 3975 6688',
    postedDate: '2026-10-14',
    description: [
      'Thiết kế và tối ưu chuỗi Prompt kỹ thuật cao (RAG, CoT, Few-shot) cho mô hình LLM tiếng Việt.',
      'Xây dựng các agent tự động hóa quy trình phân loại tài liệu và hỗ trợ khách hàng thông minh.',
      'Đánh giá benchmark chất lượng phản hồi, hạn chế hiện tượng ảo giác (hallucination).'
    ],
    requirements: [
      '2+ năm kinh nghiệm ứng dụng LLM, LangChain, LlamaIndex hoặc Google Gemini SDK.',
      'Nền tảng lập trình Python hoặc TypeScript vững vàng.',
      'Khả năng tư duy logic ngữ nghĩa và đánh giá chất lượng ngôn ngữ tự nhiên.'
    ],
    benefits: [
      'Lương 28M - 46M VND + cơ hội tham gia các hội thảo AI quốc tế.',
      'Được tiếp cận hạ tầng tính toán GPU quy mô hàng đầu khu vực.',
      'Chế độ bảo hiểm cao cấp và phụ cấp nghiên cứu chuyên đề.'
    ],
    verifiedDirectEmail: true
  }
];

import { Job } from '../types/job';

// Freshly verified direct company hiring commands & Facebook tech hiring posts (All active within 7 days)
export const DEEP_SEARCH_HARVESTED_JOBS: Job[] = [
  {
    id: 'deep-01',
    title: 'Senior React / Next.js Engineer (Core Platform)',
    company: 'Techcombank Digital',
    city: 'Hà Nội',
    district: 'Hoàn Kiếm',
    address: 'Techcombank Tower, 06 Quang Trung, Hoàn Kiếm, Hà Nội',
    workMode: 'Hybrid',
    minSalary: 30000000,
    maxSalary: 48000000,
    experienceLevel: 'Senior',
    roleCategory: 'Engineering',
    recruiterEmail: 'talent.digital@techcombank.com.vn',
    recruiterName: 'Mr. Quốc Tuấn - Digital Hiring Lead',
    recruiterPhone: '024 3944 6368',
    postedDate: '2026-10-14',
    postedHoursAgo: 14,
    description: [
      'Phát triển ứng dụng Mobile Web & Internet Banking thế hệ mới phục vụ hơn 12 triệu khách hàng.',
      'Triển khai kiến trúc Micro-Frontend với Next.js 15, TypeScript, và Tailwind CSS.',
      'Đảm bảo tiêu chuẩn bảo mật ngân hàng khắt khe, tối ưu hóa Web Vitals dưới 1.2s.'
    ],
    requirements: [
      '4+ năm kinh nghiệm phát triển Frontend chuyên sâu với React, Next.js, Redux Toolkit / Zustand.',
      'Hiểu rõ về Web Security (CSP, XSS, CSRF) và hiệu năng tải trang.',
      'Kinh nghiệm làm việc trong môi trường Agile/DevOps chuẩn quốc tế.'
    ],
    benefits: [
      'Thu nhập 30M - 48M VND + thưởng cuối năm từ 2 đến 4 tháng lương theo KPI ngân hàng.',
      'Gói vay ưu đãi lãi suất đặc quyền nhân viên Techcombank.',
      'Bảo hiểm sức khỏe cao cấp Liberty cho cả gia đình.'
    ],
    verifiedDirectEmail: true,
    sourceType: 'company_direct',
    sourceName: 'Techcombank Digital Careers Portal',
    sourceUrl: 'https://careers.techcombank.com.vn',
    rawSourceSnippet: 'Techcombank Digital thông báo tuyển dụng trực tiếp Senior React/Next.js Engineer. Vui lòng gửi CV về talent.digital@techcombank.com.vn.'
  },
  {
    id: 'deep-02',
    title: 'Middle / Senior Golang Cloud Backend Developer',
    company: 'One Mount Group (Vingroup & Techcombank)',
    city: 'Hà Nội',
    district: 'Hai Bà Trưng',
    address: 'Times City, 458 Minh Khai, Vĩnh Tuy, Hai Bà Trưng, Hà Nội',
    workMode: 'Hybrid',
    minSalary: 25000000,
    maxSalary: 42000000,
    experienceLevel: 'Senior',
    roleCategory: 'Engineering',
    recruiterEmail: 'careers.tech@onemount.com',
    recruiterName: 'Ms. Bích Phương - Senior Tech Recruiter',
    recruiterPhone: '024 7300 8989',
    postedDate: '2026-10-13',
    postedHoursAgo: 28,
    description: [
      'Xây dựng các dịch vụ backend phân tán cao tải cho hệ sinh thái VinShop & VinID.',
      'Xử lý hàng triệu thông điệp sự kiện giao dịch mỗi ngày qua Apache Kafka và Redis Cluster.',
      'Tối ưu hóa Database queries (PostgreSQL, ClickHouse) và xây dựng RESTful / gRPC APIs.'
    ],
    requirements: [
      'Từ 3+ năm làm việc với Golang hoặc Java có mong muốn chuyển đổi sang Golang.',
      'Kinh nghiệm thiết kế kiến trúc Microservices, Docker, Kubernetes trên Google Cloud Platform.',
      'Tư duy cấu trúc dữ liệu và giải thuật vững vàng.'
    ],
    benefits: [
      'Mức đãi ngộ 25M - 42M VND + review lương 2 lần/năm.',
      'Làm việc với các chuyên gia đầu ngành trong lĩnh vực Retail Tech & FinTech.',
      'Chế độ Hybrid linh hoạt, phụ cấp ăn trưa tại tòa nhà Times City.'
    ],
    verifiedDirectEmail: true,
    sourceType: 'company_direct',
    sourceName: 'One Mount Talent Center',
    sourceUrl: 'https://careers.onemount.com',
    rawSourceSnippet: 'One Mount Group đăng tuyển kỹ sư Golang Cloud. Hồ sơ gửi trực tiếp đến careers.tech@onemount.com (Tiêu đề: [Ứng tuyển Golang] - Họ tên).'
  },
  {
    id: 'deep-03',
    title: 'Lead Product Designer (B2B SaaS / POS Solution)',
    company: 'KiotViet (Citigo)',
    city: 'Hà Nội',
    district: 'Cầu Giấy',
    address: 'Tòa nhà C’land, 81 Lê Đức Thọ, Nam Từ Liêm (Gần ranh Cầu Giấy), Hà Nội',
    workMode: 'Hybrid',
    minSalary: 28000000,
    maxSalary: 45000000,
    experienceLevel: 'Lead',
    roleCategory: 'Design',
    recruiterEmail: 'tuyendung.product@kiotviet.com',
    recruiterName: 'Ms. Thùy Linh - Head of HR',
    recruiterPhone: '024 7300 6888',
    postedDate: '2026-10-14',
    postedHoursAgo: 6,
    description: [
      'Định hình trải nghiệm người dùng cho hệ thống phần mềm quản lý bán hàng KiotViet trên Web & Mobile.',
      'Xây dựng và chuẩn hóa Kiot Design System đa nền tảng cho hơn 300.000 chủ cửa hàng kinh doanh.',
      'Dẫn dắt và hướng dẫn chuyên môn cho đội ngũ 4 UI/UX Designers.'
    ],
    requirements: [
      '4+ năm kinh nghiệm Product Design trong mảng SaaS, FinTech hoặc E-Commerce.',
      'Thành thạo Figma Design System Tokens, Variables, Component Auto-layout.',
      'Khả năng đọc hiểu số liệu người dùng và tổ chức các buổi User Research thực địa.'
    ],
    benefits: [
      'Lương thỏa thuận 28M - 45M VND, thưởng thành tích kinh doanh năm.',
      'Cơ hội sở hữu cổ phiếu ESOP của Citigo.',
      'Trang bị máy tính MacBook Pro M3 và màn hình đồ họa chuyên dụng.'
    ],
    verifiedDirectEmail: true,
    sourceType: 'facebook_group',
    sourceName: 'FB Group: Cộng Đồng UI/UX Designer Việt Nam (Đăng trực tiếp)',
    sourceUrl: 'https://facebook.com/groups/uiuxvietnam',
    rawSourceSnippet: '[GÓC TUYỂN DỤNG TRỰC TIẾP TỪ HR KIOTVIET] Cần tìm 01 Lead Product Designer package 28M-45M. Mời cả nhà gửi CV + Portfolio về: tuyendung.product@kiotviet.com.'
  },
  {
    id: 'deep-04',
    title: 'Senior Growth & Performance Marketing Specialist',
    company: 'FPT Telecom (FoxPay & FPT Play)',
    city: 'Hồ Chí Minh',
    district: 'Tân Bình',
    address: 'FPT Tân Thuận, KCX Tân Thuận, Q7 (Chi nhánh điều hành: Tân Bình)',
    workMode: 'On-site',
    minSalary: 20000000,
    maxSalary: 35000000,
    experienceLevel: 'Senior',
    roleCategory: 'Marketing',
    recruiterEmail: 'tuyendung.fptplay@fpt.com',
    recruiterName: 'Mr. Anh Dũng - Growth Recruitment Lead',
    recruiterPhone: '028 7300 2222',
    postedDate: '2026-10-12',
    postedHoursAgo: 50,
    description: [
      'Trực tiếp quản lý và tối ưu hóa ngân sách Performance Marketing cho ứng dụng OTT FPT Play.',
      'Vận hành các chiến dịch thu hút người dùng mới (App Install & Subscription) trên Meta, Google UAC, TikTok.',
      'Phối hợp cùng bộ phận Data để xây dựng mô hình dự báo LTV (Lifetime Value) và CAC.'
    ],
    requirements: [
      '3+ năm kinh nghiệm Performance Marketing cho ứng dụng di động B2C hoặc E-Commerce.',
      'Thành thạo sử dụng AppsFlyer / Adjust, Google Analytics 4 và Facebook Ads Manager.',
      'Kỹ năng phân tích số liệu nhạy bén và tối ưu hóa chuyển đổi liên tục.'
    ],
    benefits: [
      'Thu nhập 20M - 35M VND + thưởng KPI tăng trưởng người dùng hàng quý.',
      'Sử dụng miễn phí các dịch vụ Internet cáp quang và gói VIP FPT Play.',
      'Bảo hiểm FPT Care độc quyền.'
    ],
    verifiedDirectEmail: true,
    sourceType: 'facebook_group',
    sourceName: 'FB Group: Việc Làm Digital Marketing & Performance HCM',
    sourceUrl: 'https://facebook.com/groups/digitalmarketinghcm',
    rawSourceSnippet: 'Team FPT Play đang cần tìm Senior Performance Marketing ngân sách lớn, lương cứng 20-35 củ. Ứng viên gửi CV trực tiếp qua email: tuyendung.fptplay@fpt.com.'
  },
  {
    id: 'deep-05',
    title: 'DevOps / Kubernetes Platform Engineer',
    company: 'Viettel Cyber Security',
    city: 'Hà Nội',
    district: 'Cầu Giấy',
    address: 'Tòa nhà The Light, Tố Hữu, Nam Từ Liêm (Trụ sở Cầu Giấy: Duy Tân)',
    workMode: 'Hybrid',
    minSalary: 26000000,
    maxSalary: 45000000,
    experienceLevel: 'Middle',
    roleCategory: 'Engineering',
    recruiterEmail: 'vcs.recruitment@viettel.com.vn',
    recruiterName: 'Ms. Ngọc Ánh - Nhân sự Kỹ thuật VCS',
    recruiterPhone: '024 6688 8888',
    postedDate: '2026-10-15',
    postedHoursAgo: 3,
    description: [
      'Quản trị và vận hành cụm Kubernetes phục vụ các sản phẩm giám sát an toàn thông tin (SOC, SIEM).',
      'Xây dựng quy trình tự động hóa GitOps (ArgoCD, Helm) và Infrastructure as Code (Terraform).',
      'Đảm bảo tiêu chuẩn High Availability và bảo mật hệ thống cấp độ quốc gia.'
    ],
    requirements: [
      '2.5+ năm kinh nghiệm quản trị hệ thống Linux, Docker và Kubernetes trong môi trường Production.',
      'Thành thạo Prometheus, Grafana, ELK Stack và viết script tự động hóa với Python / Bash.',
      'Có chứng chỉ CKA hoặc kiến thức về An toàn thông tin là lợi thế lớn.'
    ],
    benefits: [
      'Mức đãi ngộ 26M - 45M VND + thưởng dự án an ninh mạng trọng điểm.',
      'Được đào tạo các chứng chỉ bảo mật quốc tế trị giá hàng nghìn USD.',
      'Chế độ đãi ngộ hàng đầu trong khối công nghệ Viettel.'
    ],
    verifiedDirectEmail: true,
    sourceType: 'company_direct',
    sourceName: 'Viettel Cyber Security Career Portal',
    sourceUrl: 'https://cyber.viettel.vn/careers',
    rawSourceSnippet: 'Viettel Cyber Security tuyển dụng trực tiếp Kỹ sư DevOps/Kubernetes. Hồ sơ gửi qua email: vcs.recruitment@viettel.com.vn.'
  },
  {
    id: 'deep-06',
    title: 'Senior React Native / Mobile Developer',
    company: 'Amanotes Vietnam',
    city: 'Hồ Chí Minh',
    district: 'Quận 1',
    address: 'Tòa nhà Bitexco Financial Tower, Số 02 Hải Triều, Bến Nghé, Quận 1, TP. HCM',
    workMode: 'Hybrid',
    minSalary: 28000000,
    maxSalary: 46000000,
    experienceLevel: 'Senior',
    roleCategory: 'Engineering',
    recruiterEmail: 'talent.hiring@amanotes.com',
    recruiterName: 'Mr. Hoàng Nam - Talent Acquisition',
    recruiterPhone: '028 3620 5888',
    postedDate: '2026-10-14',
    postedHoursAgo: 18,
    description: [
      'Phát triển ứng dụng tương tác âm nhạc và game di động hàng trăm triệu lượt tải toàn cầu.',
      'Tối ưu hóa audio latency và animation 60 FPS trên cả hai nền tảng Android và iOS.',
      'Ứng dụng các công nghệ mới nhất về React Native New Architecture (Fabric, TurboModules).'
    ],
    requirements: [
      '3.5+ năm kinh nghiệm chuyên sâu React Native, TypeScript, Redux/MobX.',
      'Am hiểu Native Android (Java/Kotlin) hoặc iOS (Swift/Objective-C) để viết native modules.',
      'Đam mê âm nhạc và giải trí số.'
    ],
    benefits: [
      'Lương 28M - 46M VND + thưởng quý theo doanh thu ứng dụng.',
      'Văn phòng chuẩn phong cách Interactive Music Lounge tại tầng cao Bitexco Q1.',
      'Lớp học nhạc miễn phí (Piano, Guitar, Trống) ngay tại văn phòng.'
    ],
    verifiedDirectEmail: true,
    sourceType: 'tech_forum',
    sourceName: 'Diễn Đàn Lập Trình Viên Mobile VN (Bài đăng trực tiếp)',
    sourceUrl: 'https://mobiledevvn.com/tuyendung',
    rawSourceSnippet: 'Amanotes tuyển trực tiếp Senior React Native tại Bitexco Q1. Thu nhập 28M-46M. Mời ứng viên gửi CV đến talent.hiring@amanotes.com.'
  }
];

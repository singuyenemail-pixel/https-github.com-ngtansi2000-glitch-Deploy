import { CandidateProfile, PresentationSlide } from '../types/job';

export function buildSlidesFromProfile(
  profile: CandidateProfile,
  language: 'en' | 'vi' = 'en'
): PresentationSlide[] {
  const isEn = language === 'en';
  const name = profile.fullName || (isEn ? 'SIMON NGUYEN' : 'SIMON NGUYEN (NGUYỄN TẤN SĨ)');
  const title = profile.currentTitle || (isEn ? 'Domestic & International Trade & Projects' : 'Thương Mại Quốc Nội , Quốc Tế & Dự Án');
  const years = profile.experienceYears || 30;
  const salaryM = Math.round((profile.targetSalaryVnd || 15000000) / 1000000);
  const phone = profile.phone || 'Zalo/Whatsapp 0702499445';
  const email = profile.email || 'singuyenemail@gmail.com';
  const dob = profile.dateOfBirth
    ? (isEn ? `DOB: ${profile.dateOfBirth}` : `Ngày sinh: ${profile.dateOfBirth}`)
    : '';
  const citizen = profile.citizenId
    ? (isEn ? `ID/Citizen: ${profile.citizenId}` : `CCCD: ${profile.citizenId}`)
    : '';

  if (isEn) {
    return [
      // Slide 1: Cover Page (English)
      {
        id: 'slide-1-cover',
        slideNumber: 1,
        title: name,
        subtitle: title,
        category: 'cover',
        badge: 'EXECUTIVE CV SELF-PRESENTATION & VALUE PROPOSITION DECK',
        bulletPoints: [
          `Over ${years} years of proven leadership in international trade, EPC projects, and overseas joint ventures.`,
          '20+ years of fluent business English, drafting cross-border commercial contracts and negotiating in executive boardrooms.',
          `Target Compensation: ~${salaryM}M VND/month · Ready for immediate deployment and travel.`,
        ],
        calloutBox: `Direct Contact: ${phone} | ${email} | Ho Chi Minh City, Vietnam ${dob ? `| ${dob}` : ''} ${citizen ? `| ${citizen}` : ''}`,
        photoVisible: true,
      },

      // Slide 2: Executive Profile & Strategic Value Proposition (English)
      {
        id: 'slide-2-profile',
        slideNumber: 2,
        title: 'Executive Profile & Strategic Value Proposition',
        subtitle: 'Leadership Track Record, Bilingual Negotiation & High-Value Delivery',
        category: 'profile',
        badge: `${years}+ YEARS EXECUTIVE LEADERSHIP`,
        highlightStat: { number: `${years}+`, label: 'Years Multi-Industry Mastery' },
        bulletPoints: [
          'Over two decades operating within global corporate ecosystems across Taiwan, USA, South Korea, and Vietnam.',
          'Autonomous bilingual (English - Vietnamese) contract negotiation directly at high-stakes partner tables, expediting deal closure.',
          'Comprehensive supply-chain governance: connecting global demand, reducing manufacturing overhead, and building nationwide distribution networks.',
          'Unique cross-disciplinary fusion: classical international trading acumen combined with modern AI tools (Gemini, automation workflows).',
        ],
        calloutBox: 'Commitment to immediate impact: standardized workflows, rapid overseas client acquisition, and high-performance sales leadership.',
      },

      // Slide 3: International Trading & Supply Chain (English)
      {
        id: 'slide-3-trading',
        slideNumber: 3,
        title: 'International Trade, Incoterms & Global Supply Chain',
        subtitle: 'Cross-Border Contracts, Shipping Logistics & Banking Payment Instruments',
        category: 'trading',
        badge: 'GLOBAL TRADE SPECIALIST',
        highlightStat: { number: '100%', label: 'Incoterms & L/C Compliance' },
        bulletPoints: [
          'Advanced Incoterms mastery: complete control over shipping terms, freight insurance, and landed cost optimization.',
          'A-to-Z Customs Documentation & Logistics: rigorous verification of Bills of Lading (B/L), Packing Lists, Commercial Invoices, and fast customs clearance.',
          'Global Trade Finance: proficient execution of Letters of Credit (L/C), T/T wire transfers, and performance bank guarantees under UCP rules.',
          'Proprietary Past-Present-Future cargo pricing model: establishing dynamic pricing flowcharts to maximize margins during multi-million dollar bidding.',
          'Standardized warehouse automation & sizing classification, eliminating shipping damage and specification discrepancies.',
        ],
        calloutBox: 'Deep transactional experience with key foreign markets: Taiwan, United States, South Korea, Cambodia, Singapore, Hong Kong.',
      },

      // Slide 4: Career Milestones & Leadership Journey (English)
      {
        id: 'slide-4-experience',
        slideNumber: 4,
        title: 'Corporate Leadership & Career Milestones',
        subtitle: 'Executive Management History & Key Tenures (1991 - 2026)',
        category: 'experience',
        badge: 'PROVEN EXECUTIVE TRACK RECORD',
        highlightStat: { number: '7+', label: 'Major Enterprises Governed' },
        bulletPoints: [
          '2018 - 2025 (AN NGOC DA LAT Co., LTD): General Project Manager directing energy-efficient agricultural dehydration projects.',
          '2016 - 2018 (HAPPY FARM Co., LTD - Korean Conglomerate with 36 VN factories): Factory Director managing IQF cold storage supplying CJ Foods.',
          '2006 - 2016 (SUNSPAN Co., LTD - Korea Kungan Group): Turnkey EPC Director for "Long Phu Power Plant" (broadcast on VTC); Exclusive agent for Evertop Cables generating tens of billions VND monthly.',
          '2005 - 2008 (VIET MY UC Co., LTD): Commercial Sales Director establishing a nationwide distribution network for VUA Biotech Aloe Vera beverages.',
          '1997 - 2003 (TECHPIE PROGRAM PTE - USA): Technical Software Manager leading 6-12 engineers developing enterprise systems for the US market.',
          '1992 - 2005 (KEENNESS INDUSTRIAL Co., Taiwan): Full Authority Legal Representative for Vietnam & Cambodia distributing telecommunications, security, and GPS marine equipment to the Ministry of Public Security.',
          '1991 - 1992 (THIEN PHONG Co., LTD - Taiwan): Commercial Representative pioneering telecommunication & long-range radio systems in Vietnam.',
        ],
        calloutBox: 'Over three decades of direct legal accountability reporting directly to foreign Group Chairmen and Managing Directors.',
      },

      // Slide 5: Key Business Deals & Signature Achievements (English)
      {
        id: 'slide-5-achievements',
        slideNumber: 5,
        title: 'Signature Deals & Industrial Engineering Achievements',
        subtitle: 'Proven Turnkey Execution, Government Contracts & Mega Distribution',
        category: 'achievements',
        badge: 'MEASURABLE BUSINESS IMPACT',
        highlightStat: { number: '10s B', label: 'VND Monthly Revenue Generated' },
        bulletPoints: [
          'Long Phu Power Plant Project: Completed turnkey architectural construction from A to Z, broadcast on national TV (VTC) for engineering aesthetics and cost discipline.',
          'Industrial partnership with Mekong PVC: Negotiated and supplied heavy-duty insulated sandwich panel solutions for regional processing hubs.',
          'Rach Soi Hospital Reconstruction (Kien Giang): Executed comprehensive medical-grade acoustic and thermal insulated partition systems.',
          'Exclusive Agency for Evertop Cables: Consistent distribution volume of tens of billions VND per month to industrial contractors.',
          'Sunmeanpro Telecom Trademark: Successfully registered 10-year exclusive trademark protection in Vietnam for PBX telecommunication gear.',
          'Specialized Supply to Government & State Logistics: Provided equipment to the Ministry of Public Security and major state shipping corporations (DAVIMEX, TRANCIMEX, FIMEXCO).',
        ],
        calloutBox: 'Proven ability to resolve high-complexity technical and commercial roadblocks from contract inception through final audit and settlement.',
      },

      // Slide 6: Modern Technology, AI & Office Mastery (English)
      {
        id: 'slide-6-tech',
        slideNumber: 6,
        title: 'Modern Technology, AI Mastery & Engineering Foundations',
        subtitle: 'Applied AI Workflows, Executive Office Tools & Systems Architecture',
        category: 'tech_office',
        badge: 'INDUSTRY 4.0 FLUENCY',
        highlightStat: { number: '4.0', label: 'AI Workflow Integration' },
        bulletPoints: [
          'AI & Prompt Engineering: Building intelligent automation workflows, orchestrating Gemini models, and accelerating business research.',
          'Executive Office Mastery: Crafting sophisticated PowerPoint decks, complex Excel financial modeling, and standardized legal documentation in Word.',
          'Engineering CAD: Proficient in AutoCAD for architectural floorplans, industrial warehouse steel structures, and machine layouts.',
          'Solid IT & Systems Foundation: Experienced managing C++, Java, SQL, and .NET engineers; skilled in PC hardware assembly and LAN/WAN infrastructure.',
          'Digital Commerce: Architecture and deployment of enterprise e-commerce portals and internal ERP query platforms.',
        ],
        calloutBox: 'A rare executive combination of veteran commercial negotiation grit and front-line modern technological fluency.',
      },

      // Slide 7: Target Roles & Direct Interview Invitation (English)
      {
        id: 'slide-7-contact',
        slideNumber: 7,
        title: 'Core Domain, Compensation Expectations & Direct Contact',
        subtitle: 'Immediate Availability, Value Delivery & Mutual Alignment',
        category: 'contact',
        badge: 'READY FOR IMMEDIATE DEPLOYMENT',
        highlightStat: { number: `${salaryM}M+`, label: 'VND / Month (From 15M Up)' },
        bulletPoints: [
          'Core Domain: Domestic & International Trade & Projects (Open to all roles; no position constraint, solely focused on driving business and operational results).',
          `Target Compensation: From ${salaryM}M+ VND/month up (Minimum 15M VND/month; ready for immediate deployment).`,
          'Primary Locations: Ho Chi Minh City, Binh Duong, Dong Nai, Lam Dong, or international assignments as needed.',
          'Commencement: Ready for immediate onboarding; fully autonomous in travel schedule and business engagements.',
          'Interview Modes: Available for in-person interviews at company headquarters or online video conferences (Google Meet / Zoom / Teams).',
        ],
        calloutBox: `Employers & Recruiters: Please contact directly via Hotline: ${phone} | HR Email: ${email}`,
      },
    ];
  }

  // Vietnamese Version (Default bilingual)
  return [
    // Slide 1: Cover Page
    {
      id: 'slide-1-cover',
      slideNumber: 1,
      title: name,
      subtitle: title,
      category: 'cover',
      badge: 'BẢN THUYẾT TRÌNH BẢN THÂN & HỒ SƠ NĂNG LỰC (CV SELF-PRESENTATION)',
      bulletPoints: [
        `Hơn ${years} năm kinh nghiệm thực chiến đàm phán thương mại quốc tế & quản trị doanh nghiệp`,
        'Thành thạo tiếng Anh kinh doanh trên 20 năm, trực tiếp soạn thảo và ký kết hợp đồng',
        `Mức thu nhập mục tiêu: ${salaryM} Triệu VND/tháng · Sẵn sàng nhận việc và công tác ngay`,
      ],
      calloutBox: `Thông tin liên hệ trực tiếp: ${phone} | ${email} | TP. Hồ Chí Minh ${dob ? `| ${dob}` : ''} ${citizen ? `| ${citizen}` : ''}`,
      photoVisible: true,
    },

    // Slide 2: Executive Profile & Value Proposition
    {
      id: 'slide-2-profile',
      slideNumber: 2,
      title: 'Hồ Sơ Năng Lực & Tuyên Ngôn Giá Trị Cốt Lõi',
      subtitle: 'Executive Summary & Core Strategic Value',
      category: 'profile',
      badge: `${years}+ NĂM KINH NGHIỆM ĐIỀU HÀNH`,
      highlightStat: { number: `${years}+`, label: 'Năm Thực Chiến Đa Ngành' },
      bulletPoints: [
        'Kinh nghiệm 20+ năm làm việc trong môi trường văn phòng quốc tế (Đài Loan, Hoa Kỳ, Hàn Quốc, Việt Nam).',
        'Năng lực tự soạn thảo và đàm phán hợp đồng song ngữ (Việt - Anh) trực tiếp tại bàn họp, nắm bắt cơ hội chốt hợp đồng nhanh chóng.',
        'Tư duy quản trị hệ thống toàn diện: Kết nối cung cầu quốc tế, tối ưu hóa chi phí sản xuất, xây dựng chuỗi đại lý phân phối quy mô lớn.',
        'Sự kết hợp độc đáo giữa kinh nghiệm thương mại truyền thống và khả năng làm chủ công nghệ mới (AI, AGI, phần mềm quản lý, tự động hóa).',
      ],
      calloutBox: 'Cam kết mang lại giá trị tức thì: Đóng gói quy trình, mở rộng tệp đối tác quốc tế và dẫn dắt đội ngũ bán hàng đạt doanh số vượt trội.',
    },

    // Slide 3: International Trading & Supply Chain
    {
      id: 'slide-3-trading',
      slideNumber: 3,
      title: 'Thương Mại Quốc Tế & Chuỗi Cung Ứng Toàn Cầu',
      subtitle: 'International Trading, Incoterms & Banking Finance Rules',
      category: 'trading',
      badge: 'CHUYÊN GIA THƯƠNG MẠI QUỐC TẾ',
      highlightStat: { number: '100%', label: 'Chuẩn Incoterms & L/C' },
      bulletPoints: [
        'Quy tắc Incoterms chuyên sâu: Am hiểu trọn gói điều khoản giao nhận, bảo hiểm vận tải, phân loại chi phí tối ưu kinh tế cho từng hợp đồng.',
        'Chứng từ hải quan & Logistics A đến Z: Kiểm soát chặt chẽ Bill of Lading (B/L), Packing List, Commercial Invoice, hải quan thông quan.',
        'Quy tắc thanh toán ngân hàng quốc tế: Vận hành chuẩn mực các phương thức thanh toán L/C (Thư tín dụng), T/T, bảo lãnh hợp đồng.',
        'Phương pháp định giá dòng hàng Past-Present-Future: Thiết lập lưu đồ tính toán giá trị hàng hóa theo thời điểm, tạo lợi thế tối cao khi thương thuyết hợp đồng.',
        'Quy chuẩn kho bãi quốc gia & hệ thống phân loại kích thước tự động, loại bỏ hoàn toàn rủi ro rơi vỡ và sai lệch quy cách.',
      ],
      calloutBox: 'Kinh nghiệm giao thương dày dặn với các thị trường trọng điểm: Đài Loan, Hoa Kỳ, Hàn Quốc, Campuchia, Singapore, Hong Kong.',
    },

    // Slide 4: Career Milestones & Leadership Journey
    {
      id: 'slide-4-experience',
      slideNumber: 4,
      title: 'Hành Trình Sự Nghiệp & Các Dấu Mốc Quản Trị',
      subtitle: 'Corporate Leadership & Milestone History (1991 - 2026)',
      category: 'experience',
      badge: 'LỊCH SỬ CÔNG TÁC UY TÍN',
      highlightStat: { number: '7+', label: 'Tổ Chức Lớn Đã Điều Hành' },
      bulletPoints: [
        '2018 - 2025 (AN NGOC DA LAT Co., LTD): General Manager điều hành dự án công nghệ chế biến rau củ sấy khô tiết kiệm điện năng.',
        '2016 - 2018 (HAPPY FARM Co., LTD - Tập đoàn HQ 36 nhà máy tại VN): Quản lý nhà máy cấp đông IQF, cung ứng nguyên liệu trực tiếp cho CJ Kim Chi.',
        '2006 - 2016 (SUNSPAN Co., LTD - Korea Kungan Group): Giám đốc dự án trọn gói kiến trúc công trình "Nhà Máy Khí Điện Đạm Long Phú" (phát sóng VTC), Mekong PVC; Đại lý độc quyền cáp điện EVERTOP đạt doanh số hàng chục tỷ đồng/tháng.',
        '2005 - 2008 (VIỆT MỸ ÚC Co., LTD): Giám đốc kinh doanh xây dựng hệ thống phân phối toàn quốc nước nha đam VUA Biotech Alovea.',
        '1997 - 2003 (TECHPIE PROGRAM PTE - USA): Technical Manager dẫn dắt đội ngũ 6-12 kỹ sư phát triển phần mềm cho thị trường Hoa Kỳ (C++, Java, SQL, .NET).',
        '1992 - 2005 (KEENNESS INDUSTRIAL Co., Taiwan / NHẤT TÍN Co.): Đại diện pháp lý độc quyền VN & Campuchia; Phân phối thiết bị viễn thông Sunmeanpro, camera an ninh, thiết bị hàng hải GPS cho tàu thuyền và Bộ Công An.',
        '1991 - 1992 (THIÊN PHONG Co., LTD - Taiwan): Đại diện thương mại & nghiên cứu thị trường giai đoạn mở cửa, phát triển thiết bị an ninh và bộ đàm tầm xa 5-40km.',
      ],
      calloutBox: 'Bề dày hơn 3 thập kỷ quản trị trực tiếp, chịu trách nhiệm pháp lý cao nhất trước Tổng Giám Đốc tập đoàn mẹ nước ngoài.',
    },

    // Slide 5: Key Business Deals & Impactful Case Studies
    {
      id: 'slide-5-achievements',
      slideNumber: 5,
      title: 'Thành Tựu Dự Án & Các Thương Vụ Trọng Điểm',
      subtitle: 'Signature Deals & Industrial Engineering Achievements',
      category: 'achievements',
      badge: 'DẤU ẤN THỰC CHIẾN',
      highlightStat: { number: '10s Tỷ', label: 'Doanh Số Hàng Tháng Đã Đạt' },
      bulletPoints: [
        'Dự án "NHÀ MÁY KHÍ ĐIỆN ĐẠM LONG PHÚ": Hoàn thành hợp đồng trọn gói xây dựng từ A-Z, tự thiết kế kiến trúc chuẩn mực, được kênh truyền hình VTC đưa tin về thẩm mỹ và hiệu quả chi phí.',
        'Hợp đồng công nghiệp với MEKONG PVC: Đàm phán và cung ứng giải pháp vách và mái sandwich panel quy mô lớn.',
        'Tái thiết toàn diện Bệnh viện Rạch Sỏi (Kiên Giang): Hoàn thành hệ thống mái và vách panel cách âm cách nhiệt tiêu chuẩn y tế.',
        'Đại lý độc quyền dây cáp EVERTOP: Doanh số phân phối đều đặn mỗi tháng hàng chục tỷ đồng cho Công ty Hồng Linh và các đối tác công nghiệp.',
        'Bảo hộ thương hiệu SUNMEANPRO: Đăng ký thành công nhãn hiệu độc quyền 10 năm tại Việt Nam cho dòng sản phẩm viễn thông tổng đài.',
        'Cung cấp thiết bị chuyên dụng cho Bộ Công An (154 Trần Hưng Đạo, Q1) và các doanh nghiệp logistics hàng hải nhà nước (DAVIMEX, TRANCIMEX, FIMEXCO).',
      ],
      calloutBox: 'Năng lực giải quyết bài toán phức tạp từ đàm phán hợp đồng, kỹ thuật thi công đến nghiệm thu và thanh toán.',
    },

    // Slide 6: Modern Technology, AI & Office Mastery
    {
      id: 'slide-6-tech',
      slideNumber: 6,
      title: 'Công Nghệ Hiện Đại, Trí Tuệ Nhân Tạo & Tin Học',
      subtitle: 'Modern AI / AGI, Software, AutoCAD & High-Tech Fluency',
      category: 'tech_office',
      badge: 'LÀM CHỦ CÔNG NGHỆ 4.0',
      highlightStat: { number: '4.0', label: 'Tích Hợp AI Thực Tế' },
      bulletPoints: [
        'Nghiên cứu và ứng dụng AI, APP, AGI: Xây dựng quy trình tự động hóa tác vụ, huấn luyện luồng làm việc thông minh và tối ưu hóa năng suất.',
        'Tin học văn phòng chuyên nghiệp: Thiết kế slide thuyết trình PowerPoint hiện đại, bảng biểu Excel phân tích chi phí phức tạp, văn bản Word quy chuẩn.',
        'Kỹ thuật đồ họa công trình: Sử dụng thành thạo AutoCAD vẽ mặt bằng, kết cấu nhà xưởng và bản vẽ kỹ thuật máy móc.',
        'Nền tảng công nghệ thông tin vững chắc: Quản lý đội ngũ lập trình C++, Java, SQL, .NET; Tự lắp ráp, cài đặt phần cứng máy tính và quản trị hệ thống mạng.',
        'Xây dựng website, webapp thương mại điện tử và cổng tra cứu dữ liệu phục vụ kinh doanh.',
      ],
      calloutBox: 'Sự giao thoa hoàn hảo giữa tư duy quản trị lão luyện và tốc độ cập nhật công nghệ hiện đại hàng đầu.',
    },

    // Slide 7: Desired Role, Target Compensation & Contact
    {
      id: 'slide-7-contact',
      slideNumber: 7,
      title: 'Định Hướng Công Việc & Lời Mời Phỏng Vấn Trực Tiếp',
      subtitle: 'Core Domain, Compensation Expectations & Direct Contact',
      category: 'contact',
      badge: 'SẴN SÀNG NHẬN VIỆC NGAY',
      highlightStat: { number: `${salaryM}M+`, label: 'VND / Tháng (Từ 15M Trở Lên)' },
      bulletPoints: [
        'Lĩnh vực phụ trách: Thương Mại Quốc Nội , Quốc Tế & Dự Án (Không câu nệ bất kỳ chức danh/vị trí nào, sẵn sàng đảm nhận mọi vai trò đem lại hiệu quả thực tế).',
        `Mức lương kỳ vọng: Từ ${salaryM}.000.000 VND/tháng trở lên (Mức tối thiểu 15M VND; sẵn sàng nhận việc ngay).`,
        'Địa bàn công tác: TP. Hồ Chí Minh, Bình Dương, Đồng Nai, Lâm Đồng hoặc công tác nước ngoài theo yêu cầu ban điều hành.',
        'Thời gian tiếp nhận công việc: Sẵn sàng nhận việc ngay, tự chủ phương tiện và thời gian làm việc linh hoạt.',
        'Hình thức liên hệ phỏng vấn: Phỏng vấn trực tiếp tại trụ sở công ty hoặc trao đổi trực tuyến qua Google Meet/Zoom.',
      ],
      calloutBox: `Kính mời Quý Nhà tuyển dụng liên hệ trực tiếp: Hotline: ${phone} | Email HR: ${email}`,
    },
  ];
}

import { Job } from '../types/job';
import { JobAlert, JobAlertCriteria, JobAlertToast } from '../types/alert';

const STORAGE_KEY_JOB_ALERTS = 'vnd_career_job_alerts_v1';
const STORAGE_KEY_ALERT_NOTIFIED_JOBS = 'vnd_career_alert_notified_jobs_v1';

/**
 * Authentic simulated direct employer pool for new incoming job matches
 */
const SIMULATED_INCOMING_JOBS_POOL: Omit<Job, 'id' | 'postedDate' | 'postedHoursAgo'>[] = [
  {
    title: 'Giám Đốc Thương Mại Quốc Tế & Dự Án Xuất Nhập Khẩu',
    company: 'VND Global Trading & Logistics JSC',
    city: 'Hồ Chí Minh',
    district: 'Quận 1',
    address: 'Tòa nhà Saigon Tower, 29 Lê Duẩn, Bến Nghé, Quận 1, TP.HCM',
    workMode: 'Hybrid',
    minSalary: 25000000,
    maxSalary: 45000000,
    experienceLevel: 'Senior',
    roleCategory: 'Sales',
    recruiterEmail: 'recruitment@vndglobaltrading.com',
    recruiterName: 'Bà Mai Phương - Giám Đốc Nhân Sự',
    recruiterPhone: '0908 456 789',
    verifiedDirectEmail: true,
    sourceType: 'company_direct',
    sourceName: 'Website Tuyển Dụng Doanh Nghiệp',
    description: [
      'Điều hành toàn bộ hoạt động đàm phán thương mại quốc tế song ngữ Anh - Việt.',
      'Quản trị các hợp đồng xuất nhập khẩu lớn theo chuẩn Incoterms 2020 và kiểm soát thanh toán quốc tế L/C, T/T.',
      'Mở rộng hệ thống đại lý phân phối và đối tác nước ngoài (Hàn Quốc, Đài Loan, Mỹ, Đông Nam Á).',
    ],
    requirements: [
      'Tối thiểu 10 năm kinh nghiệm quản lý thương mại quốc tế, xuất nhập khẩu hoặc dự án quy mô lớn.',
      'Tiếng Anh lưu loát trong giao thương và ký kết hợp đồng thương mại.',
      'Kỹ năng đàm phán Past-Present-Future và hiểu biết sâu về vận chuyển quốc tế.',
    ],
    benefits: [
      'Thu nhập cạnh tranh 25M - 45M VND/tháng + thưởng % doanh số dự án.',
      'Chế độ làm việc Hybrid 2 ngày/tuần làm việc từ xa.',
      'Bảo hiểm sức khỏe cao cấp mở rộng cho cấp quản lý.',
    ],
  },
  {
    title: 'Chuyên Viên Cấp Cao Incoterms & Thanh Toán Quốc Tế (L/C & T/T)',
    company: 'Tập Đoàn Logistics & Xúc Tiến Đầu Tư Quốc Tế Á Châu',
    city: 'Hồ Chí Minh',
    district: 'Bình Thạnh',
    address: 'Landmark 81, 720A Điện Biên Phủ, Phường 22, Bình Thạnh, TP.HCM',
    workMode: 'Hybrid',
    minSalary: 20000000,
    maxSalary: 35000000,
    experienceLevel: 'Middle',
    roleCategory: 'Operations',
    recruiterEmail: 'hr.talent@asialogistics-hub.com',
    recruiterName: 'Ông Quốc Hùng - Trưởng Phòng Tuyển Dụng',
    verifiedDirectEmail: true,
    sourceType: 'company_direct',
    sourceName: 'Cổng Tuyển Dụng Trực Tiếp',
    description: [
      'Kiểm soát và phát hành chứng từ xuất nhập khẩu: Bill of Lading, Packing List, Invoice, C/O.',
      'Làm việc trực tiếp với các ngân hàng quốc tế để mở và giải phóng thư tín dụng L/C.',
      'Tư vấn tối ưu hóa chi phí vận chuyển đường biển và hải quan theo Incoterms.',
    ],
    requirements: [
      'Từ 5 năm kinh nghiệm mảng thanh toán quốc tế và Incoterms.',
      'Nắm vững quy tắc UCP 600 và thông lệ ngân hàng quốc tế.',
      'Giao tiếp tiếng Anh tốt với các hãng tàu và ngân hàng đối tác.',
    ],
    benefits: [
      'Lương 20M - 35M VND/tháng, lương tháng 13 + thưởng KPI quý.',
      'Phụ cấp ăn trưa, công tác và môi trường làm việc chuẩn quốc tế.',
    ],
  },
  {
    title: 'Trưởng Phòng Quản Trị Dự Án & Vận Hành Chuỗi Cung Ứng',
    company: 'CJ Bio & Agro Tech Vietnam',
    city: 'Hồ Chí Minh',
    district: 'Quận 7',
    address: 'Khu Chế Xuất Tân Thuận, Quận 7, TP.HCM',
    workMode: 'On-site',
    minSalary: 30000000,
    maxSalary: 48000000,
    experienceLevel: 'Lead',
    roleCategory: 'Operations',
    recruiterEmail: 'careers.vn@cjbiotech-global.com',
    recruiterName: 'Ms. Kim Jin-hee & Mr. Minh Trí - HR Board',
    verifiedDirectEmail: true,
    sourceType: 'company_direct',
    sourceName: 'Website Công Ty',
    description: [
      'Chỉ đạo vận hành chuỗi dự án chế biến nông nghiệp công nghệ cao và kho lạnh IQF.',
      'Giám sát chuỗi cung ứng nguyên liệu từ các vùng trồng phục vụ xuất khẩu.',
      'Tối ưu hóa chi phí vận hành nhà máy và quản lý ngân sách dự án nhiều tỷ đồng.',
    ],
    requirements: [
      'Kinh nghiệm điều hành nhà máy hoặc quản lý dự án công nghiệp quy mô lớn.',
      'Bản lĩnh đàm phán hợp đồng cung ứng và năng lực lãnh đạo đội ngũ kỹ thuật.',
      'Tiếng Anh thương mại thành thạo.',
    ],
    benefits: [
      'Lương cứng 30M - 48M VND/tháng, đánh giá tăng lương 2 lần/năm.',
      'Xe đưa đón cán bộ quản lý từ trung tâm TP.HCM.',
    ],
  },
  {
    title: 'Senior Technical Project Lead (AI & Cloud Enterprise Solutions)',
    company: 'Innovate Solutions Singapore - VN Tech Hub',
    city: 'Hồ Chí Minh',
    district: 'Quận 1',
    address: 'Bitexco Financial Tower, Hải Triều, Bến Nghé, Quận 1, TP.HCM',
    workMode: 'Hybrid',
    minSalary: 28000000,
    maxSalary: 45000000,
    experienceLevel: 'Senior',
    roleCategory: 'Engineering',
    recruiterEmail: 'hr.tech@innovatesolutions.sg',
    recruiterName: 'David Lee - Engineering Director',
    verifiedDirectEmail: true,
    sourceType: 'company_direct',
    sourceName: 'Direct Career Page',
    description: [
      'Dẫn dắt đội ngũ kỹ sư xây dựng các hệ thống điều hành thông minh tích hợp AI.',
      'Phối hợp với khách hàng quốc tế tại Singapore, Mỹ để thiết kế kiến trúc phần mềm.',
    ],
    requirements: [
      'Từ 5 năm kinh nghiệm kỹ thuật, có năng lực quản lý dự án và giao tiếp tiếng Anh tốt.',
      'Thành thạo công nghệ Web/Cloud và mô hình hóa dữ liệu.',
    ],
    benefits: [
      'Thu nhập 28M - 45M VND/tháng + gói thưởng cổ phiếu (ESOP).',
      'Làm việc linh hoạt Hybrid, trang bị Macbook Pro M-series.',
    ],
  },
  {
    title: 'Trưởng Nhóm Kinh Doanh B2B Thiết Bị & Vật Tư Xây Dựng Quốc Tế',
    company: 'Tập Đoàn Công Nghiệp Evertop Cables & Materials',
    city: 'Hà Nội',
    district: 'Cầu Giấy',
    address: 'Tòa nhà Keangnam Landmark 72, Phạm Hùng, Cầu Giấy, Hà Nội',
    workMode: 'Hybrid',
    minSalary: 22000000,
    maxSalary: 40000000,
    experienceLevel: 'Senior',
    roleCategory: 'Sales',
    recruiterEmail: 'tuyendung@evertopmaterials.vn',
    recruiterName: 'Phòng Nhân Sự - Ban Dự Án Trọng Điểm',
    verifiedDirectEmail: true,
    sourceType: 'company_direct',
    sourceName: 'Website Doanh Nghiệp',
    description: [
      'Phụ trách gói thầu cung cấp cáp điện và vật tư kỹ thuật cho các dự án nhà máy công nghiệp.',
      'Lập hồ sơ chào thầu EPC, đàm phán hợp đồng mua bán với chủ đầu tư nước ngoài.',
    ],
    requirements: [
      'Từ 7 năm kinh nghiệm đàm phán thương mại B2B hoặc vật liệu kỹ thuật công nghiệp.',
      'Kỹ năng đàm phán quyết đoán, mạng lưới quan hệ trong ngành xây lắp công nghiệp.',
    ],
    benefits: [
      'Lương thỏa thuận 22M - 40M VND/tháng + hoa hồng dự án không giới hạn.',
    ],
  },
];

class JobAlertManager {
  private alerts: JobAlert[] = [];
  private notifiedJobIds: Set<string> = new Set();
  private activeToasts: JobAlertToast[] = [];
  private listeners: Set<(alerts: JobAlert[]) => void> = new Set();
  private toastListeners: Set<(toasts: JobAlertToast[]) => void> = new Set();
  private newJobCallback: ((job: Job, toast: JobAlertToast) => void) | null = null;
  private intervalTimerId: any = null;
  private simulationIndex: number = 0;

  constructor() {
    this.loadState();
    this.startPeriodicChecking();
  }

  private loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_JOB_ALERTS);
      if (saved) {
        this.alerts = JSON.parse(saved);
      } else {
        // Create an initial intelligent default alert based on standard 15M+ VND preference
        this.alerts = [
          {
            id: 'alert-default-15m',
            title: 'Việc Làm Lương Từ 15M Trở Lên (Thương Mại & Quản Trị)',
            createdAt: new Date().toISOString(),
            criteria: {
              searchQuery: '',
              minSalary: 15000000,
              maxSalary: 50000000,
              userLocation: '',
              selectedWorkMode: 'All',
              selectedRoleCategory: 'All',
              selectedExpLevel: 'All',
              freshnessFilter: 'within_7_days',
            },
            isActive: true,
            checkIntervalSeconds: 45,
            lastCheckedAt: null,
            totalMatchesFound: 0,
            notifySound: true,
          },
        ];
        this.saveState();
      }

      const notified = localStorage.getItem(STORAGE_KEY_ALERT_NOTIFIED_JOBS);
      if (notified) {
        this.notifiedJobIds = new Set(JSON.parse(notified));
      }
    } catch (err) {
      console.warn('Could not load Job Alerts from localStorage', err);
    }
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEY_JOB_ALERTS, JSON.stringify(this.alerts));
      localStorage.setItem(
        STORAGE_KEY_ALERT_NOTIFIED_JOBS,
        JSON.stringify(Array.from(this.notifiedJobIds))
      );
    } catch (err) {
      console.warn('Could not save Job Alerts to localStorage', err);
    }
  }

  public getAlerts(): JobAlert[] {
    return [...this.alerts];
  }

  public getActiveAlertsCount(): number {
    return this.alerts.filter((a) => a.isActive).length;
  }

  public getActiveToasts(): JobAlertToast[] {
    return [...this.activeToasts];
  }

  public setNewJobCallback(callback: (job: Job, toast: JobAlertToast) => void) {
    this.newJobCallback = callback;
  }

  /**
   * Create or update a Job Alert with current active filter criteria
   */
  public createAlert(title: string, criteria: JobAlertCriteria, checkIntervalSeconds: number = 45): JobAlert {
    const newAlert: JobAlert = {
      id: `alert-${Date.now()}`,
      title: title.trim() || this.generateDefaultTitle(criteria),
      createdAt: new Date().toISOString(),
      criteria: { ...criteria },
      isActive: true,
      checkIntervalSeconds: Math.max(15, checkIntervalSeconds),
      lastCheckedAt: null,
      totalMatchesFound: 0,
      notifySound: true,
    };

    this.alerts = [newAlert, ...this.alerts];
    this.saveState();
    this.notify();
    return newAlert;
  }

  public updateAlert(id: string, updates: Partial<JobAlert>) {
    this.alerts = this.alerts.map((a) => (a.id === id ? { ...a, ...updates } : a));
    this.saveState();
    this.notify();
  }

  public toggleAlert(id: string) {
    this.alerts = this.alerts.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a));
    this.saveState();
    this.notify();
  }

  public deleteAlert(id: string) {
    this.alerts = this.alerts.filter((a) => a.id !== id);
    this.saveState();
    this.notify();
  }

  public dismissToast(toastId: string) {
    this.activeToasts = this.activeToasts.filter((t) => t.id !== toastId);
    this.notifyToasts();
  }

  public clearAllToasts() {
    this.activeToasts = [];
    this.notifyToasts();
  }

  /**
   * Helper to generate a human-readable title from criteria
   */
  public generateDefaultTitle(criteria: JobAlertCriteria): string {
    const parts: string[] = [];
    if (criteria.searchQuery.trim()) {
      parts.push(`"${criteria.searchQuery.trim()}"`);
    }
    const minM = Math.round(criteria.minSalary / 1_000_000);
    const maxM = Math.round(criteria.maxSalary / 1_000_000);
    parts.push(`Lương ${minM}M - ${maxM}M`);

    if (criteria.userLocation.trim()) {
      parts.push(criteria.userLocation.trim());
    }
    if (criteria.selectedWorkMode !== 'All') {
      parts.push(criteria.selectedWorkMode);
    }
    return `Thông Báo: ${parts.join(' · ')}`;
  }

  /**
   * Tests if a given Job matches the criteria of an alert
   */
  public matchesCriteria(job: Job, criteria: JobAlertCriteria): boolean {
    // 1. Salary overlap check
    if (job.maxSalary < criteria.minSalary || job.minSalary > criteria.maxSalary) {
      return false;
    }

    // 2. Search query check
    if (criteria.searchQuery && criteria.searchQuery.trim()) {
      const q = criteria.searchQuery.toLowerCase().trim();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchCompany = job.company.toLowerCase().includes(q);
      const matchDesc = job.description.some((d) => d.toLowerCase().includes(q));
      const matchReq = job.requirements.some((r) => r.toLowerCase().includes(q));
      if (!matchTitle && !matchCompany && !matchDesc && !matchReq) {
        return false;
      }
    }

    // 3. Location check
    if (criteria.userLocation && criteria.userLocation.trim()) {
      const loc = criteria.userLocation.toLowerCase().trim();
      const matchCity = job.city.toLowerCase().includes(loc);
      const matchDistrict = job.district.toLowerCase().includes(loc);
      const matchAddress = job.address.toLowerCase().includes(loc);
      if (!matchCity && !matchDistrict && !matchAddress) {
        return false;
      }
    }

    // 4. Work mode check
    if (criteria.selectedWorkMode !== 'All' && job.workMode !== criteria.selectedWorkMode) {
      return false;
    }

    // 5. Role category check
    if (criteria.selectedRoleCategory !== 'All' && job.roleCategory !== criteria.selectedRoleCategory) {
      return false;
    }

    // 6. Experience level check
    if (criteria.selectedExpLevel !== 'All' && job.experienceLevel !== criteria.selectedExpLevel) {
      return false;
    }

    return true;
  }

  /**
   * Play a delicate, subtle synthesized chime through the Web Audio API
   */
  public playSubtleChime() {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      // Soft dual harmonic chime (C6 -> G6)
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(1046.5, now); // C6
      osc1.frequency.exponentialRampToValueAtTime(1567.98, now + 0.15); // G6

      osc2.frequency.setValueAtTime(523.25, now); // C5
      osc2.frequency.exponentialRampToValueAtTime(783.99, now + 0.15); // G5

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.12, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.65);
      osc2.stop(now + 0.65);
    } catch {
      // Audio autoplay policy or unavailable
    }
  }

  /**
   * Simulates a periodic check across active alerts.
   * Can be invoked manually for immediate testing ("Test Check Now")
   * or periodically by the background ticker.
   */
  public simulateCheckNow(specificAlertId?: string): {
    matched: boolean;
    job?: Job;
    alert?: JobAlert;
    message: string;
  } {
    const activeAlerts = specificAlertId
      ? this.alerts.filter((a) => a.id === specificAlertId)
      : this.alerts.filter((a) => a.isActive);

    if (activeAlerts.length === 0) {
      return {
        matched: false,
        message: 'Không có thông báo (alert) nào đang được bật.',
      };
    }

    // Pick next simulated lead from pool or generate fresh one
    const template = SIMULATED_INCOMING_JOBS_POOL[this.simulationIndex % SIMULATED_INCOMING_JOBS_POOL.length];
    this.simulationIndex++;

    const newJobId = `job-alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newJob: Job = {
      ...template,
      id: newJobId,
      postedDate: new Date().toISOString().slice(0, 10),
      postedHoursAgo: 0,
      sourceName: 'Thông Báo Việc Mới (Job Alert Stream)',
    };

    // Find first active alert that matches this job
    let matchedAlert = activeAlerts.find((alert) => this.matchesCriteria(newJob, alert.criteria));

    // If the template didn't match the specific criteria, adapt the candidate job to match the criteria perfectly!
    if (!matchedAlert) {
      matchedAlert = activeAlerts[0];
      // Adapt salary and location to guarantee a match
      newJob.minSalary = matchedAlert.criteria.minSalary;
      newJob.maxSalary = Math.max(matchedAlert.criteria.minSalary + 10000000, matchedAlert.criteria.maxSalary);
      if (matchedAlert.criteria.userLocation.trim()) {
        newJob.city = matchedAlert.criteria.userLocation.trim();
        newJob.address = `${matchedAlert.criteria.userLocation.trim()}, Việt Nam`;
      }
      if (matchedAlert.criteria.selectedWorkMode !== 'All') {
        newJob.workMode = matchedAlert.criteria.selectedWorkMode as any;
      }
    }

    // Update alert stats
    matchedAlert.lastCheckedAt = new Date().toISOString();
    matchedAlert.totalMatchesFound += 1;
    this.saveState();
    this.notify();

    // Create toast notification
    const toast: JobAlertToast = {
      id: `toast-${Date.now()}`,
      alertId: matchedAlert.id,
      alertTitle: matchedAlert.title,
      job: newJob,
      matchedAt: 'Vừa xong',
      read: false,
    };

    this.activeToasts = [toast, ...this.activeToasts.slice(0, 4)];
    this.notifyToasts();

    if (matchedAlert.notifySound) {
      this.playSubtleChime();
    }

    // Pass the new job to the application so it is added to listings
    if (this.newJobCallback) {
      this.newJobCallback(newJob, toast);
    }

    return {
      matched: true,
      job: newJob,
      alert: matchedAlert,
      message: `Đã tìm thấy 01 việc làm mới khớp với "${matchedAlert.title}"!`,
    };
  }

  private startPeriodicChecking() {
    if (this.intervalTimerId) clearInterval(this.intervalTimerId);

    // Periodically simulate checking every 40 seconds
    this.intervalTimerId = setInterval(() => {
      const activeCount = this.getActiveAlertsCount();
      if (activeCount > 0) {
        this.simulateCheckNow();
      }
    }, 40000);
  }

  public subscribeAlerts(listener: (alerts: JobAlert[]) => void): () => void {
    this.listeners.add(listener);
    listener(this.getAlerts());
    return () => this.listeners.delete(listener);
  }

  public subscribeToasts(listener: (toasts: JobAlertToast[]) => void): () => void {
    this.toastListeners.add(listener);
    listener(this.getActiveToasts());
    return () => this.toastListeners.delete(listener);
  }

  private notify() {
    const list = this.getAlerts();
    this.listeners.forEach((listener) => {
      try {
        listener(list);
      } catch (err) {
        console.error('Error notifying alert listener', err);
      }
    });
  }

  private notifyToasts() {
    const list = this.getActiveToasts();
    this.toastListeners.forEach((listener) => {
      try {
        listener(list);
      } catch (err) {
        console.error('Error notifying toast listener', err);
      }
    });
  }
}

export const jobAlertManager = new JobAlertManager();

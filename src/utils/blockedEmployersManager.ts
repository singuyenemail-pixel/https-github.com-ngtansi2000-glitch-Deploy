import { Job } from '../types/job';

export interface BlockedEmployer {
  id: string;
  company: string; // e.g. "VND Global Trading"
  normalizedCompany: string; // lowercased & trimmed
  recruiterEmail?: string;
  emailDomain?: string;
  blockedJobTitle?: string;
  blockedAt: string;
  reason: string;
  suppressedCount: number;
}

const STORAGE_KEY_BLOCKED = 'vnd_career_blocked_employers_v1';

class BlockedEmployersManager {
  private blockedList: BlockedEmployer[] = [];
  private listeners: Set<(list: BlockedEmployer[]) => void> = new Set();

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BLOCKED);
      if (saved) {
        this.blockedList = JSON.parse(saved);
      }
    } catch (err) {
      console.warn('Could not load blocked employers list', err);
    }
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEY_BLOCKED, JSON.stringify(this.blockedList));
    } catch (err) {
      console.warn('Could not save blocked employers list', err);
    }
  }

  public getBlockedList(): BlockedEmployer[] {
    return [...this.blockedList];
  }

  public getBlockedCount(): number {
    return this.blockedList.length;
  }

  /**
   * Block a specific employer and ensure no similar results are received.
   */
  public blockEmployer(
    job: Job,
    reason = 'Người dùng xóa kết quả và yêu cầu không nhận các vị trí tương tự từ nhà tuyển dụng này'
  ): BlockedEmployer {
    const normCompany = (job.company || '').toLowerCase().trim();
    const email = (job.recruiterEmail || '').toLowerCase().trim();
    let domain = '';
    if (email.includes('@')) {
      domain = email.split('@')[1];
    }

    // Check if already blocked
    const existingIndex = this.blockedList.findIndex(
      (b) =>
        b.normalizedCompany === normCompany ||
        (domain && b.emailDomain && b.emailDomain === domain && !['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'].includes(domain))
    );

    let record: BlockedEmployer;

    if (existingIndex >= 0) {
      record = {
        ...this.blockedList[existingIndex],
        suppressedCount: this.blockedList[existingIndex].suppressedCount + 1,
        blockedAt: new Date().toISOString(),
      };
      this.blockedList[existingIndex] = record;
    } else {
      record = {
        id: `blocked-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        company: job.company,
        normalizedCompany: normCompany,
        recruiterEmail: job.recruiterEmail,
        emailDomain: domain,
        blockedJobTitle: job.title,
        blockedAt: new Date().toISOString(),
        reason,
        suppressedCount: 1,
      };
      this.blockedList = [record, ...this.blockedList];
    }

    this.saveState();
    this.notify();
    return record;
  }

  /**
   * Unblock an employer rule by ID or company name
   */
  public unblockEmployer(idOrCompany: string): boolean {
    const prevLen = this.blockedList.length;
    const norm = idOrCompany.toLowerCase().trim();
    this.blockedList = this.blockedList.filter(
      (b) => b.id !== idOrCompany && b.normalizedCompany !== norm
    );

    if (this.blockedList.length !== prevLen) {
      this.saveState();
      this.notify();
      return true;
    }
    return false;
  }

  /**
   * Clear all blocked employers
   */
  public clearAllBlocked() {
    this.blockedList = [];
    this.saveState();
    this.notify();
  }

  /**
   * Check if a given job matches any blocked employer or criteria
   */
  public isJobBlocked(job: Job): boolean {
    if (this.blockedList.length === 0) return false;

    const normComp = (job.company || '').toLowerCase().trim();
    const email = (job.recruiterEmail || '').toLowerCase().trim();
    let domain = '';
    if (email.includes('@')) {
      domain = email.split('@')[1];
    }

    return this.blockedList.some((blocked) => {
      // 1. Direct company name match
      if (blocked.normalizedCompany && normComp) {
        if (normComp === blocked.normalizedCompany) return true;
        if (normComp.includes(blocked.normalizedCompany) || blocked.normalizedCompany.includes(normComp)) {
          // If lengths are relatively close
          if (Math.abs(normComp.length - blocked.normalizedCompany.length) < 8) {
            return true;
          }
        }
      }

      // 2. Direct recruiter email match
      if (blocked.recruiterEmail && email && blocked.recruiterEmail.toLowerCase() === email) {
        return true;
      }

      // 3. Domain match (excluding public providers like gmail.com)
      if (
        blocked.emailDomain &&
        domain &&
        blocked.emailDomain === domain &&
        !['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'].includes(domain)
      ) {
        return true;
      }

      return false;
    });
  }

  /**
   * Filters out all jobs from blocked employers
   */
  public filterJobs(jobs: Job[]): Job[] {
    if (this.blockedList.length === 0) return jobs;
    return jobs.filter((job) => !this.isJobBlocked(job));
  }

  public subscribe(listener: (list: BlockedEmployer[]) => void): () => void {
    this.listeners.add(listener);
    listener(this.getBlockedList());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const list = this.getBlockedList();
    this.listeners.forEach((listener) => {
      try {
        listener(list);
      } catch (err) {
        console.error('Error notifying blocked employer listener', err);
      }
    });
  }
}

export const blockedEmployersManager = new BlockedEmployersManager();

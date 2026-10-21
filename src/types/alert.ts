import { Job } from './job';

export interface JobAlertCriteria {
  searchQuery: string;
  minSalary: number;
  maxSalary: number;
  userLocation: string;
  selectedWorkMode: string;
  selectedRoleCategory: string;
  selectedExpLevel: string;
  freshnessFilter: string;
}

export interface JobAlert {
  id: string;
  title: string;
  createdAt: string;
  criteria: JobAlertCriteria;
  isActive: boolean;
  checkIntervalSeconds: number; // e.g. 45 seconds simulated periodic check
  lastCheckedAt: string | null;
  totalMatchesFound: number;
  notifySound: boolean;
}

export interface JobAlertToast {
  id: string;
  alertId: string;
  alertTitle: string;
  job: Job;
  matchedAt: string;
  read: boolean;
}

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Mail,
  Building2,
  Briefcase,
  MapPin,
  Bookmark,
  ChevronDown,
  Layers,
  ArrowRight,
  CheckCircle2,
  Bell,
  X,
  Key,
} from 'lucide-react';
import { Job, CandidateProfile, ApplicationRecord, FilterState } from './types/job';
import { INITIAL_JOBS } from './data/mockJobs';
import { DEEP_SEARCH_HARVESTED_JOBS } from './data/deepSearchJobs';
import { Header } from './components/Header';
import { CvUploadBar } from './components/CvUploadBar';
import { SalarySlider } from './components/SalarySlider';
import { LocationFilter } from './components/LocationFilter';
import { JobCard } from './components/JobCard';
import { ApplyModal } from './components/ApplyModal';
import { JobDetailModal } from './components/JobDetailModal';
import { CvDetailModal } from './components/CvDetailModal';
import { ApplicationsDrawer } from './components/ApplicationsDrawer';
import { AddJobModal } from './components/AddJobModal';
import { DeepSearchHarvesterModal } from './components/DeepSearchHarvesterModal';
import { CvStrengthModal } from './components/CvStrengthModal';
import { PresentationDeckModal } from './components/PresentationDeckModal';
import { CoverPagePrintModal } from './components/CoverPagePrintModal';
import { ApiKeyQuotaModal } from './components/ApiKeyQuotaModal';
import { EmailTemplatesModal } from './components/EmailTemplatesModal';
import { SetAlertModal } from './components/SetAlertModal';
import { AlertToastNotification } from './components/AlertToastNotification';
import { DismissJobModal } from './components/DismissJobModal';
import { BlockedEmployersModal } from './components/BlockedEmployersModal';
import { EmailTemplate } from './types/emailTemplate';
import { JobAlertCriteria, JobAlertToast } from './types/alert';
import { loadStoredEmailTemplates, saveStoredEmailTemplates, resetEmailTemplatesToDefault } from './utils/templateStorage';
import { SIMON_NGUYEN_PROFILE } from './data/simonNguyenCv';
import { formatSalaryMillion, isWithinDays, getDaysAgo } from './utils/formatters';
import { calculateJobMatchScore, MatchResult } from './utils/matchScore';
import { analyzeCvStrength } from './utils/cvAnalyzer';
import { jobAlertManager } from './utils/jobAlertManager';
import { aiQuotaManager, QuotaState } from './utils/aiQuotaManager';
import { enrichJobWithCategoryAndExperience } from './utils/dataCleaner';
import { blockedEmployersManager, BlockedEmployer } from './utils/blockedEmployersManager';



const STORAGE_KEY_PROFILE = 'vnd_career_candidate_profile_v1';
const STORAGE_KEY_APPLICATIONS = 'vnd_career_applications_v1';
const STORAGE_KEY_SAVED_JOBS = 'vnd_career_saved_jobs_v1';
const STORAGE_KEY_CUSTOM_JOBS = 'vnd_career_custom_jobs_v1';

const DEFAULT_DEMO_PROFILE: CandidateProfile = {
  fullName: 'SIMON NGUYEN (NGUYỄN TẤN SĨ)',
  email: 'singuyenemail@gmail.com',
  phone: 'Zalo/Whatsapp 0702499445',
  currentTitle: 'Thương Mại Quốc Nội , Quốc Tế & Dự Án',
  experienceYears: 30,
  skills: [
    'Thương Mại Quốc Nội & Phân Phối Toàn Quốc',
    'International Trading & Incoterms',
    'Logistics & Import-Export Customs (B/L, Packing List, Invoice)',
    'Banking Rules & International Payment (L/C, T/T)',
    'Contract Negotiation & Cross-Border Deals',
    'Factory Operations & Industrial Supply Chain',
    'Bilingual English (20+ Years Fluent Business Environment)',
    'Technology & AI Application (AGI, Web/App, AutoCAD, Hardware)',
  ],
  targetSalaryVnd: 15000000, // 15M VND up (từ 15 triệu trở lên)
  cvFileName: 'CV_2026 .pdf',
  cvFileSize: '860 KB',
  cvUploadedAt: 'Hôm nay',
  portfolioUrl: 'https://ais-dev-dawqdwficdmsmszh6smo7x-129131152593.asia-southeast1.run.app',
};

const EMPTY_PROFILE: CandidateProfile = {
  fullName: '',
  email: 'singuyenemail@gmail.com',
  phone: 'Zalo/Whatsapp 0702499445',
  currentTitle: 'Thương Mại Quốc Nội , Quốc Tế & Dự Án',
  experienceYears: 2,
  skills: ['Kỹ năng chuyên môn'],
  targetSalaryVnd: 15000000,
  cvFileName: null,
};

export default function App() {
  // Candidate Profile State
  const [profile, setProfile] = useState<CandidateProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.phone || parsed.phone === '0908 789 654' || parsed.phone === '0903 991 179') {
          parsed.phone = 'Zalo/Whatsapp 0702499445';
        }
        if (!parsed.email || parsed.email === 'thanhnam.engineer@gmail.com') {
          parsed.email = 'singuyenemail@gmail.com';
        }
        if (!parsed.currentTitle || parsed.currentTitle.includes('Giám Đốc')) {
          parsed.currentTitle = 'Thương Mại Quốc Nội , Quốc Tế & Dự Án';
        }
        if (!parsed.targetSalaryVnd || parsed.targetSalaryVnd === 45000000) {
          parsed.targetSalaryVnd = 15000000;
        }
        return parsed;
      }
      return DEFAULT_DEMO_PROFILE;
    } catch {
      return DEFAULT_DEMO_PROFILE;
    }
  });

  // Jobs State (built-in + user added)
  const [jobs, setJobs] = useState<Job[]>(() => {
    try {
      const custom = localStorage.getItem(STORAGE_KEY_CUSTOM_JOBS);
      if (custom) {
        const parsed = JSON.parse(custom);
        return [...parsed, ...INITIAL_JOBS];
      }
    } catch {
      // fallback
    }
    return INITIAL_JOBS;
  });

  // Saved Jobs Bookmarks
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED_JOBS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Applied Applications History
  const [applications, setApplications] = useState<ApplicationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_APPLICATIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Independent Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [minSalary, setMinSalary] = useState(15000000); // Refined: 15M VND up
  const [maxSalary, setMaxSalary] = useState(50000000); // 50M VND
  const [userLocation, setUserLocation] = useState('');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All');
  const [selectedRoleCategory, setSelectedRoleCategory] = useState<string>('All');
  const [selectedExpLevel, setSelectedExpLevel] = useState<string>('All');
  const [freshnessFilter, setFreshnessFilter] = useState<'within_7_days' | 'within_24h' | 'within_3_days' | 'all'>('within_7_days');
  const [sortBy, setSortBy] = useState<'match_desc' | 'date_desc' | 'salary_desc' | 'salary_asc'>('match_desc');

  // Modals & Drawers
  const [activeTab, setActiveTab] = useState<'jobs' | 'applied'>('jobs');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<Job | null>(null);
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [isDeepSearchModalOpen, setIsDeepSearchModalOpen] = useState(false);
  const [isCvStrengthModalOpen, setIsCvStrengthModalOpen] = useState(false);
  const [isPresentationModalOpen, setIsPresentationModalOpen] = useState(false);
  const [isCoverPagePrintOpen, setIsCoverPagePrintOpen] = useState(false);
  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState(false);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(loadStoredEmailTemplates);
  const [isEmailTemplatesModalOpen, setIsEmailTemplatesModalOpen] = useState(false);
  const [isSetAlertModalOpen, setIsSetAlertModalOpen] = useState(false);
  const [alertToasts, setAlertToasts] = useState<JobAlertToast[]>(() => jobAlertManager.getActiveToasts());
  const [activeAlertsCount, setActiveAlertsCount] = useState<number>(() => jobAlertManager.getActiveAlertsCount());
  const [bookmarkToast, setBookmarkToast] = useState<{
    show: boolean;
    jobTitle: string;
    company: string;
  } | null>(null);
  const [quotaState, setQuotaState] = useState<QuotaState>(() => aiQuotaManager.getState());

  // Dismiss & Block Employers State (Xóa kết quả & không nhận kết quả tương tự)
  const [jobToDismiss, setJobToDismiss] = useState<Job | null>(null);
  const [isDismissModalOpen, setIsDismissModalOpen] = useState(false);
  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);
  const [blockedEmployers, setBlockedEmployers] = useState<BlockedEmployer[]>(() =>
    blockedEmployersManager.getBlockedList()
  );
  const [dismissToast, setDismissToast] = useState<{
    show: boolean;
    message: string;
  } | null>(null);

  // Subscribe to Blocked Employers updates
  useEffect(() => {
    return blockedEmployersManager.subscribe((list) => {
      setBlockedEmployers(list);
    });
  }, []);

  const handleOpenDismissJob = (job: Job) => {
    setJobToDismiss(job);
    setIsDismissModalOpen(true);
  };

  const handleConfirmDismissJob = (job: Job, blockEmployer: boolean) => {
    if (blockEmployer) {
      blockedEmployersManager.blockEmployer(job);
    }
    setJobs((prev) => prev.filter((j) => j.id !== job.id));
    setSavedJobIds((prev) => prev.filter((id) => id !== job.id));

    setDismissToast({
      show: true,
      message: blockEmployer
        ? `Đã xóa việc làm và cập nhật dữ liệu để KHÔNG NHẬN các kết quả tương tự từ ${job.company}!`
        : `Đã xóa việc làm "${job.title}" khỏi danh sách!`,
    });
    setTimeout(() => {
      setDismissToast(null);
    }, 4500);
  };

  // Subscribe to Job Alert manager updates and incoming toast notifications
  useEffect(() => {
    const unsubAlerts = jobAlertManager.subscribeAlerts((alerts) => {
      setActiveAlertsCount(alerts.filter((a) => a.isActive).length);
    });
    const unsubToasts = jobAlertManager.subscribeToasts((toasts) => {
      setAlertToasts(toasts);
    });

    jobAlertManager.setNewJobCallback((newJob) => {
      setJobs((prev) => {
        if (prev.some((j) => j.id === newJob.id)) return prev;
        const normalized = enrichJobWithCategoryAndExperience(newJob);
        return [normalized, ...prev];
      });
    });

    return () => {
      unsubAlerts();
      unsubToasts();
    };
  }, []);

  // Subscribe to AI Quota state
  useEffect(() => {
    return aiQuotaManager.subscribe((updated) => {
      setQuotaState(updated);
    });
  }, []);

  // Sync profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch (err) {
      console.error('Error saving profile to localStorage', err);
    }
  }, [profile]);

  // Sync applications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(applications));
    } catch (err) {
      console.error('Error saving applications to localStorage', err);
    }
  }, [applications]);

  // Sync saved jobs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SAVED_JOBS, JSON.stringify(savedJobIds));
    } catch (err) {
      console.error('Error saving bookmarks', err);
    }
  }, [savedJobIds]);

  // CV Actions
  const handleUpdateProfile = (updated: Partial<CandidateProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleClearCv = () => {
    setProfile(EMPTY_PROFILE);
  };

  const handleLoadDemoProfile = () => {
    setProfile(DEFAULT_DEMO_PROFILE);
  };

  const handleLoadSimonCv = () => {
    setProfile(SIMON_NGUYEN_PROFILE);
  };

  const handleToggleSave = (jobId: string) => {
    const isCurrentlySaved = savedJobIds.includes(jobId);
    const targetJob = jobs.find((j) => j.id === jobId);

    setSavedJobIds((prev) =>
      isCurrentlySaved ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );

    // Toast confirmation when user bookmarks a job
    if (!isCurrentlySaved && targetJob) {
      setBookmarkToast({
        show: true,
        jobTitle: targetJob.title,
        company: targetJob.company,
      });
      setTimeout(() => {
        setBookmarkToast((prev) => (prev ? { ...prev, show: false } : null));
      }, 3500);
    }
  };

  const handleConfirmApplied = (record: ApplicationRecord) => {
    setApplications((prev) => [record, ...prev.filter((r) => r.jobId !== record.jobId)]);
  };

  const handleAddNewJob = (newJob: Job) => {
    setJobs((prev) => [newJob, ...prev]);
    try {
      const existing = localStorage.getItem(STORAGE_KEY_CUSTOM_JOBS);
      const list = existing ? JSON.parse(existing) : [];
      localStorage.setItem(STORAGE_KEY_CUSTOM_JOBS, JSON.stringify([newJob, ...list]));
    } catch (err) {
      console.error('Error saving custom job', err);
    }
  };

  const handleIngestJob = (newJob: Job) => {
    setJobs((prev) => {
      if (prev.some((j) => j.id === newJob.id)) return prev;
      const updated = [newJob, ...prev];
      try {
        const existing = localStorage.getItem(STORAGE_KEY_CUSTOM_JOBS);
        const list = existing ? JSON.parse(existing) : [];
        localStorage.setItem(STORAGE_KEY_CUSTOM_JOBS, JSON.stringify([newJob, ...list]));
      } catch (err) {
        console.error('Error saving custom job', err);
      }
      return updated;
    });
  };

  const handleIngestAllVerified = (newJobs: Job[]) => {
    setJobs((prev) => {
      const existingIds = new Set(prev.map((j) => j.id));
      const toAdd = newJobs.filter((j) => !existingIds.has(j.id));
      if (toAdd.length === 0) return prev;
      const updated = [...toAdd, ...prev];
      try {
        const existing = localStorage.getItem(STORAGE_KEY_CUSTOM_JOBS);
        const list = existing ? JSON.parse(existing) : [];
        localStorage.setItem(STORAGE_KEY_CUSTOM_JOBS, JSON.stringify([...toAdd, ...list]));
      } catch (err) {
        console.error('Error saving custom jobs', err);
      }
      return updated;
    });
  };

  // Saved / Bookmarked jobs list
  const bookmarkedJobs = useMemo(() => {
    return jobs.filter((j) => savedJobIds.includes(j.id));
  }, [jobs, savedJobIds]);

  // Pre-calculate CV Strength based on bookmarked jobs
  const cvStrengthReport = useMemo(() => {
    return analyzeCvStrength(profile, bookmarkedJobs, jobs);
  }, [profile, bookmarkedJobs, jobs]);

  const handleAddSkillFromAnalyzer = (newSkill: string) => {
    if (!profile.skills.some((s) => s.toLowerCase() === newSkill.toLowerCase())) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }));
    }
  };

  const handleBookmarkSampleJobs = () => {
    const topSampleIds = filteredJobs.slice(0, 3).map((j) => j.id);
    setSavedJobIds((prev) => Array.from(new Set([...prev, ...topSampleIds])));
  };

  // Pre-calculate match score between candidate profile and all jobs
  const matchScoresMap = useMemo(() => {
    const map = new Map<string, MatchResult>();
    jobs.forEach((job) => {
      map.set(job.id, calculateJobMatchScore(profile, job));
    });
    return map;
  }, [jobs, profile]);

  // Independent Filter Calculation & Match Score Ranking
  const filteredJobs = useMemo(() => {
    const result = jobs.filter((job) => {
      // 0. Exclude Blocked Employers (Xóa kết quả & không nhận kết quả tương tự)
      if (blockedEmployersManager.isJobBlocked(job)) {
        return false;
      }

      // 1. Independent Salary Filter:
      // Only use Min Salary slide bar (filter jobs whose ceiling/budget meets or exceeds minSalary)
      const salaryMatch = job.maxSalary >= minSalary;
      if (!salaryMatch) return false;

      // 2. Independent User-Defined Location Filter:
      if (userLocation.trim()) {
        const q = userLocation.toLowerCase().trim();
        const locString = `${job.city} ${job.district} ${job.address} ${job.workMode}`.toLowerCase();
        if (!locString.includes(q)) return false;
      }

      // 3. Search Query (Title, Company, Skills, Requirements):
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const textContent = `${job.title} ${job.company} ${job.requirements.join(' ')} ${job.roleCategory}`.toLowerCase();
        if (!textContent.includes(q)) return false;
      }

      // 4. Work Mode Filter:
      if (selectedWorkMode !== 'All' && job.workMode !== selectedWorkMode) {
        return false;
      }

      // 5. Role Category Filter:
      if (selectedRoleCategory !== 'All' && job.roleCategory !== selectedRoleCategory) {
        return false;
      }

      // 6. Experience Level Filter:
      if (selectedExpLevel !== 'All' && job.experienceLevel !== selectedExpLevel) {
        return false;
      }

      // 7. Freshness Filter (Strictly online within 7 days by default)
      if (freshnessFilter === 'within_7_days') {
        if (!isWithinDays(job.postedDate, 7)) return false;
      } else if (freshnessFilter === 'within_24h') {
        const is24h = (job.postedHoursAgo !== undefined && job.postedHoursAgo <= 24) || getDaysAgo(job.postedDate) <= 0;
        if (!is24h) return false;
      } else if (freshnessFilter === 'within_3_days') {
        if (!isWithinDays(job.postedDate, 3)) return false;
      }

      return true;
    });

    // Sort according to user preference (Default: Highest Match Score)
    const sorted = [...result];
    sorted.sort((a, b) => {
      if (sortBy === 'match_desc') {
        const scoreA = matchScoresMap.get(a.id)?.totalScore || 0;
        const scoreB = matchScoresMap.get(b.id)?.totalScore || 0;
        return scoreB - scoreA;
      }
      if (sortBy === 'salary_desc') {
        return b.maxSalary - a.maxSalary;
      }
      if (sortBy === 'salary_asc') {
        return a.minSalary - b.minSalary;
      }
      // date_desc
      return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
    });

    return sorted;
  }, [jobs, minSalary, userLocation, searchQuery, selectedWorkMode, selectedRoleCategory, selectedExpLevel, freshnessFilter, sortBy, matchScoresMap, blockedEmployers]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setMinSalary(10000000);
    setUserLocation('');
    setSelectedWorkMode('All');
    setSelectedRoleCategory('All');
    setSelectedExpLevel('All');
    setFreshnessFilter('within_7_days');
    setSortBy('match_desc');
  };

  const isAnyFilterActive =
    searchQuery !== '' ||
    minSalary !== 10000000 ||
    userLocation !== '' ||
    selectedWorkMode !== 'All' ||
    selectedRoleCategory !== 'All' ||
    selectedExpLevel !== 'All' ||
    freshnessFilter !== 'within_7_days';

  // Map applied jobs for quick lookup
  const appliedJobMap = useMemo(() => {
    const map = new Map<string, string>();
    applications.forEach((app) => {
      map.set(app.jobId, new Date(app.appliedAt).toLocaleDateString('vi-VN'));
    });
    return map;
  }, [applications]);

  // Active Filter Criteria Snapshot for Set Alert
  const currentFilterCriteria: JobAlertCriteria = useMemo(() => ({
    searchQuery,
    minSalary,
    maxSalary,
    userLocation,
    selectedWorkMode,
    selectedRoleCategory,
    selectedExpLevel,
    freshnessFilter,
  }), [searchQuery, minSalary, maxSalary, userLocation, selectedWorkMode, selectedRoleCategory, selectedExpLevel, freshnessFilter]);

  // Smart Recommendations: Analyzes similarity between candidate profile skills and requirements in each job
  const smartRecommendations = useMemo(() => {
    if (!profile.skills || profile.skills.length === 0) return [];

    const availableJobs = jobs.filter((j) => !blockedEmployersManager.isJobBlocked(j));

    const scored = availableJobs.map((job) => {
      const reqText = (job.requirements || []).join(' ').toLowerCase();
      const matchedSkills = profile.skills.filter((skill) => {
        const s = skill.toLowerCase().trim();
        if (!s) return false;
        if (reqText.includes(s)) return true;
        const words = s.split(/[\s,/-]+/).filter((w) => w.length >= 3);
        const matchCount = words.filter((w) => reqText.includes(w)).length;
        return matchCount >= Math.max(1, Math.ceil(words.length * 0.4));
      });

      const matchRatio = matchedSkills.length / Math.max(1, profile.skills.length);
      let confidence = Math.round(68 + matchRatio * 28);
      if (profile.targetSalaryVnd && job.maxSalary >= profile.targetSalaryVnd) {
        confidence = Math.min(98, confidence + 3);
      }
      if (job.experienceLevel === 'Senior' && (profile.experienceYears || 0) >= 5) {
        confidence = Math.min(99, confidence + 2);
      }

      return {
        job,
        confidenceScore: Math.min(99, Math.max(62, confidence)),
        matchedSkills,
      };
    });

    scored.sort((a, b) => b.confidenceScore - a.confidenceScore);
    return scored.slice(0, 3);
  }, [jobs, profile.skills, profile.targetSalaryVnd, profile.experienceYears, blockedEmployers]);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* 1. Top Bar Navigation Contract */}
      <Header
        onOpenAddJob={() => setIsAddJobModalOpen(true)}
        onOpenHistory={() => setIsHistoryDrawerOpen(true)}
        onOpenCvModal={() => setIsCvModalOpen(true)}
        onOpenDeepSearch={() => setIsDeepSearchModalOpen(true)}
        onOpenCvStrengthModal={() => setIsCvStrengthModalOpen(true)}
        onOpenPresentationDeck={() => setIsPresentationModalOpen(true)}
        onOpenCoverPagePrint={() => setIsCoverPagePrintOpen(true)}
        onOpenQuotaModal={() => setIsQuotaModalOpen(true)}
        onOpenEmailTemplates={() => setIsEmailTemplatesModalOpen(true)}
        onOpenSetAlert={() => setIsSetAlertModalOpen(true)}
        onOpenBlockedEmployers={() => setIsBlockedModalOpen(true)}
        blockedCount={blockedEmployers.length}
        activeAlertsCount={activeAlertsCount}
        appliedCount={applications.length}
        hasCv={Boolean(profile.cvFileName)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* 2. Top CV File Upload Bar with Explicit Clear Out Option & CV Strength Indicator */}
      <CvUploadBar
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        onClearCv={handleClearCv}
        onOpenCvModal={() => setIsCvModalOpen(true)}
        onOpenCvStrengthModal={() => setIsCvStrengthModalOpen(true)}
        onOpenPresentationDeck={() => setIsPresentationModalOpen(true)}
        onOpenCoverPagePrint={() => setIsCoverPagePrintOpen(true)}
        onLoadDemoProfile={handleLoadDemoProfile}
        onLoadSimonCv={handleLoadSimonCv}
        cvStrengthScore={cvStrengthReport.overallScore}
      />

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* Gemini 3.8 Flash Quota Limits & Auto-Refine Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-700/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono">
                  Automatically Refine Quota limits exceeded by Use your API key
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 font-semibold">
                  Gemini 3.8 Flash
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    quotaState.activeMode === 'user_api_key'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-emerald-500 text-white'
                  }`}
                >
                  {quotaState.activeMode === 'user_api_key'
                    ? 'Đang Dùng API Key Cá Nhân'
                    : `Hạn Ngạch Miễn Phí: ${quotaState.freeQuotaRemaining}/${quotaState.freeQuotaMax}`}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-medium mt-1 leading-relaxed">
                Switch to your API key whenever you run out of quota, and we'll automatically switch back to your free quota when it resets.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsQuotaModalOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
              title="Cài đặt API key cá nhân và kiểm tra tự động tinh chỉnh câu ứng tuyển"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Cài Đặt Key & Auto-Refine</span>
            </button>
          </div>
        </div>

        {/* Editorial Hero Announcement & Policy Guarantee */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-800 mb-2">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Tiêu Chuẩn Ứng Tuyển Trực Tiếp: 100% Qua Hộp Thư Email HR</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 mb-3" style={{ textWrap: 'balance' }}>
              Tìm Việc Nhanh Với Lương 10M – 50M VND & Gửi Thẳng CV Vào Hộp Thư Nhà Tuyển Dụng
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
              Không chuyển hướng qua LinkedIn hay các website tuyển dụng yêu cầu mật khẩu đăng nhập trung gian.
              Tự động tạo câu ngắn ứng tuyển súc tích gửi kèm CV và lọc độc lập theo dải lương & khu vực bạn chọn.
            </p>

            {/* Executive Tools Fast Launch Banner */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4 pt-1">
              <button
                type="button"
                onClick={() => setIsPresentationModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                title="Tự động thiết kế CV thành bài thuyết trình PowerPoint (.pptx)"
              >
                <div className="w-5 h-5 rounded bg-white/20 text-white flex items-center justify-center font-black text-xs">
                  P
                </div>
                <span>Thuyết Trình PowerPoint (Auto-Design Deck)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCoverPagePrintOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                title="Thiết kế và in trang bìa hồ sơ chuẩn A4 kèm 1 ảnh chân dung, 1 ảnh nền và thông tin liên hệ đáy trang"
              >
                <div className="w-5 h-5 rounded bg-white/20 text-white flex items-center justify-center">
                  🖨️
                </div>
                <span>In Trang Bìa (Print Cover Page)</span>
              </button>

              <button
                type="button"
                onClick={handleLoadSimonCv}
                className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold text-xs flex items-center gap-1.5 transition-all"
                title="Nạp ngay hồ sơ 6 trang CV thực tế 2026 của Simon Nguyen (Nguyễn Tấn Sĩ)"
              >
                <span>⭐ Nạp Hồ Sơ: Simon Nguyen (2026)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsQuotaModalOpen(true)}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-medium text-xs flex items-center gap-1.5 transition-all"
                title="Cơ chế tự động chuyển sang API Key khi hết hạn ngạch và chuyển lại khi làm mới"
              >
                <span>⚡ Quota & API Key (Gemini 3.8 Flash)</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Không cần đăng ký tài khoản rườm rà</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Thanh trượt lương 10 triệu - 50 triệu VND</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tự động viết câu ứng tuyển gửi kèm CV</span>
              </span>
            </div>
          </div>
        </div>

        {/* 3. Independent Filters Grid: Search, Salary Slider, and User-Defined Location */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Salary Slider & Location Filter (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Salary Slider (Only Min Salary Slide Bar) */}
            <SalarySlider
              minSalary={minSalary}
              onChangeMin={setMinSalary}
              onReset={() => setMinSalary(10000000)}
              matchedCount={filteredJobs.length}
            />

            {/* User-Defined Location Filter */}
            <LocationFilter
              locationQuery={userLocation}
              onChangeLocation={setUserLocation}
              onClearLocation={() => setUserLocation('')}
            />

            {/* Quick Summary Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs text-slate-600">
              <div className="font-semibold text-slate-900 mb-2 flex items-center justify-between">
                <span>Hồ sơ ứng viên đang dùng:</span>
                <button
                  type="button"
                  onClick={() => setIsCvModalOpen(true)}
                  className="text-sky-700 hover:underline"
                >
                  Sửa
                </button>
              </div>
              <div className="space-y-1">
                <div>
                  Họ tên: <span className="font-medium text-slate-800">{profile.fullName || 'Chưa đặt tên'}</span>
                </div>
                <div>
                  Chuyên môn: <span className="font-medium text-slate-800">{profile.currentTitle || 'Chuyên viên'}</span>
                </div>
                <div>
                  File CV: <span className="font-medium text-slate-800">{profile.cvFileName || 'Chưa có file (vui lòng nạp CV)'}</span>
                </div>
                <div>
                  Kỳ vọng cá nhân: <span className="font-medium text-sky-800 font-mono-numbers">{formatSalaryMillion(profile.targetSalaryVnd)}/tháng</span>
                </div>
                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Độ mạnh CV:</span>
                    <span className="font-bold text-slate-900 font-mono-numbers">
                      {cvStrengthReport.overallScore}/100 ({cvStrengthReport.ratingLevel})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCvStrengthModalOpen(true)}
                    className="px-2 py-1 text-[11px] font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Phân tích</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Smart Recommendations Section (Skill Similarity & Confidence Score) */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs">
                      Gợi Ý Thông Minh (Smart Recommendations)
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      Phân tích tương đồng kỹ năng CV & yêu cầu việc làm
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-sky-50 text-sky-800 font-bold px-2 py-0.5 rounded border border-sky-200">
                  {smartRecommendations.length} Phù Hợp
                </span>
              </div>

              {smartRecommendations.length === 0 ? (
                <div className="p-4 text-center bg-slate-50 rounded-lg text-slate-500 text-[11px]">
                  Cập nhật các kỹ năng trong CV để nhận gợi ý thông minh được cá nhân hóa.
                </div>
              ) : (
                <div className="space-y-2.5 pt-1">
                  {smartRecommendations.map(({ job, confidenceScore, matchedSkills }) => (
                    <div
                      key={job.id}
                      className="p-3 rounded-lg border border-slate-100 hover:border-sky-300 hover:bg-sky-50/30 transition-all bg-slate-50/60 space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 text-xs leading-snug truncate">
                            {job.title}
                          </h4>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                            <span className="font-medium text-slate-700 truncate">{job.company}</span>
                            <span aria-hidden="true">·</span>
                            <span>{job.city}</span>
                          </div>
                        </div>

                        {/* Percentage Confidence Score */}
                        <div
                          className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold font-mono border ${
                            confidenceScore >= 90
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : confidenceScore >= 80
                              ? 'bg-sky-50 text-sky-700 border-sky-300'
                              : 'bg-amber-50 text-amber-700 border-amber-300'
                          }`}
                          title={`Độ tin cậy tương đồng kỹ năng: ${confidenceScore}%`}
                        >
                          {confidenceScore}% Khớp
                        </div>
                      </div>

                      {/* Matched skills pill tags */}
                      {matchedSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {matchedSkills.slice(0, 3).map((sk, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-1.5 py-0.2 bg-white text-slate-700 rounded border border-slate-200"
                            >
                              ✓ {sk}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Salary & Action Buttons */}
                      <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60 text-[11px]">
                        <span className="font-bold text-emerald-700 font-mono-numbers">
                          {formatSalaryMillion(job.minSalary)} - {formatSalaryMillion(job.maxSalary)}/tháng
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedJobForDetail(job);
                              setIsDetailModalOpen(true);
                            }}
                            className="text-slate-600 hover:text-slate-900 font-medium px-1.5 py-0.5 rounded hover:bg-slate-200 cursor-pointer"
                          >
                            Chi tiết
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedJobForApply(job);
                              setIsApplyModalOpen(true);
                            }}
                            className="text-sky-700 hover:text-sky-900 font-bold px-2 py-0.5 bg-white border border-sky-200 rounded shadow-2xs hover:bg-sky-50 cursor-pointer"
                          >
                            Ứng tuyển
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Search Keyword, Quick Filters, and Job Listings (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Search Input & Secondary Filter Controls */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm vị trí, kỹ năng, công ty (ví dụ: Frontend, React, MoMo, Marketing, Golang)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white transition-all"
                />
              </div>

              {/* Secondary Selectors: Role Category & Work Mode */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {/* Category Filter */}
                  <select
                    value={selectedRoleCategory}
                    onChange={(e) => setSelectedRoleCategory(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-sky-600"
                  >
                    <option value="All">Tất cả ngành nghề</option>
                    <option value="Engineering">Kỹ thuật phần mềm</option>
                    <option value="Marketing">Marketing & Digital</option>
                    <option value="Design">UI/UX Design</option>
                    <option value="Data">Data & Phân tích</option>
                    <option value="Operations">Vận hành & HR</option>
                    <option value="Sales">Kinh doanh B2B</option>
                  </select>

                  {/* Work Mode Filter */}
                  <select
                    value={selectedWorkMode}
                    onChange={(e) => setSelectedWorkMode(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-sky-600"
                  >
                    <option value="All">Tất cả hình thức</option>
                    <option value="Hybrid">Hybrid (Linh hoạt)</option>
                    <option value="On-site">On-site (Văn phòng)</option>
                    <option value="Remote">Remote (Từ xa)</option>
                  </select>

                  {/* Experience Level */}
                  <select
                    value={selectedExpLevel}
                    onChange={(e) => setSelectedExpLevel(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-sky-600"
                  >
                    <option value="All">Tất cả kinh nghiệm</option>
                    <option value="Junior">Junior</option>
                    <option value="Middle">Middle</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead / Quản lý</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSetAlertModalOpen(true)}
                    className="text-xs text-amber-800 hover:text-amber-900 font-semibold flex items-center gap-1.5 transition-colors px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 shadow-2xs cursor-pointer"
                    title="Lưu bộ lọc hiện tại và nhận thông báo việc làm mới định kỳ"
                  >
                    <Bell className="w-3.5 h-3.5 text-amber-600" />
                    <span>Đặt Thông Báo (Set Alert)</span>
                  </button>

                  {isAnyFilterActive && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-rose-50 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Xóa toàn bộ lọc</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Deep Search & Data Harvester Action Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">
                      Bộ Thu Thập Dữ Liệu & Quét Sâu (Deep Search & Draw Data)
                    </span>
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-medium border border-amber-400/30">
                      Website & FB
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Quét lệnh tuyển trực tiếp từ website công ty, hội nhóm Facebook, làm sạch bài đăng thô
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsDeepSearchModalOpen(true)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-amber-300 hover:bg-amber-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-900" />
                  <span>Quét & Làm Sạch Bài Đăng</span>
                </button>
              </div>
            </div>

            {/* Freshness Filter (Strictly online within 7 days by default) & Count */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-slate-500 mr-1 shrink-0 font-medium">Thời gian đăng:</span>
                <button
                  type="button"
                  onClick={() => setFreshnessFilter('within_7_days')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
                    freshnessFilter === 'within_7_days'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                  <span>Online trong 7 ngày (Chuẩn)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFreshnessFilter('within_24h')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
                    freshnessFilter === 'within_24h'
                      ? 'bg-sky-50 text-sky-800 border border-sky-300'
                      : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  <span>⚡ 24 giờ qua</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFreshnessFilter('within_3_days')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                    freshnessFilter === 'within_3_days'
                      ? 'bg-sky-50 text-sky-800 border border-sky-300'
                      : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  3 ngày qua
                </button>

                <button
                  type="button"
                  onClick={() => setFreshnessFilter('all')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                    freshnessFilter === 'all'
                      ? 'bg-slate-100 text-slate-800 border border-slate-300'
                      : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  Tất cả ngày
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 w-full sm:w-auto">
                <span className="font-medium">
                  Tìm thấy <strong className="text-slate-900 font-mono-numbers">{filteredJobs.length}</strong> việc làm
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Sắp xếp:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 text-slate-800 font-medium px-2 py-1 rounded-md text-xs focus:ring-1 focus:ring-sky-600 focus:outline-none"
                  >
                    <option value="match_desc">✨ Độ Phù Hợp Cao Nhất</option>
                    <option value="date_desc">📅 Mới Nhất</option>
                    <option value="salary_desc">💵 Lương Cao Nhất</option>
                    <option value="salary_asc">💵 Lương Khởi Điểm</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Job Listings Grid */}
            {filteredJobs.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Không tìm thấy việc làm phù hợp
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  Thử nới rộng thanh trượt mức lương (10M - 50M VND) hoặc điều chỉnh lại từ khóa địa điểm.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-600 rounded-lg transition-colors"
                >
                  Đặt lại toàn bộ bộ lọc
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => {
                  const isApplied = appliedJobMap.has(job.id);
                  const appliedDate = appliedJobMap.get(job.id);
                  const isSaved = savedJobIds.includes(job.id);
                  const matchResult = matchScoresMap.get(job.id);

                  return (
                    <JobCard
                      key={job.id}
                      job={job}
                      isApplied={isApplied}
                      appliedDate={appliedDate}
                      isSaved={isSaved}
                      matchResult={matchResult}
                      onToggleSave={handleToggleSave}
                      onOpenDetails={(j) => {
                        setSelectedJobForDetail(j);
                        setIsDetailModalOpen(true);
                      }}
                      onDirectApply={(j) => {
                        setSelectedJobForApply(j);
                        setIsApplyModalOpen(true);
                      }}
                      onDismissJob={handleOpenDismissJob}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">VND CareerDirect</span>
            <span aria-hidden="true">·</span>
            <span>Hệ thống ứng tuyển trực tiếp qua Email Recruiter</span>
          </div>
          <div>
            Cam kết không yêu cầu tài khoản trung gian · Lương 10M – 50M VND/tháng
          </div>
        </div>
      </footer>

      {/* 4. Modals and Drawers */}
      {/* Direct Recruiter Email Apply Modal with Short Sentence Generator */}
      {isApplyModalOpen && selectedJobForApply && (
        <ApplyModal
          job={selectedJobForApply}
          profile={profile}
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          onConfirmApplied={handleConfirmApplied}
          onOpenCvModal={() => {
            setIsApplyModalOpen(false);
            setIsCvModalOpen(true);
          }}
          onLoadDemoProfile={handleLoadDemoProfile}
          onOpenQuotaModal={() => setIsQuotaModalOpen(true)}
          emailTemplates={emailTemplates}
          onOpenEmailTemplates={() => setIsEmailTemplatesModalOpen(true)}
        />
      )}

      {/* Job Details Modal */}
      {isDetailModalOpen && selectedJobForDetail && (
        <JobDetailModal
          job={selectedJobForDetail}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onApply={(job) => {
            setSelectedJobForApply(job);
            setIsApplyModalOpen(true);
          }}
          onDismissJob={handleOpenDismissJob}
          isApplied={appliedJobMap.has(selectedJobForDetail.id)}
          matchResult={matchScoresMap.get(selectedJobForDetail.id)}
        />
      )}

      {/* CV Profile Editor Modal with Clear Out Option */}
      {isCvModalOpen && (
        <CvDetailModal
          isOpen={isCvModalOpen}
          onClose={() => setIsCvModalOpen(false)}
          profile={profile}
          onSaveProfile={(updated) => setProfile(updated)}
          onClearCv={handleClearCv}
          onLoadDemoProfile={handleLoadDemoProfile}
          onLoadSimonCv={handleLoadSimonCv}
          onOpenPresentationDeck={() => {
            setIsCvModalOpen(false);
            setIsPresentationModalOpen(true);
          }}
          onOpenCoverPagePrint={() => {
            setIsCvModalOpen(false);
            setIsCoverPagePrintOpen(true);
          }}
        />
      )}

      {/* Applications Sent Drawer */}
      {isHistoryDrawerOpen && (
        <ApplicationsDrawer
          isOpen={isHistoryDrawerOpen}
          onClose={() => setIsHistoryDrawerOpen(false)}
          applications={applications}
          onClearHistory={() => setApplications([])}
          onDeleteApplication={(id) => setApplications((prev) => prev.filter((a) => a.id !== id))}
          onSelectApplication={(record) => {
            const matchedJob = jobs.find((j) => j.id === record.jobId);
            if (matchedJob) {
              setSelectedJobForDetail(matchedJob);
              setIsDetailModalOpen(true);
            }
          }}
        />
      )}

      {/* Add New Job Posting Modal (Direct Recruiter Email) */}
      {isAddJobModalOpen && (
        <AddJobModal
          isOpen={isAddJobModalOpen}
          onClose={() => setIsAddJobModalOpen(false)}
          onAddJob={handleAddNewJob}
        />
      )}

      {/* Deep Search & Data Harvester / Cleaner Modal */}
      {isDeepSearchModalOpen && (
        <DeepSearchHarvesterModal
          isOpen={isDeepSearchModalOpen}
          onClose={() => setIsDeepSearchModalOpen(false)}
          onIngestJob={handleIngestJob}
          onIngestAllVerified={handleIngestAllVerified}
          existingJobIds={new Set(jobs.map((j) => j.id))}
        />
      )}

      {/* CV Strength Analyzer Modal */}
      {isCvStrengthModalOpen && (
        <CvStrengthModal
          isOpen={isCvStrengthModalOpen}
          onClose={() => setIsCvStrengthModalOpen(false)}
          profile={profile}
          bookmarkedJobs={bookmarkedJobs}
          allJobs={jobs}
          onAddSkill={handleAddSkillFromAnalyzer}
          onOpenCvEditModal={() => {
            setIsCvStrengthModalOpen(false);
            setIsCvModalOpen(true);
          }}
          onBookmarkSampleJobs={handleBookmarkSampleJobs}
        />
      )}

      {/* Auto Design CV as Self Presentation PowerPoint Deck Modal */}
      {isPresentationModalOpen && (
        <PresentationDeckModal
          isOpen={isPresentationModalOpen}
          onClose={() => setIsPresentationModalOpen(false)}
          profile={profile}
          onOpenCoverPagePrint={() => {
            setIsPresentationModalOpen(false);
            setIsCoverPagePrintOpen(true);
          }}
          onOpenQuotaModal={() => setIsQuotaModalOpen(true)}
        />
      )}

      {/* Print Cover Page Modal (1 Self Image + 1 Background Image + Bottom Contact Details) */}
      {isCoverPagePrintOpen && (
        <CoverPagePrintModal
          isOpen={isCoverPagePrintOpen}
          onClose={() => setIsCoverPagePrintOpen(false)}
          profile={profile}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      {/* Gemini 3.8 Flash Quota & Personal API Key Auto-Switcher Modal */}
      {isQuotaModalOpen && (
        <ApiKeyQuotaModal
          isOpen={isQuotaModalOpen}
          onClose={() => setIsQuotaModalOpen(false)}
        />
      )}

      {/* Email Templates Modal (Manager & Dynamic Customizer) */}
      {isEmailTemplatesModalOpen && (
        <EmailTemplatesModal
          isOpen={isEmailTemplatesModalOpen}
          onClose={() => setIsEmailTemplatesModalOpen(false)}
          templates={emailTemplates}
          onSaveTemplates={(updated) => {
            setEmailTemplates(updated);
            saveStoredEmailTemplates(updated);
          }}
          onResetDefaults={() => {
            const defaults = resetEmailTemplatesToDefault();
            setEmailTemplates(defaults);
          }}
          profile={profile}
          currentJob={selectedJobForApply || selectedJobForDetail}
          onSelectTemplateToApply={(tpl) => {
            if (!selectedJobForApply && jobs.length > 0) {
              setSelectedJobForApply(jobs[0]);
            }
            setIsApplyModalOpen(true);
          }}
        />
      )}

      {/* Set Job Alert Modal */}
      {isSetAlertModalOpen && (
        <SetAlertModal
          isOpen={isSetAlertModalOpen}
          onClose={() => setIsSetAlertModalOpen(false)}
          currentCriteria={currentFilterCriteria}
        />
      )}

      {/* Subtle Toast Notification System for Job Alerts */}
      <AlertToastNotification
        toasts={alertToasts}
        onDismiss={(id) => jobAlertManager.dismissToast(id)}
        onViewJob={(job) => {
          setSelectedJobForDetail(job);
          setIsDetailModalOpen(true);
        }}
        onApplyJob={(job) => {
          setSelectedJobForApply(job);
          setIsApplyModalOpen(true);
        }}
      />

      {/* Bookmark Save Confirmation Toast */}
      {bookmarkToast?.show && (
        <aside
          aria-label="Thông báo lưu việc làm"
          className="fixed bottom-24 right-4 z-50 bg-slate-900/95 text-white px-4 py-3 rounded-2xl border border-slate-700 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 max-w-sm backdrop-blur-md"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Bookmark className="w-4 h-4 fill-emerald-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate flex items-center gap-1.5">
              <span>Đã lưu vào bộ sưu tập cá nhân!</span>
            </p>
            <p className="text-[11px] text-slate-300 truncate">
              {bookmarkToast.jobTitle} · {bookmarkToast.company}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setBookmarkToast(null)}
            className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors ml-auto shrink-0 cursor-pointer"
            title="Đóng"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}

      {/* Dismiss Job & Block Employer Modal (Xóa kết quả & không nhận kết quả tương tự) */}
      {isDismissModalOpen && jobToDismiss && (
        <DismissJobModal
          isOpen={isDismissModalOpen}
          job={jobToDismiss}
          onClose={() => setIsDismissModalOpen(false)}
          onConfirmDismiss={handleConfirmDismissJob}
        />
      )}

      {/* Blocked Employers Management Modal */}
      {isBlockedModalOpen && (
        <BlockedEmployersModal
          isOpen={isBlockedModalOpen}
          onClose={() => setIsBlockedModalOpen(false)}
        />
      )}

      {/* Dismiss / Block Notification Toast */}
      {dismissToast?.show && (
        <aside
          aria-label="Thông báo xóa việc làm và chặn nhà tuyển dụng"
          className="fixed bottom-24 left-4 z-50 bg-slate-900/95 text-white px-4 py-3 rounded-2xl border border-slate-700 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 max-w-md backdrop-blur-md"
        >
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
            <X className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-200 leading-snug">
              {dismissToast.message}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDismissToast(null)}
            className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors ml-auto shrink-0 cursor-pointer"
            title="Đóng"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}
    </div>
  );
}


import React, { useEffect, useState } from 'react';
import { Bell, X, Building2, MapPin, ArrowRight, ExternalLink, Mail, CheckCircle2, Volume2, Sparkles } from 'lucide-react';
import { JobAlertToast } from '../types/alert';
import { Job } from '../types/job';
import { formatSalaryMillion } from '../utils/formatters';

interface AlertToastNotificationProps {
  toasts: JobAlertToast[];
  onDismiss: (toastId: string) => void;
  onViewJob: (job: Job) => void;
  onApplyJob: (job: Job) => void;
}

export const AlertToastNotification: React.FC<AlertToastNotificationProps> = ({
  toasts,
  onDismiss,
  onViewJob,
  onApplyJob,
}) => {
  if (toasts.length === 0) return null;

  return (
    <aside 
      aria-label="Thông báo việc làm mới"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full sm:w-[390px] pointer-events-none px-3 sm:px-0"
    >
      {toasts.map((toast) => (
        <SingleToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => onDismiss(toast.id)}
          onViewJob={() => onViewJob(toast.job)}
          onApplyJob={() => onApplyJob(toast.job)}
        />
      ))}
    </aside>
  );
};

interface SingleToastItemProps {
  toast: JobAlertToast;
  onDismiss: () => void;
  onViewJob: () => void;
  onApplyJob: () => void;
}

const SingleToastItem: React.FC<SingleToastItemProps> = ({
  toast,
  onDismiss,
  onViewJob,
  onApplyJob,
}) => {
  const [progress, setProgress] = useState<number>(100);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const { job } = toast;

  // Auto-dismiss countdown (8 seconds)
  useEffect(() => {
    if (isHovered) return;

    const duration = 9000;
    const intervalTime = 100;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(timer);
          onDismiss();
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isHovered, onDismiss]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="pointer-events-auto bg-slate-900 text-white rounded-2xl border border-slate-700/80 shadow-2xl shadow-slate-950/50 p-4 transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in relative overflow-hidden backdrop-blur-md"
    >
      {/* Subtle Progress Bar */}
      <div
        className="absolute top-0 left-0 h-1 bg-gradient-to-r from-sky-400 via-amber-300 to-emerald-400 transition-all duration-100"
        style={{ width: `${progress}%` }}
      />

      {/* Header of Toast */}
      <div className="flex items-start justify-between gap-2.5 mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center shrink-0">
            <Bell className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 font-mono">
                Job Alert Match
              </span>
              <span className="text-[9px] text-slate-400">· {toast.matchedAt}</span>
            </div>
            <p className="text-[11px] text-slate-300 truncate font-medium">
              {toast.alertTitle}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors shrink-0"
          title="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Job Card Content */}
      <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 space-y-2">
        <div>
          <h4 className="text-xs font-bold text-white leading-snug line-clamp-1">
            {job.title}
          </h4>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
            <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
            <span className="truncate">{job.company}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300">{job.city}</span>
          </div>
        </div>

        {/* Salary & Direct Recruiter Tag */}
        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
          <div className="font-semibold text-emerald-400 font-mono-numbers">
            {formatSalaryMillion(job.minSalary)} - {formatSalaryMillion(job.maxSalary)}/tháng
          </div>
          <div className="flex items-center gap-1 text-[10px] text-sky-300">
            <Mail className="w-3 h-3 text-sky-400" />
            <span>Email HR Trực Tiếp</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 mt-3 pt-1">
        <button
          type="button"
          onClick={() => {
            onViewJob();
            onDismiss();
          }}
          className="px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1"
        >
          <span>Xem Chi Tiết</span>
        </button>
        <button
          type="button"
          onClick={() => {
            onApplyJob();
            onDismiss();
          }}
          className="px-3 py-1.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
        >
          <span>Ứng Tuyển Ngay</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

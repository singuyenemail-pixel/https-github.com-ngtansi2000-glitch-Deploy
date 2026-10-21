import React from 'react';
import { Mail, MapPin, Building2, Briefcase, CheckCircle2, ShieldCheck, ChevronRight, Bookmark, Trash2, Sparkles, Check } from 'lucide-react';
import { Job } from '../types/job';
import { formatSalaryRangeShort, formatRelativeDate } from '../utils/formatters';
import { MatchResult } from '../utils/matchScore';

interface JobCardProps {
  job: Job;
  isApplied: boolean;
  appliedDate?: string;
  isSaved: boolean;
  matchResult?: MatchResult;
  onToggleSave: (jobId: string) => void;
  onOpenDetails: (job: Job) => void;
  onDirectApply: (job: Job) => void;
  onDismissJob?: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isApplied,
  appliedDate,
  isSaved,
  matchResult,
  onToggleSave,
  onOpenDetails,
  onDirectApply,
  onDismissJob,
}) => {
  return (
    <div className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 transition-all shadow-xs hover:shadow-sm flex flex-col justify-between group">
      <div>
        {/* Top Header of Card */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {job.company}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-medium">
                {formatRelativeDate(job.postedDate, job.postedHoursAgo)}
              </span>
              {job.sourceName && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-600 truncate max-w-[140px] sm:max-w-none" title={job.sourceName}>
                    {job.sourceType === 'facebook_group' ? 'FB Group' : job.sourceType === 'company_direct' ? 'Trực Tiếp' : 'Đã Làm Sạch'}
                  </span>
                </>
              )}
              {isApplied && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Đã gửi CV {appliedDate ? `(${appliedDate})` : ''}
                  </span>
                </>
              )}
            </div>

            <h3
              onClick={() => onOpenDetails(job)}
              className="text-base font-semibold text-slate-900 group-hover:text-sky-700 transition-colors cursor-pointer line-clamp-1"
            >
              {job.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {matchResult && (
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold font-mono-numbers border shadow-2xs ${matchResult.badgeClass}`}
                title={`Kỹ năng: ${matchResult.skillScore}% | Kinh nghiệm: ${matchResult.experienceScore}% | Lương: ${matchResult.salaryScore}%`}
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>{matchResult.totalScore}% Match</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => onToggleSave(job.id)}
              className={`p-1.5 rounded-lg border transition-colors shrink-0 cursor-pointer ${
                isSaved
                  ? 'bg-amber-50 border-amber-200 text-amber-600'
                  : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
              title={isSaved ? 'Đã lưu việc làm' : 'Lưu việc làm'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
            </button>

            {onDismissJob && (
              <button
                type="button"
                onClick={() => onDismissJob(job)}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                title="Xóa kết quả này & Chặn không nhận kết quả tương tự từ nhà tuyển dụng này"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Salary Highlight - Tabular Numbers */}
        <div className="my-2.5 bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex items-baseline justify-between">
          <div>
            <span className="text-[11px] text-slate-500 block">Mức lương tuyển dụng:</span>
            <span className="text-base font-bold text-sky-800 font-mono-numbers">
              {formatSalaryRangeShort(job.minSalary, job.maxSalary)}
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {job.experienceLevel} · {job.roleCategory}
          </span>
        </div>

        {/* Location & Work Mode (Unboxed metadata with separators) */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mb-2.5">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{job.district}, {job.city}</span>
          </span>
          <span aria-hidden="true">·</span>
          <span>Hình thức: {job.workMode}</span>
        </div>

        {/* Match Breakdown & Skills Overlap */}
        {matchResult && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 mb-2.5 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <span>Độ Phù Hợp: <strong className="text-slate-900 font-mono-numbers">{matchResult.totalScore}%</strong></span>
                <span className="text-[11px] text-slate-500 font-normal">({matchResult.levelLabel})</span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono-numbers">
                Kỹ năng: {matchResult.skillScore}% · KN: {matchResult.experienceScore}%
              </span>
            </div>

            {/* Matched Skills row */}
            {matchResult.matchedSkills.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1 text-[11px]">
                <span className="text-slate-500">Trùng khớp:</span>
                {matchResult.matchedSkills.map((s) => (
                  <span key={s} className="bg-white text-emerald-800 font-medium px-1.5 py-0.5 rounded border border-emerald-200/80 shadow-2xs">
                    ✓ {s}
                  </span>
                ))}
                {matchResult.missingSkills.length > 0 && (
                  <span className="text-slate-400 ml-1">
                    · Yêu cầu thêm: {matchResult.missingSkills.slice(0, 2).join(', ')}
                  </span>
                )}
              </div>
            ) : (
              <div className="text-[11px] text-slate-500">
                {matchResult.summary}
              </div>
            )}
          </div>
        )}

        {/* Requirements Snippet */}
        <p className="text-xs text-slate-500 line-clamp-2 mb-3">
          {job.requirements[0]} {job.requirements[1] ? `· ${job.requirements[1]}` : ''}
        </p>

        {/* Direct Recruiter Contact Banner - Strict NO Login Walls */}
        <div className="bg-sky-50/70 border border-sky-100 rounded-lg p-2.5 mb-4 text-xs">
          <div className="flex items-center justify-between gap-1 text-sky-900 font-medium mb-0.5">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>Gửi Trực Tiếp Vào Email HR Tuyển Dụng:</span>
            </span>
            <span className="text-[10px] text-slate-500">Không cần đăng nhập MXH</span>
          </div>
          <div className="flex items-center justify-between gap-2 mt-1">
            <span className="font-mono-numbers font-medium text-slate-800 truncate">
              {job.recruiterEmail}
            </span>
            <span className="text-[11px] text-slate-500 shrink-0">
              {job.recruiterName.split('-')[0].trim()}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onOpenDetails(job)}
          className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 py-1.5 px-2 rounded hover:bg-slate-50 transition-colors"
        >
          <span>Xem Yêu Cầu & Phúc Lợi</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onDirectApply(job)}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs ${
            isApplied
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
              : 'bg-sky-700 text-white hover:bg-sky-600'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>{isApplied ? 'Gửi Lại CV Trực Tiếp' : 'Ứng Tuyển Qua Email'}</span>
        </button>
      </div>
    </div>
  );
};

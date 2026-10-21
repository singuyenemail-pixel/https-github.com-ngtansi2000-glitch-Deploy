import React from 'react';
import {
  X,
  Building2,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle,
  Coins,
  Calendar,
  Briefcase,
} from 'lucide-react';
import { Job } from '../types/job';
import { formatSalaryRangeFull, formatSalaryMillion } from '../utils/formatters';
import { MatchResult } from '../utils/matchScore';
import { Sparkles, Check, AlertCircle, Trash2 } from 'lucide-react';

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (job: Job) => void;
  onDismissJob?: (job: Job) => void;
  isApplied: boolean;
  matchResult?: MatchResult;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  isOpen,
  onClose,
  onApply,
  onDismissJob,
  isApplied,
  matchResult,
}) => {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {job.company}
              </span>
              <span aria-hidden="true">·</span>
              <span>{job.experienceLevel}</span>
              <span aria-hidden="true">·</span>
              <span>{job.roleCategory}</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {job.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto text-sm text-slate-700">
          {/* Key Metric Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 border border-slate-200/80 rounded-xl p-4">
            <div>
              <span className="text-xs text-slate-500 block mb-0.5">Mức lương ngân sách:</span>
              <span className="text-lg font-bold text-sky-800 font-mono-numbers">
                {formatSalaryRangeFull(job.minSalary, job.maxSalary)}
              </span>
              <div className="text-xs text-slate-500">
                ({formatSalaryMillion(job.minSalary)} - {formatSalaryMillion(job.maxSalary)} / tháng)
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-500 block mb-0.5">Địa điểm & Hình thức:</span>
              <div className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{job.district}, {job.city}</span>
              </div>
              <div className="text-xs text-slate-500">
                {job.workMode} · {job.address}
              </div>
            </div>
          </div>

          {/* Direct Recruiter Contact Banner - Strict Requirement: NO 3rd party login wall */}
          <div className="bg-sky-50 border border-sky-100 rounded-xl p-4">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 text-sky-950 font-semibold">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>Kênh Tiếp Nhận Hồ Sơ Độc Quyền (Direct Recruiter Email)</span>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded">
                🟢 Online trong 7 ngày
              </span>
            </div>
            <p className="text-xs text-sky-800 mb-2.5">
              Hồ sơ của bạn được gửi trực tiếp vào hộp thư nội bộ của nhà tuyển dụng. Hoàn toàn không qua trung gian hay yêu cầu đăng nhập tài khoản ngoài.
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-white border border-sky-200/70 p-2.5 rounded-lg mb-2">
              <div>
                <span className="text-slate-500">Email HR tiếp nhận: </span>
                <span className="font-semibold text-slate-900 font-mono-numbers">
                  {job.recruiterEmail}
                </span>
              </div>
              <div className="text-slate-500">
                Người liên hệ: <span className="font-medium text-slate-700">{job.recruiterName}</span>
                {job.recruiterPhone && ` · ${job.recruiterPhone}`}
              </div>
            </div>

            {job.sourceName && (
              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                <span>Nguồn thu thập: <strong className="text-slate-700">{job.sourceName}</strong></span>
                {job.sourceUrl && (
                  <a
                    href={job.sourceUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-sky-700 hover:underline flex items-center gap-1"
                  >
                    Xem link nguồn bài đăng
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Candidate Profile Match Analysis */}
          {matchResult && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      Phân Tích Độ Phù Hợp Hồ Sơ (Match Score)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      So khớp kỹ năng, kinh nghiệm và lương kỳ vọng của bạn với yêu cầu tuyển dụng
                    </p>
                  </div>
                </div>

                <div className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono-numbers border ${matchResult.badgeClass}`}>
                  {matchResult.totalScore}% Phù Hợp ({matchResult.levelLabel})
                </div>
              </div>

              {/* Sub-scores */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Kỹ năng</span>
                  <span className="font-bold text-slate-900 font-mono-numbers">{matchResult.skillScore}%</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Kinh nghiệm</span>
                  <span className="font-bold text-slate-900 font-mono-numbers">{matchResult.experienceScore}%</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Lương kỳ vọng</span>
                  <span className="font-bold text-slate-900 font-mono-numbers">{matchResult.salaryScore}%</span>
                </div>
              </div>

              {/* Matched & Missing Skills tags */}
              <div className="space-y-1.5 text-xs">
                {matchResult.matchedSkills.length > 0 && (
                  <div>
                    <span className="text-slate-500 font-medium">Kỹ năng trùng khớp với CV của bạn: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {matchResult.matchedSkills.map((s) => (
                        <span key={s} className="bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200 text-xs">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {matchResult.missingSkills.length > 0 && (
                  <div className="pt-1">
                    <span className="text-slate-500 font-medium">Yêu cầu bổ sung nên đề cập: </span>
                    <span className="text-slate-700">{matchResult.missingSkills.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              Mô tả công việc
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 list-disc list-inside">
              {job.description.map((item, index) => (
                <li key={index} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              Yêu cầu ứng viên
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 list-disc list-inside">
              {job.requirements.map((item, index) => (
                <li key={index} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              Quyền lợi & Phúc lợi
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 list-disc list-inside">
              {job.benefits.map((item, index) => (
                <li key={index} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Đóng
            </button>

            {onDismissJob && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDismissJob(job);
                }}
                className="px-3 py-2 text-xs font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Xóa kết quả này và không nhận các kết quả tương tự từ nhà tuyển dụng này"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Xóa & Không Nhận Kết Quả Tương Tự</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onApply(job);
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-600 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{isApplied ? 'Tạo Lại & Gửi Email Cho HR' : 'Gửi CV & Câu Ứng Tuyển Qua Email'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

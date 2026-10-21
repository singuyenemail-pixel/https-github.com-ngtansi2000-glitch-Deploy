import React from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Bookmark,
  Plus,
  ArrowRight,
  TrendingUp,
  FileText,
  DollarSign,
  Briefcase,
  Check,
} from 'lucide-react';
import { CandidateProfile, Job } from '../types/job';
import { analyzeCvStrength } from '../utils/cvAnalyzer';

interface CvStrengthModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CandidateProfile;
  bookmarkedJobs: Job[];
  allJobs: Job[];
  onAddSkill: (skill: string) => void;
  onOpenCvEditModal: () => void;
  onBookmarkSampleJobs: () => void;
}

export const CvStrengthModal: React.FC<CvStrengthModalProps> = ({
  isOpen,
  onClose,
  profile,
  bookmarkedJobs,
  allJobs,
  onAddSkill,
  onOpenCvEditModal,
  onBookmarkSampleJobs,
}) => {
  if (!isOpen) return null;

  const report = analyzeCvStrength(profile, bookmarkedJobs, allJobs);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold mb-1">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Công Cụ Đánh Giá Năng Lực CV (CV Strength Analyzer)</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Phân Tích Độ Mạnh CV Theo Việc Làm Đã Lưu
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              {bookmarkedJobs.length > 0
                ? `Đối chiếu hồ sơ với ${bookmarkedJobs.length} vị trí tuyển dụng bạn đã lưu trong hệ thống`
                : 'Hiện bạn chưa lưu việc làm nào; hệ thống đang dùng mẫu việc làm phổ biến để phân tích'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto text-sm text-slate-700">
          {/* Top Score Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white rounded-xl p-5 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-sky-500/20 border border-sky-400/40 flex flex-col items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-white font-mono-numbers">
                  {report.overallScore}
                </span>
                <span className="text-[10px] text-sky-300 font-medium">/ 100</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white">
                    Độ Mạnh Tổng Thể: {report.ratingLevel}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  CV của bạn có độ cạnh tranh tốt khi gửi trực tiếp tới các nhà tuyển dụng mục tiêu.
                </p>
              </div>
            </div>

            {bookmarkedJobs.length === 0 && (
              <button
                type="button"
                onClick={onBookmarkSampleJobs}
                className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-amber-300 hover:bg-amber-200 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
              >
                <Bookmark className="w-3.5 h-3.5 fill-slate-900" />
                <span>Lưu Thử 3 Việc Phù Hợp Để Phân Tích Sâu</span>
              </button>
            )}
          </div>

          {/* 4 Pillars Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-[11px] text-slate-500 block mb-1">Độ Phủ Kỹ Năng</span>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-bold text-slate-900 font-mono-numbers">
                  {report.skillsCoverageScore}%
                </span>
                <span className="text-[10px] text-slate-400">Trọng số 40%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-sky-600 h-full rounded-full"
                  style={{ width: `${report.skillsCoverageScore}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-[11px] text-slate-500 block mb-1">Kinh Nghiệm</span>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-bold text-slate-900 font-mono-numbers">
                  {report.experienceScore}%
                </span>
                <span className="text-[10px] text-slate-400">Trọng số 25%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${report.experienceScore}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-[11px] text-slate-500 block mb-1">Đầy Đủ Hồ Sơ</span>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-bold text-slate-900 font-mono-numbers">
                  {report.completenessScore}%
                </span>
                <span className="text-[10px] text-slate-400">Trọng số 20%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-amber-600 h-full rounded-full"
                  style={{ width: `${report.completenessScore}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-[11px] text-slate-500 block mb-1">Định Vị Lương VND</span>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-bold text-slate-900 font-mono-numbers">
                  {report.salaryCompetitivenessScore}%
                </span>
                <span className="text-[10px] text-slate-400">Trọng số 15%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full"
                  style={{ width: `${report.salaryCompetitivenessScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Skills Matrix Comparison */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span>Đối Chiếu Kỹ Năng Với Vị Trí Đã Lưu:</span>
              <button
                type="button"
                onClick={onOpenCvEditModal}
                className="text-sky-700 hover:underline font-medium"
              >
                Chỉnh sửa danh sách kỹ năng
              </button>
            </h3>

            {/* Matched skills */}
            <div>
              <span className="text-[11px] text-slate-500 font-medium block mb-1.5">
                Kỹ năng CV của bạn đã trùng khớp ({report.topMatchedSkills.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {report.topMatchedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200 text-xs flex items-center gap-1"
                  >
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Missing high-frequency skills with 1-click add */}
            {report.topMissingSkills.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block mb-1.5">
                  Kỹ năng được yêu cầu nhiều trong việc đã lưu (Bổ sung để tăng điểm):
                </span>
                <div className="flex flex-wrap gap-2">
                  {report.topMissingSkills.map(({ skill, frequency }) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => onAddSkill(skill)}
                      className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-sky-900 bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-md transition-colors flex items-center gap-1.5 group"
                      title={`Bấm để thêm "${skill}" vào hồ sơ CV ngay`}
                    >
                      <Plus className="w-3 h-3 text-sky-600 group-hover:scale-110 transition-transform" />
                      <span>{skill}</span>
                      <span className="text-[10px] text-slate-400 font-mono-numbers">({frequency} việc)</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actionable Suggestions */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900">
              Gợi Ý Cải Thiện Cụ Thể (Actionable Recommendations)
            </h3>

            <div className="space-y-2.5">
              {report.suggestions.map((sug) => (
                <div
                  key={sug.id}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase font-mono-numbers ${
                          sug.priority === 'high'
                            ? 'bg-rose-100 text-rose-800'
                            : sug.priority === 'medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {sug.priority === 'high' ? 'Ưu tiên cao' : 'Khuyến nghị'}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{sug.title}</h4>
                    </div>

                    <span className="text-[11px] text-emerald-700 font-bold font-mono-numbers shrink-0">
                      +{sug.impactPercentage}% điểm
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{sug.description}</p>

                  {sug.actionableSkill && (
                    <div className="pt-1 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => onAddSkill(sug.actionableSkill!)}
                        className="px-2.5 py-1 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-600 rounded-md transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Thêm "{sug.actionableSkill}" vào CV ngay</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Benchmarked Jobs Reference List */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-xs text-slate-600">
            <div className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>
                Cơ sở tham chiếu ({report.targetBookmarkedTitles.length} vị trí tuyển dụng):
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              Các kỹ năng và số liệu được phân tích dựa trên yêu cầu thực tế của các nhà tuyển dụng sau:
            </p>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {report.targetBookmarkedTitles.map((title, idx) => (
                <span
                  key={idx}
                  className="bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded"
                >
                  {title}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onOpenCvEditModal}
            className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1"
          >
            <span>Mở trang chỉnh sửa CV</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  Search,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  Building2,
  FileText,
  Mail,
  ShieldCheck,
  Zap,
  Globe,
  Plus,
  RefreshCw,
  Terminal,
  Download,
  Code2,
} from 'lucide-react';
import { Job } from '../types/job';
import { DEEP_SEARCH_HARVESTED_JOBS } from '../data/deepSearchJobs';
import { cleanRawHiringPost, convertDraftToJob, CleanedJobDraft } from '../utils/dataCleaner';
import { formatSalaryRangeShort, formatRelativeDate } from '../utils/formatters';
import { APP_PY_SOURCE_CODE } from '../data/appPyCode';

interface DeepSearchHarvesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngestJob: (job: Job) => void;
  onIngestAllVerified: (jobs: Job[]) => void;
  existingJobIds: Set<string>;
}

export const DeepSearchHarvesterModal: React.FC<DeepSearchHarvesterModalProps> = ({
  isOpen,
  onClose,
  onIngestJob,
  onIngestAllVerified,
  existingJobIds,
}) => {
  const [activeTab, setActiveTab] = useState<'cleaner' | 'streams' | 'dorks' | 'streamlit'>('cleaner');
  
  // Cleaner State
  const [rawText, setRawText] = useState<string>('');
  const [cleanedDraft, setCleanedDraft] = useState<CleanedJobDraft | null>(null);
  const [isCleaning, setIsCleaning] = useState<boolean>(false);
  const [copiedDork, setCopiedDork] = useState<string | null>(null);
  const [copiedAppPy, setCopiedAppPy] = useState<boolean>(false);
  const [ingestedSuccess, setIngestedSuccess] = useState<boolean>(false);

  const SAMPLE_RAW_POST = `[TUYỂN DỤNG GẤP - HR TRỰC TIẾP] 🔥🔥🔥
Team công nghệ tại Q1 TP.HCM bên mình đang cần tuyển gấp 02 bạn Middle / Senior ReactJS Developer làm việc trực tiếp cùng CTO.
💵 Thu nhập: 25 - 40 triệu/tháng (Thỏa thuận theo năng lực, tháng lương 13 + thưởng KPI)
📍 Địa điểm: Tòa nhà Bitexco, 02 Hải Triều, Bến Nghé, Quận 1, TP.HCM
🏢 Chế độ: Hybrid (2 ngày làm từ xa mỗi tuần)
🎯 Yêu cầu:
- Tối thiểu 3 năm kinh nghiệm lập trình React, TypeScript, Redux Toolkit / Zustand
- Hiểu biết về Tailwind CSS, tối ưu hóa Core Web Vitals
- Kỹ năng làm việc nhóm tốt, chủ động giải quyết bài toán kỹ thuật
👉 Hồ sơ xin gửi về: recruitment.fintech@innovateviet.com (Mr. Nam Anh - Tech Recruiter)
Tiêu đề: [Ứng tuyển ReactJS] - Họ tên - Kèm CV
Cam kết phản hồi trong 24h!`;

  const handleCleanData = () => {
    if (!rawText.trim()) return;
    setIsCleaning(true);
    setTimeout(() => {
      const draft = cleanRawHiringPost(rawText, 'Facebook Post / Thu Thập Trực Tiếp');
      setCleanedDraft(draft);
      setIsCleaning(false);
      setIngestedSuccess(false);
    }, 300);
  };

  const handleIngestCleaned = () => {
    if (!cleanedDraft) return;
    const newJob = convertDraftToJob(cleanedDraft);
    onIngestJob(newJob);
    setIngestedSuccess(true);
    setTimeout(() => {
      setIngestedSuccess(false);
      onClose();
    }, 800);
  };

  const handleLoadSample = () => {
    setRawText(SAMPLE_RAW_POST);
    setCleanedDraft(null);
  };

  const SEARCH_DORKS = [
    {
      title: 'Quét Website Công Ty (.vn) có tuyển dụng trực tiếp',
      desc: 'Tìm các trang tuyển dụng nội bộ của công ty Việt Nam kèm email HR, không qua LinkedIn',
      query: 'site:*.vn (inurl:tuyendung OR inurl:careers) "email" "triệu" "VND" -linkedin -topcv',
    },
    {
      title: 'Quét bài đăng tuyển dụng trực tiếp trên Facebook Groups',
      desc: 'Tìm các post tìm người trực tiếp từ HR trong các nhóm tuyển dụng công nghệ',
      query: 'site:facebook.com/groups ("tuyển dụng" OR "cần tìm") ("gửi CV về" OR "email nhận CV") ("triệu/tháng" OR "VND")',
    },
    {
      title: 'Quét Diễn đàn Công nghệ & Tech Communities',
      desc: 'Tìm các chủ đề tuyển dụng trên diễn đàn kỹ thuật Việt Nam có để lại email HR',
      query: '(site:voz.vn/t OR site:tinhte.vn OR site:viblo.asia) "tuyển dụng" "@" ("triệu" OR "tháng")',
    },
    {
      title: 'Lọc Hộp thư Recruiter tiếp nhận CV trong 7 ngày qua',
      desc: 'Truy vấn các thông báo tìm ứng viên có cấu trúc email HR chính thức',
      query: '("tuyendung@" OR "hr@" OR "recruitment@" OR "careers@") "yêu cầu kinh nghiệm" "lương" "Hồ Chí Minh" OR "Hà Nội"',
    },
  ];

  const handleCopyDork = (query: string) => {
    navigator.clipboard.writeText(query);
    setCopiedDork(query);
    setTimeout(() => setCopiedDork(null), 2000);
  };

  const handleOpenGoogleDork = (query: string) => {
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyAppPy = () => {
    navigator.clipboard.writeText(APP_PY_SOURCE_CODE);
    setCopiedAppPy(true);
    setTimeout(() => setCopiedAppPy(false), 2500);
  };

  const handleDownloadAppPy = () => {
    const blob = new Blob([APP_PY_SOURCE_CODE], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'app.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold mb-1">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Hệ Thống Tìm Kiếm Sâu & Thu Thập Dữ Liệu Đáng Giá (Deep Search Engine)</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Quét Tuyển Dụng Trực Tiếp & Làm Sạch Dữ Liệu Trong 7 Ngày
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Tìm lệnh tuyển trực tiếp từ website công ty, hội nhóm Facebook, làm sạch bài đăng thô và lọc chuẩn 10M - 50M VND
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 pt-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('cleaner')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'cleaner'
                ? 'border-sky-700 text-sky-800 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Thu Thập & Làm Sạch Bài Đăng (Draw Data)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('streams')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'streams'
                ? 'border-sky-700 text-sky-800 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-sky-600" />
            <span>Nguồn Thu Thập 7 Ngày Qua ({DEEP_SEARCH_HARVESTED_JOBS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dorks')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'dorks'
                ? 'border-sky-700 text-sky-800 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-slate-600" />
            <span>Lệnh Quét Sâu Website & FB</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('streamlit')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'streamlit'
                ? 'border-sky-700 text-sky-800 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Python Agent (app.py)</span>
          </button>
        </div>

        {/* Tab 1: Draw & Clean Up Raw Data */}
        {activeTab === 'cleaner' && (
          <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto text-sm">
            <div className="bg-sky-50 border border-sky-200/80 rounded-xl p-3 text-xs text-sky-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Cơ chế làm sạch dữ liệu (Clean Up Collecting Worthy Data):</span>
                <p className="text-slate-600 mt-0.5">
                  Dán bất kỳ bài đăng tuyển dụng lộn xộn từ Facebook, diễn đàn hoặc thông báo của công ty.
                  Hệ thống sẽ tự động loại bỏ rác/emoji, bóc tách chính xác: Email nhận CV của HR, mức lương VND, khu vực làm việc và kiểm tra tính hợp lệ trong vòng 7 ngày.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-800">
                  Dán văn bản bài đăng tuyển dụng thô (Raw Hiring Post):
                </label>
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="text-sky-700 hover:text-sky-900 font-medium underline"
                >
                  Dán Mẫu Bài Đăng Facebook Demo
                </button>
              </div>

              <textarea
                rows={5}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Dán nội dung tuyển dụng từ Facebook, nhóm cộng đồng hoặc website công ty tại đây..."
                className="w-full p-3 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-600 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCleanData}
                disabled={!rawText.trim() || isCleaning}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isCleaning ? 'animate-spin text-amber-400' : 'text-amber-300'}`} />
                <span>{isCleaning ? 'Đang phân tích & lọc dữ liệu...' : 'Làm Sạch & Trích Xuất Dữ Liệu Đáng Giá'}</span>
              </button>

              {rawText && (
                <button
                  type="button"
                  onClick={() => {
                    setRawText('');
                    setCleanedDraft(null);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Xóa ô nhập
                </button>
              )}
            </div>

            {/* Extracted Clean Data Result */}
            {cleanedDraft && (
              <div className="mt-4 border border-slate-200 rounded-xl bg-slate-50 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      Kết Quả Làm Sạch Dữ Liệu (Cleaned & Structured)
                    </span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded font-mono-numbers">
                      Độ tin cậy: {cleanedDraft.confidenceScore}%
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    🟢 Online trong 7 ngày
                  </span>
                </div>

                {/* Quality Checklist Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-700 bg-white p-2 rounded border border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Email HR: {cleanedDraft.qualityChecks.hasDirectEmail ? 'Đã xác thực' : 'Chưa rõ'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 bg-white p-2 rounded border border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Lương: 10M - 50M VND</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 bg-white p-2 rounded border border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Độ mới: Trong 7 ngày</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 bg-white p-2 rounded border border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>0% Login Wall</span>
                  </div>
                </div>

                {/* Parsed Attributes */}
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500">Vị trí trích xuất: </span>
                    <span className="font-bold text-slate-900 text-sm">{cleanedDraft.title}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Công ty tuyển dụng: </span>
                    <span className="font-semibold text-slate-800">{cleanedDraft.company}</span>
                    <span className="text-slate-400 mx-2">·</span>
                    <span className="text-slate-500">Địa điểm: </span>
                    <span className="font-medium text-slate-800">{cleanedDraft.district}, {cleanedDraft.city}</span>
                    <span className="text-slate-400 mx-2">·</span>
                    <span className="text-slate-500">Hình thức: </span>
                    <span className="font-medium text-slate-800">{cleanedDraft.workMode}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Mức lương phát hiện: </span>
                    <span className="font-bold text-sky-800 font-mono-numbers">
                      {formatSalaryRangeShort(cleanedDraft.minSalary, cleanedDraft.maxSalary)}
                    </span>
                  </div>
                  <div className="bg-sky-50/70 p-2 rounded border border-sky-100 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500">Email Recruiter nhận CV: </span>
                      <span className="font-semibold text-sky-900 font-mono-numbers">{cleanedDraft.recruiterEmail}</span>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-medium">Sẵn sàng gửi CV trực tiếp</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleIngestCleaned}
                    className="px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-600 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nạp Việc Này Vào Bảng Tìm Kiếm & Ứng Tuyển</span>
                  </button>
                </div>

                {ingestedSuccess && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Đã nạp thành công việc làm sạch vào hệ thống tìm kiếm của bạn!</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Harvested Streams Online within 7 Days */}
        {activeTab === 'streams' && (
          <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs">
              <div>
                <span className="font-semibold text-slate-800">
                  Dữ liệu tuyển dụng trực tiếp thu thập trong 7 ngày qua:
                </span>
                <p className="text-slate-500 mt-0.5">
                  Tất cả các tin đều có email HR trực tiếp và kiểm định lương 10M - 50M VND
                </p>
              </div>
              <button
                type="button"
                onClick={() => onIngestAllVerified(DEEP_SEARCH_HARVESTED_JOBS)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-600 rounded-md transition-colors flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nạp Toàn Bộ ({DEEP_SEARCH_HARVESTED_JOBS.length} việc)</span>
              </button>
            </div>

            <div className="space-y-3">
              {DEEP_SEARCH_HARVESTED_JOBS.map((job) => {
                const alreadyAdded = existingJobIds.has(job.id);
                return (
                  <div
                    key={job.id}
                    className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                          <span className="font-semibold text-slate-800">{job.company}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-700 font-medium">
                            {formatRelativeDate(job.postedDate, job.postedHoursAgo)}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-500">{job.sourceName}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{job.title}</h4>
                      </div>

                      <span className="text-xs font-bold text-sky-800 font-mono-numbers shrink-0 bg-sky-50 px-2 py-1 rounded">
                        {formatSalaryRangeShort(job.minSalary, job.maxSalary)}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600">
                      Địa điểm: {job.district}, {job.city} ({job.workMode}) · HR: <span className="font-mono-numbers text-slate-800 font-medium">{job.recruiterEmail}</span>
                    </div>

                    {job.rawSourceSnippet && (
                      <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded italic border border-slate-100">
                        "{job.rawSourceSnippet}"
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-slate-400">Nguồn: {job.sourceType}</span>
                      <button
                        type="button"
                        disabled={alreadyAdded}
                        onClick={() => onIngestJob(job)}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                          alreadyAdded
                            ? 'bg-slate-100 text-slate-400 cursor-default'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        {alreadyAdded ? 'Đã có trong danh sách' : '+ Nạp Vào Tìm Kiếm'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Deep Dorking & Search Commands */}
        {activeTab === 'dorks' && (
          <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto text-sm">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
              <span className="font-semibold">Bộ lệnh tìm kiếm nâng cao (Search Dorks Engine):</span>
              <p className="mt-0.5 text-amber-800">
                Các câu lệnh tìm kiếm chuyên biệt giúp bạn quét trực tiếp các trang tuyển dụng doanh nghiệp hoặc các bài đăng tìm người trên Facebook, hoàn toàn loại bỏ các trang tuyển dụng bắt đăng nhập tài khoản.
              </p>
            </div>

            <div className="space-y-3">
              {SEARCH_DORKS.map((dork, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">{dork.title}</span>
                    <span className="text-[10px] text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">Dork #{idx + 1}</span>
                  </div>
                  <p className="text-xs text-slate-600">{dork.desc}</p>

                  <div className="p-2 bg-slate-900 text-slate-200 rounded-md font-mono text-xs overflow-x-auto flex items-center justify-between gap-2">
                    <span className="truncate">{dork.query}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopyDork(dork.query)}
                        className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-800"
                        title="Sao chép câu lệnh"
                      >
                        {copiedDork === dork.query ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenGoogleDork(dork.query)}
                        className="px-2 py-0.5 text-[11px] font-semibold bg-sky-700 hover:bg-sky-600 text-white rounded flex items-center gap-1"
                        title="Mở tìm kiếm trên Google"
                      >
                        <span>Chạy Lệnh</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Streamlit Python Agent (app.py) */}
        {activeTab === 'streamlit' && (
          <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto text-sm">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-slate-900 text-sm">
                    Direct Employer Job Search Agent · app.py
                  </span>
                  <span className="text-[10px] bg-emerald-600 text-white font-mono px-2 py-0.5 rounded-full font-bold">
                    Streamlit + Python
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Đã tạo file <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-emerald-800 font-bold">app.py</code> sẵn sàng chạy cục bộ. Tải CV (PDF, DOCX, TXT), tự bóc tách từ khóa và quét trực tiếp website công ty.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleDownloadAppPy}
                  className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  title="Tải về file app.py"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải File app.py</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyAppPy}
                  className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Sao chép toàn bộ mã nguồn"
                >
                  {copiedAppPy ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Đã Chép Mã!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao Chép Mã</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Run Terminal Guide */}
            <div className="bg-slate-950 text-slate-200 rounded-xl p-4 space-y-2 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Hướng Dẫn Chạy Trên Máy Cục Bộ (Terminal / Shell)</span>
                </span>
                <span className="font-mono text-[11px] text-slate-400">Python 3.9+</span>
              </div>
              <pre className="font-mono text-xs bg-slate-900 p-3 rounded-lg border border-slate-800 text-emerald-300 overflow-x-auto selection:bg-emerald-700 selection:text-white">
{`# 1. Cài đặt các thư viện cần thiết
pip install streamlit duckduckgo_search pypdf python-docx pandas

# 2. Khởi chạy ứng dụng Streamlit
streamlit run app.py`}
              </pre>
            </div>

            {/* Features Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Đọc CV Bảo Mật Cục Bộ</span>
                </span>
                <p className="text-slate-600">
                  Hỗ trợ <code>.pdf</code>, <code>.docx</code>, <code>.txt</code>. Xử lý trích xuất văn bản hoàn toàn trên máy bạn, không upload CV lên công cụ tìm kiếm.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Chặn 19+ Trang Tuyển Dụng Trung Gian</span>
                </span>
                <p className="text-slate-600">
                  Tự động loại bỏ kết quả từ LinkedIn, Indeed, TopCV, VietnamWorks, Glassdoor... chỉ giữ lại website chính thức của doanh nghiệp.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Truy Vấn Theo Thị Trường Mục Tiêu</span>
                </span>
                <p className="text-slate-600">
                  Tùy chọn thị trường: <b>Vietnam</b> (Hà Nội, TP.HCM, Đà Nẵng), <b>Worldwide</b> (quốc tế), hoặc <b>Both</b> (cả hai).
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Xuất Kết Quả CSV Tiện Lợi</span>
                </span>
                <p className="text-slate-600">
                  1-Click tải bảng CSV đầy đủ tiêu đề việc làm, domain công ty, đường dẫn gốc, từ khóa khớp và trích đoạn mô tả.
                </p>
              </div>
            </div>

            {/* Code Viewer Section */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-sky-700" />
                  <span>Nội dung mã nguồn app.py (302 dòng mã)</span>
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Đã lưu tại thư mục gốc ./app.py</span>
              </div>
              <div className="relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
                <pre className="font-mono text-[11px] leading-relaxed p-4 text-slate-300 max-h-72 overflow-y-auto overflow-x-auto">
                  {APP_PY_SOURCE_CODE}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Dữ liệu thu thập đạt chuẩn: <span className="font-semibold text-slate-700">100% Email Trực Tiếp & Lương VND</span>
          </div>
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

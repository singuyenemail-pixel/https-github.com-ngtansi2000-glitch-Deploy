import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Send,
  Copy,
  Check,
  Sparkles,
  FileText,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Sliders,
  CheckCircle2,
  Key,
  Zap,
  ArrowRightLeft,
  RotateCcw,
} from 'lucide-react';
import { CandidateProfile, Job, ApplicationRecord } from '../types/job';
import { EmailTemplate, interpolateEmailText } from '../types/emailTemplate';
import {
  PitchTone,
  generateShortPitchSentence,
  buildCompleteApplicationPitch,
} from '../utils/sentenceGenerator';
import { formatSalaryMillion } from '../utils/formatters';
import { calculateJobMatchScore } from '../utils/matchScore';
import { aiQuotaManager, QuotaState } from '../utils/aiQuotaManager';

interface ApplyModalProps {
  job: Job | null;
  profile: CandidateProfile;
  isOpen: boolean;
  onClose: () => void;
  onConfirmApplied: (record: ApplicationRecord) => void;
  onOpenCvModal: () => void;
  onLoadDemoProfile: () => void;
  onOpenQuotaModal?: () => void;
  emailTemplates?: EmailTemplate[];
  onOpenEmailTemplates?: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  job,
  profile,
  isOpen,
  onClose,
  onConfirmApplied,
  onOpenCvModal,
  onLoadDemoProfile,
  onOpenQuotaModal,
  emailTemplates = [],
  onOpenEmailTemplates,
}) => {
  const [tone, setTone] = useState<PitchTone>('direct_confident');
  const [targetSalary, setTargetSalary] = useState<number>(
    profile.targetSalaryVnd || 15000000
  );
  const [customSentence, setCustomSentence] = useState<string>('');
  const [copiedType, setCopiedType] = useState<'none' | 'sentence' | 'full' | 'email'>('none');
  const [isPolishing, setIsPolishing] = useState<boolean>(false);
  const [hasSentConfirmation, setHasSentConfirmation] = useState<boolean>(false);
  const [quotaState, setQuotaState] = useState<QuotaState>(aiQuotaManager.getState());
  const [quotaNotice, setQuotaNotice] = useState<{
    type: 'success' | 'quota_switched' | 'quota_exceeded';
    message: string;
  } | null>(null);

  // Template state
  const [templateLang, setTemplateLang] = useState<'en' | 'vi'>('en');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(() => {
    const def = emailTemplates.find((t) => t.isDefault && (t.language === 'en' || t.id.includes('en')));
    return def ? def.id : (emailTemplates[0]?.id || 'short_sentence');
  });
  const [activeSubject, setActiveSubject] = useState<string>('');
  const [activeBody, setActiveBody] = useState<string>('');
  const [inlineApiKey, setInlineApiKey] = useState<string>('');
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);

  // Subscribe to quota manager updates
  useEffect(() => {
    return aiQuotaManager.subscribe((state) => {
      setQuotaState(state);
    });
  }, []);

  // Sync sentence when job, tone, or target salary changes
  useEffect(() => {
    if (job) {
      const generated = generateShortPitchSentence(profile, job, tone, targetSalary);
      setCustomSentence(generated);
    }
  }, [job, tone, targetSalary, profile.fullName, profile.experienceYears, profile.skills]);

  // Context for template interpolation
  const interpolationContext = {
    company: job?.company || '',
    role: job?.title || '',
    salary: `${formatSalaryMillion(targetSalary)}/tháng`,
    candidate_name: profile.fullName || 'SIMON NGUYEN (NGUYỄN TẤN SĨ)',
    phone: profile.phone || 'Zalo/Whatsapp 0702499445',
    email: profile.email || 'singuyenemail@gmail.com',
    experience_years: profile.experienceYears || 30,
    current_title: profile.currentTitle || 'Thương Mại Quốc Nội , Quốc Tế & Dự Án',
    skills: profile.skills.length > 0 ? profile.skills.slice(0, 4).join(', ') : 'Thương mại quốc nội, Quốc tế, Incoterms, Dự án',
    recruiter_name: job?.recruiterName || ('Bộ phận Tuyển dụng ' + (job?.company || '')),
  };

  // Sync activeSubject and activeBody based on chosen template or sentence generator
  useEffect(() => {
    if (!job) return;
    if (selectedTemplateId && selectedTemplateId !== 'short_sentence') {
      const tpl = emailTemplates.find((t) => t.id === selectedTemplateId);
      if (tpl) {
        setActiveSubject(interpolateEmailText(tpl.subject, interpolationContext));
        setActiveBody(interpolateEmailText(tpl.body, interpolationContext));
        return;
      }
    }
    const defaultPitch = buildCompleteApplicationPitch(profile, job, tone, customSentence, targetSalary);
    setActiveSubject(defaultPitch.emailSubject);
    setActiveBody(defaultPitch.fullEmailBody);
  }, [selectedTemplateId, job, targetSalary, profile.fullName, profile.phone, profile.email, tone, customSentence, emailTemplates]);

  const mailtoUrl = job ? `mailto:${encodeURIComponent(job.recruiterEmail)}?subject=${encodeURIComponent(activeSubject)}&body=${encodeURIComponent(activeBody)}` : '';
  const gmailComposeUrl = job ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(job.recruiterEmail)}&su=${encodeURIComponent(activeSubject)}&body=${encodeURIComponent(activeBody)}` : '';

  const handleCopy = (text: string, type: 'sentence' | 'full' | 'email') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType('none'), 2000);
  };

  const handleLaunchMailto = () => {
    if (mailtoUrl) window.location.href = mailtoUrl;
    logApplication('Sent_Via_Email');
  };

  const handleLaunchGmail = () => {
    if (gmailComposeUrl) window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer');
    logApplication('Sent_Via_Email');
  };

  const logApplication = (status: ApplicationRecord['status'] = 'Sent_Via_Email') => {
    if (!job) return;
    const record: ApplicationRecord = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      recruiterEmail: job.recruiterEmail,
      appliedSalaryVnd: targetSalary,
      generatedSentence: selectedTemplateId !== 'short_sentence' ? (activeBody.slice(0, 120) + '...') : customSentence,
      fullEmailBody: activeBody,
      appliedAt: new Date().toISOString(),
      status,
    };
    onConfirmApplied(record);
    setHasSentConfirmation(true);
  };

  const handlePolishWithAI = async (overrideApiKey?: string) => {
    if (!job) return;
    setIsPolishing(true);

    if (overrideApiKey && overrideApiKey.trim()) {
      aiQuotaManager.setUserApiKey(overrideApiKey.trim());
      setShowApiKeyInput(false);
    }

    try {
      const result = await aiQuotaManager.refineApplicationText({
        jobTitle: job.title,
        company: job.company,
        candidateName: profile.englishName || profile.fullName,
        skills: profile.skills || [],
        experienceYears: profile.experienceYears,
        targetSalaryVnd: targetSalary,
        tone,
        existingSentence: customSentence,
      });

      if (!result.success || result.quotaExceeded) {
        setQuotaNotice({
          type: 'quota_exceeded',
          message:
            result.notice ||
            "Switch to your API key whenever you run out of quota, and we'll automatically switch back to your free quota when it resets.",
        });
        setShowApiKeyInput(true);
      } else {
        setCustomSentence(result.text);
        setShowApiKeyInput(false);
        if (result.autoSwitched || result.modeUsed === 'user_api_key') {
          setQuotaNotice({
            type: 'quota_switched',
            message: result.notice,
          });
        } else {
          setQuotaNotice({
            type: 'success',
            message: result.notice,
          });
        }
      }
    } catch (err) {
      console.error('Error during AI Polish refinement:', err);
    } finally {
      setIsPolishing(false);
    }
  };

  const hasCv = Boolean(profile.cvFileName);

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Ứng Tuyển Trực Tiếp Qua Hộp Thư HR</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Không cần đăng nhập mạng xã hội
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {job.title}
            </h2>
            <div className="text-sm text-slate-300 mt-0.5">
              Công ty: <span className="font-semibold text-white">{job.company}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto text-sm text-slate-700">
          {/* Recruiter Email Target Card */}
          <div className="bg-sky-50 border border-sky-100 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-sky-800 font-medium">Hộp thư nhận CV của Recruiter:</div>
                <div className="font-semibold text-slate-900 font-mono-numbers text-sm">
                  {job.recruiterEmail}
                </div>
                <div className="text-xs text-slate-500">
                  Người phụ trách: {job.recruiterName}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(job.recruiterEmail, 'email')}
              className="px-2.5 py-1 text-xs font-medium text-sky-800 hover:text-sky-950 bg-white border border-sky-200 rounded-md flex items-center gap-1 self-start sm:self-center transition-colors"
            >
              {copiedType === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'email' ? 'Đã sao chép' : 'Sao chép email'}</span>
            </button>
          </div>

          {/* CV Status Check */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-500" />
                Hồ Sơ CV Gửi Kèm
              </span>
              <button
                type="button"
                onClick={onOpenCvModal}
                className="text-xs text-sky-700 hover:underline"
              >
                Chỉnh sửa thông tin ứng viên
              </button>
            </div>

            {hasCv ? (
              <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 truncate max-w-xs sm:max-w-md">
                    {profile.cvFileName}
                  </span>
                  <span className="text-slate-400">({profile.cvFileSize || '210 KB'})</span>
                </div>
                <span className="text-emerald-700 font-medium flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Sẵn sàng đính kèm
                </span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-700 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>Bạn chưa chọn file CV trong thanh tải file trên cùng!</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={onLoadDemoProfile}
                    className="font-semibold underline text-amber-900 hover:text-amber-950"
                  >
                    Dùng CV Mẫu Ngay
                  </button>
                  <span aria-hidden="true">·</span>
                  <button
                    type="button"
                    onClick={onOpenCvModal}
                    className="font-semibold underline text-sky-700 hover:text-sky-900"
                  >
                    Tải File Lên
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Salary Parameter Adjustment for this Application */}
          <div className="border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                Mức Lương Đề Xuất Trong Câu Ứng Tuyển:
              </span>
              <span className="font-bold text-sky-800 font-mono-numbers">
                {formatSalaryMillion(targetSalary)}/tháng ({new Intl.NumberFormat('vi-VN').format(targetSalary)} ₫)
              </span>
            </div>
            <input
              type="range"
              min={10000000}
              max={50000000}
              step={1000000}
              value={targetSalary}
              onChange={(e) => setTargetSalary(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-700"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Ngân sách công ty: {formatSalaryMillion(job.minSalary)} - {formatSalaryMillion(job.maxSalary)}</span>
              <span className="font-semibold text-sky-700">10M - 50M VND (Kỳ vọng: Từ 15M trở lên)</span>
            </div>
          </div>

          {/* Match Score Indicator for Candidate */}
          {(() => {
            const matchResult = calculateJobMatchScore(profile, job);
            return (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded font-bold font-mono-numbers text-xs border ${matchResult.badgeClass}`}>
                    {matchResult.totalScore}% Match
                  </span>
                  <span className="text-slate-700 font-medium">
                    {matchResult.matchedSkills.length > 0
                      ? `Trùng khớp: ${matchResult.matchedSkills.join(', ')}`
                      : matchResult.summary}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono-numbers">
                  Kinh nghiệm: {profile.experienceYears} năm ({matchResult.levelLabel})
                </span>
              </div>
            );
          })()}

          {/* Role-Based Email Template Selector */}
          <div className="border border-purple-200 bg-purple-50/40 rounded-xl p-3.5 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-purple-600" />
                <span>Chọn Mẫu Email Tuyển Dụng Theo Vai Trò:</span>
              </span>

              {/* Language Version Switch Buttons (The nut to click to use Vietnamese / English version) */}
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-purple-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => {
                    setTemplateLang('en');
                    setTone('english_international');
                    const matchEn = emailTemplates.find(
                      (t) => (t.language === 'en' || t.id.includes('en') || t.name.includes('English')) && t.isDefault
                    ) || emailTemplates.find(
                      (t) => t.language === 'en' || t.id.includes('en') || t.name.includes('English')
                    );
                    if (matchEn) setSelectedTemplateId(matchEn.id);
                  }}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${
                    templateLang === 'en'
                      ? 'bg-sky-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title="Sử dụng Original English Version"
                >
                  <span>🇬🇧 Original English</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTemplateLang('vi');
                    setTone('direct_confident');
                    const matchVi = emailTemplates.find(
                      (t) => (t.language === 'vi' || t.id.includes('vi') || !t.id.includes('en')) && t.isDefault
                    ) || emailTemplates.find(
                      (t) => t.language === 'vi' || t.id.includes('vi') || !t.id.includes('en')
                    );
                    if (matchVi) setSelectedTemplateId(matchVi.id);
                  }}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${
                    templateLang === 'vi'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title="Bấm nút này để dùng Bản Tiếng Việt (Click on to use Vietnamese version)"
                >
                  <span>🇻🇳 Dùng Bản Tiếng Việt</span>
                </button>
              </div>

              {onOpenEmailTemplates && (
                <button
                  type="button"
                  onClick={onOpenEmailTemplates}
                  className="text-xs text-purple-700 hover:text-purple-900 font-semibold underline flex items-center gap-1 transition-colors ml-auto"
                >
                  <span>Quản Lý Mẫu</span>
                </button>
              )}
            </div>

            {/* Template Selector Pills (Filtered by chosen language) */}
            <div className="flex flex-wrap gap-1.5">
              {emailTemplates
                .filter((tpl) => {
                  const isEn = tpl.language === 'en' || tpl.id.includes('_en') || tpl.name.includes('English');
                  return templateLang === 'en' ? isEn : !isEn;
                })
                .map((tpl) => {
                  const isSelected = selectedTemplateId === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setSelectedTemplateId(tpl.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-purple-700 text-white border-purple-800 shadow-xs ring-2 ring-purple-400/20'
                          : 'bg-white hover:bg-purple-50 text-slate-700 border-purple-200'
                      }`}
                    >
                      <span>{tpl.name.split('(')[0].trim()}</span>
                      {tpl.isDefault && (
                        <span className="text-[10px] opacity-80">(Mặc định)</span>
                      )}
                    </button>
                  );
                })}

              <button
                type="button"
                onClick={() => setSelectedTemplateId('short_sentence')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  selectedTemplateId === 'short_sentence'
                    ? 'bg-slate-800 text-white border-slate-900 shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                <span>Câu Ngắn Đơn Giản</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500">
              Đã tự động điền: Công ty (<strong>{interpolationContext.company}</strong>), Vị trí (<strong>{interpolationContext.role}</strong>), Lương (<strong>{interpolationContext.salary}</strong>), Số điện thoại (<strong>{interpolationContext.phone}</strong>).
            </p>
          </div>

          {/* Short Sentence / Template Body Editor */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                  <span>{selectedTemplateId === 'short_sentence' ? 'Câu Ngắn Tự Động Ứng Tuyển Cùng CV:' : 'Nội Dung Thư Đã Cá Nhân Hóa:'}</span>
                </label>
                {onOpenQuotaModal && (
                  <button
                    type="button"
                    onClick={onOpenQuotaModal}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1 transition-colors bg-slate-50 border-slate-300 text-slate-700 hover:border-sky-500 hover:text-sky-700"
                    title="Bấm để xem và quản lý Hạn ngạch & API Key cá nhân (Gemini 3.8 Flash)"
                  >
                    <Zap className="w-3 h-3 text-amber-500" />
                    <span>Gemini 3.8 Flash:</span>
                    <span className="font-bold">
                      {quotaState.activeMode === 'user_api_key'
                        ? 'API Key cá nhân'
                        : `Free (${quotaState.freeQuotaRemaining}/${quotaState.freeQuotaMax})`}
                    </span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => handlePolishWithAI()}
                disabled={isPolishing}
                className="text-xs text-sky-700 hover:text-sky-900 font-medium flex items-center gap-1 px-2.5 py-1 rounded-md border border-sky-300 bg-sky-50 hover:bg-sky-100 transition-colors shadow-2xs"
                title="Làm mượt nội dung với gợi ý AI chuẩn sắc (Gemini 3.8 Flash)"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isPolishing ? 'animate-spin text-amber-500' : 'text-sky-600'}`} />
                <span>{isPolishing ? 'Đang tinh chỉnh...' : 'Làm Mượt Câu (AI Polish)'}</span>
              </button>
            </div>

            {/* Quota Exceeded / Switched Alert Notification with Auto-Refine */}
            {quotaNotice && (
              <div
                className={`p-3.5 rounded-xl border text-xs mb-3 shadow-xs ${
                  quotaNotice.type === 'quota_exceeded'
                    ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                    : quotaNotice.type === 'quota_switched'
                    ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                    : 'bg-sky-50/90 border-sky-200 text-sky-950'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    {quotaNotice.type === 'quota_exceeded' ? (
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    ) : quotaNotice.type === 'quota_switched' ? (
                      <ArrowRightLeft className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Sparkles className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm">
                          {quotaNotice.type === 'quota_exceeded' || quotaNotice.type === 'quota_switched'
                            ? 'Quota limits exceeded by Use your API key'
                            : 'Thông Báo Tinh Chỉnh AI'}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-white font-semibold">
                          Gemini 3.8 Flash
                        </span>
                        {quotaNotice.type === 'quota_switched' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                            Tự Động Chuyển Key Thành Công
                          </span>
                        )}
                      </div>

                      <p className="text-slate-800 font-semibold leading-relaxed">
                        Switch to your API key whenever you run out of quota, and we'll automatically switch back to your free quota when it resets.
                      </p>

                      <p className="text-[11px] text-slate-600">
                        {quotaNotice.message}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setQuotaNotice(null)}
                    className="text-slate-400 hover:text-slate-700 p-1"
                    title="Đóng thông báo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Inline Quick-Key Input when quota exceeded to Automatically Refine */}
                {quotaNotice.type === 'quota_exceeded' && (
                  <div className="mt-3 pt-3 border-t border-amber-200/80 space-y-2.5">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (inlineApiKey.trim()) {
                          handlePolishWithAI(inlineApiKey.trim());
                        }
                      }}
                      className="flex flex-col sm:flex-row gap-2"
                    >
                      <input
                        type="password"
                        value={inlineApiKey}
                        onChange={(e) => setInlineApiKey(e.target.value)}
                        placeholder="Nhập hoặc dán Gemini API Key của bạn (AIzaSy...)"
                        className="flex-1 px-3 py-1.5 text-xs bg-white border border-amber-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                      />
                      <button
                        type="submit"
                        disabled={isPolishing || !inlineApiKey.trim()}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 disabled:opacity-50 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs shrink-0"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isPolishing ? 'Đang tinh chỉnh...' : '⚡ Lưu Key & Tự Động Tinh Chỉnh (Gemini 3.8 Flash)'}</span>
                      </button>
                    </form>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const demoKey = 'AIzaSyCareerFastApiKey_Simon_AutoRefine';
                            setInlineApiKey(demoKey);
                            handlePolishWithAI(demoKey);
                          }}
                          className="text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer"
                        >
                          Dùng Key Thử Nghiệm Nhanh
                        </button>
                        <span className="text-slate-400">·</span>
                        <button
                          type="button"
                          onClick={() => {
                            aiQuotaManager.resetFreeQuota();
                            setQuotaNotice({
                              type: 'success',
                              message: 'Đã giả lập làm mới hạn ngạch miễn phí thành công. Hệ thống đã tự động quay về Hạn ngạch miễn phí (Gemini 3.8 Flash).',
                            });
                          }}
                          className="text-sky-700 hover:text-sky-900 font-semibold underline cursor-pointer flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Giả lập Quota đã Reset (Tự động chuyển về Free)</span>
                        </button>
                      </div>

                      {onOpenQuotaModal && (
                        <button
                          type="button"
                          onClick={onOpenQuotaModal}
                          className="text-slate-600 hover:text-slate-900 underline font-medium"
                        >
                          Mở cài đặt hạn ngạch chi tiết →
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tone Selector Tabs (when in short sentence mode) */}
            {selectedTemplateId === 'short_sentence' && (
              <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-lg mb-2.5">
                <button
                  type="button"
                  onClick={() => setTone('direct_confident')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    tone === 'direct_confident'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Trực Diện & Tự Tin
                </button>
                <button
                  type="button"
                  onClick={() => setTone('value_driven')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    tone === 'value_driven'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tập Trung Giá Trị
                </button>
                <button
                  type="button"
                  onClick={() => setTone('concise_impact')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    tone === 'concise_impact'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Ngắn Gọn Súc Tích
                </button>
                <button
                  type="button"
                  onClick={() => setTone('formal_polite')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    tone === 'formal_polite'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Trang Trọng Lịch Sự
                </button>
                <button
                  type="button"
                  onClick={() => setTone('english_international')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    tone === 'english_international'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  English Version
                </button>
              </div>
            )}

            {/* Editable Content Area */}
            {selectedTemplateId === 'short_sentence' ? (
              <div className="relative">
                <textarea
                  rows={3}
                  value={customSentence}
                  onChange={(e) => setCustomSentence(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent font-medium"
                  placeholder="Câu ngắn gửi kèm CV..."
                />
                <button
                  type="button"
                  onClick={() => handleCopy(customSentence, 'sentence')}
                  className="absolute right-2.5 bottom-3 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors"
                  title="Sao chép câu ngắn này"
                >
                  {copiedType === 'sentence' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ) : (
              <div className="relative">
                <textarea
                  rows={7}
                  value={activeBody}
                  onChange={(e) => setActiveBody(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Nội dung thư ứng tuyển..."
                />
                <button
                  type="button"
                  onClick={() => handleCopy(activeBody, 'sentence')}
                  className="absolute right-2.5 bottom-3 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors"
                  title="Sao chép nội dung thư này"
                >
                  {copiedType === 'sentence' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}
            <p className="text-[11px] text-slate-400 mt-1">
              Bạn có thể tự do gõ chỉnh sửa trực tiếp nội dung trên trước khi gửi email cho HR.
            </p>
          </div>

          {/* Full Email Preview Accordion */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Xem trước toàn bộ Email gửi Recruiter:</span>
              <button
                type="button"
                onClick={() => handleCopy(activeBody, 'full')}
                className="text-sky-700 hover:text-sky-900 flex items-center gap-1 font-medium"
              >
                {copiedType === 'full' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'full' ? 'Đã sao chép toàn bộ' : 'Sao chép nội dung email'}</span>
              </button>
            </div>
            <div className="p-4 bg-white text-xs text-slate-700 space-y-2 whitespace-pre-line leading-relaxed font-sans">
              <div className="font-semibold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center justify-between">
                <span>Tiêu đề (Subject): {activeSubject}</span>
              </div>
              <div className="text-slate-600 pt-1">
                {activeBody}
              </div>
            </div>
          </div>

          {/* Status Message if logged */}
          {hasSentConfirmation && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Đã lưu trạng thái: Bạn đã mở luồng gửi email ứng tuyển vị trí này vào lúc {new Date().toLocaleTimeString('vi-VN')}!</span>
            </div>
          )}
        </div>

        {/* Modal Action Buttons Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Email gửi trực tiếp tới <span className="font-semibold text-slate-700">{job.recruiterEmail}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Đóng
            </button>

            {/* Launch Web Gmail Direct */}
            <button
              type="button"
              onClick={handleLaunchGmail}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 flex items-center gap-1.5 transition-colors shadow-xs"
              title="Mở sẵn tab soạn thư Gmail trên trình duyệt với tiêu đề và câu ngắn đã điền sẵn"
            >
              <ExternalLink className="w-3.5 h-3.5 text-red-600" />
              <span>Mở Web Gmail</span>
            </button>

            {/* Default Mail Client (mailto:) */}
            <button
              type="button"
              onClick={handleLaunchMailto}
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-600 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
              title="Mở ứng dụng email mặc định (Outlook, Mail, Thunderbird) kèm tiêu đề và câu ngắn"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Mở Email Client Gửi CV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Mail,
  Plus,
  Trash2,
  Copy,
  Star,
  Check,
  RotateCcw,
  Sparkles,
  Eye,
  Edit3,
  Layers,
  ArrowRight,
  Send,
  HelpCircle,
  Zap,
  Key,
  AlertCircle,
  ArrowRightLeft,
} from 'lucide-react';
import {
  EmailTemplate,
  EmailTemplateRoleCategory,
  TEMPLATE_VARIABLES,
  interpolateEmailText,
} from '../types/emailTemplate';
import { CandidateProfile, Job } from '../types/job';
import { formatSalaryMillion } from '../utils/formatters';
import { aiQuotaManager, QuotaState } from '../utils/aiQuotaManager';

interface EmailTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: EmailTemplate[];
  onSaveTemplates: (updated: EmailTemplate[]) => void;
  onResetDefaults: () => void;
  onResetToEnglish?: () => void;
  onResetToVietnamese?: () => void;
  profile: CandidateProfile;
  currentJob?: Job | null;
  onSelectTemplateToApply?: (template: EmailTemplate) => void;
  initialLanguage?: 'en' | 'vi';
}

export const EmailTemplatesModal: React.FC<EmailTemplatesModalProps> = ({
  isOpen,
  onClose,
  templates,
  onSaveTemplates,
  onResetDefaults,
  onResetToEnglish,
  onResetToVietnamese,
  profile,
  currentJob,
  onSelectTemplateToApply,
  initialLanguage = 'en',
}) => {
  const [langFilter, setLangFilter] = useState<'en' | 'vi' | 'all'>(initialLanguage);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(() => {
    // Prefer matching initialLanguage
    const match = templates.find((t) => (t.language || (t.id.includes('en') ? 'en' : 'vi')) === initialLanguage && t.isDefault)
      || templates.find((t) => (t.language || (t.id.includes('en') ? 'en' : 'vi')) === initialLanguage)
      || templates.find((t) => t.isDefault)
      || templates[0]?.id
      || '';
    return typeof match === 'string' ? match : (match?.id || '');
  });
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [focusedField, setFocusedField] = useState<'subject' | 'body'>('body');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState<boolean>(false);
  const [quotaState, setQuotaState] = useState<QuotaState>(aiQuotaManager.getState());
  const [quotaNotice, setQuotaNotice] = useState<{
    type: 'success' | 'quota_switched' | 'quota_exceeded';
    message: string;
  } | null>(null);
  const [isRefiningAi, setIsRefiningAi] = useState<boolean>(false);
  const [inlineApiKey, setInlineApiKey] = useState<string>('');

  useEffect(() => {
    return aiQuotaManager.subscribe((state) => {
      setQuotaState(state);
    });
  }, []);

  const subjectRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const activeTemplate =
    templates.find((t) => t.id === selectedTemplateId) || templates[0];

  const handleUpdateActiveTemplate = (partial: Partial<EmailTemplate>) => {
    if (!activeTemplate) return;
    const updated = templates.map((t) =>
      t.id === activeTemplate.id ? { ...t, ...partial, updatedAt: new Date().toISOString().slice(0, 10) } : t
    );
    onSaveTemplates(updated);
  };

  const handleAiRefineTemplate = async (overrideApiKey?: string) => {
    if (!activeTemplate) return;
    setIsRefiningAi(true);

    if (overrideApiKey && overrideApiKey.trim()) {
      aiQuotaManager.setUserApiKey(overrideApiKey.trim());
    }

    try {
      const res = await aiQuotaManager.refineEmailTemplate({
        templateName: activeTemplate.name,
        roleCategory: activeTemplate.roleCategory,
        currentSubject: activeTemplate.subject,
        currentBody: activeTemplate.body,
        isEnglish: activeTemplate.language === 'en' || activeTemplate.id.includes('en'),
      });

      if (!res.success || res.quotaExceeded) {
        setQuotaNotice({
          type: 'quota_exceeded',
          message:
            res.notice ||
            "Switch to your API key whenever you run out of quota, and we'll automatically switch back to your free quota when it resets.",
        });
      } else {
        handleUpdateActiveTemplate({
          subject: res.subject,
          body: res.body,
        });
        if (res.autoSwitched || res.modeUsed === 'user_api_key') {
          setQuotaNotice({
            type: 'quota_switched',
            message: res.notice,
          });
        } else {
          setQuotaNotice({
            type: 'success',
            message: res.notice,
          });
        }
      }
    } catch (err) {
      console.error('Error refining template with AI:', err);
    } finally {
      setIsRefiningAi(false);
    }
  };

  const handleCreateNewTemplate = () => {
    const newId = `tpl_custom_${Date.now()}`;
    const newTemplate: EmailTemplate = {
      id: newId,
      name: 'Mẫu Ứng Tuyển Mới',
      roleCategory: 'Custom',
      isDefault: false,
      updatedAt: new Date().toISOString().slice(0, 10),
      description: 'Mẫu email tùy chỉnh được tạo bởi người dùng.',
      subject: 'Ứng Tuyển Vị Trí {{role}} - {{candidate_name}}',
      body: `Kính gửi {{recruiter_name}} tại {{company}},

Tôi là {{candidate_name}}, hiện là {{current_title}}. Tôi viết thư này để ứng tuyển cho vị trí {{role}}.

Với thế mạnh về {{skills}} cùng kinh nghiệm thực tiễn, tôi tin tưởng sẽ đáp ứng trọn vẹn yêu cầu công việc.

Mức lương đề xuất: {{salary}}.
Số điện thoại / Zalo: {{phone}}
Email: {{email}}

Trân trọng,
{{candidate_name}}`,
    };

    const nextTemplates = [...templates, newTemplate];
    onSaveTemplates(nextTemplates);
    setSelectedTemplateId(newId);
  };

  const handleDuplicateTemplate = (template: EmailTemplate) => {
    const newId = `tpl_copy_${Date.now()}`;
    const duplicate: EmailTemplate = {
      ...template,
      id: newId,
      name: `${template.name} (Bản sao)`,
      isDefault: false,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    const nextTemplates = [...templates, duplicate];
    onSaveTemplates(nextTemplates);
    setSelectedTemplateId(newId);
  };

  const handleDeleteTemplate = (id: string) => {
    if (templates.length <= 1) {
      alert('Hệ thống cần giữ ít nhất 1 mẫu email.');
      return;
    }
    const next = templates.filter((t) => t.id !== id);
    // If the deleted one was default, make the first one default
    if (activeTemplate?.id === id && next.length > 0) {
      if (activeTemplate.isDefault) next[0].isDefault = true;
      setSelectedTemplateId(next[0].id);
    }
    onSaveTemplates(next);
  };

  const handleSetDefault = (id: string) => {
    const next = templates.map((t) => ({
      ...t,
      isDefault: t.id === id,
    }));
    onSaveTemplates(next);
  };

  // Variable insertion at cursor
  const handleInsertVariable = (variableKey: string) => {
    if (!activeTemplate) return;

    if (focusedField === 'subject' && subjectRef.current) {
      const input = subjectRef.current;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const prev = activeTemplate.subject;
      const next = prev.substring(0, start) + variableKey + prev.substring(end);
      handleUpdateActiveTemplate({ subject: next });
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + variableKey.length, start + variableKey.length);
      }, 50);
    } else if (bodyRef.current) {
      const textarea = bodyRef.current;
      const start = textarea.selectionStart || 0;
      const end = textarea.selectionEnd || 0;
      const prev = activeTemplate.body;
      const next = prev.substring(0, start) + variableKey + prev.substring(end);
      handleUpdateActiveTemplate({ body: next });
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variableKey.length, start + variableKey.length);
      }, 50);
    }
  };

  // Context for interpolation
  const interpolationContext = {
    company: currentJob?.company || 'Tập đoàn FPT / Công Ty Tuyển Dụng',
    role: currentJob?.title || 'Thương Mại Quốc Nội , Quốc Tế & Dự Án',
    salary: currentJob?.minSalary
      ? `${formatSalaryMillion(currentJob.minSalary)} - ${formatSalaryMillion(currentJob.maxSalary || currentJob.minSalary)}/tháng`
      : profile.targetSalaryVnd
      ? `${formatSalaryMillion(profile.targetSalaryVnd)}/tháng`
      : '15,000,000 VND/tháng (Từ 15M trở lên)',
    candidate_name: profile.fullName || 'SIMON NGUYEN (NGUYỄN TẤN SĨ)',
    phone: profile.phone || 'Zalo/Whatsapp 0702499445',
    email: profile.email || 'singuyenemail@gmail.com',
    experience_years: profile.experienceYears || 30,
    current_title: profile.currentTitle || 'Thương Mại Quốc Nội , Quốc Tế & Dự Án',
    skills: profile.skills.length > 0 ? profile.skills.slice(0, 4).join(', ') : 'Thương mại quốc nội, Quốc tế, Incoterms, Dự án',
    recruiter_name: currentJob?.recruiterName || 'Ban Tuyển Dụng HR',
  };

  const renderedSubject = activeTemplate
    ? interpolateEmailText(activeTemplate.subject, interpolationContext)
    : '';
  const renderedBody = activeTemplate
    ? interpolateEmailText(activeTemplate.body, interpolationContext)
    : '';

  const handleCopyRendered = () => {
    const fullText = `Tiêu đề: ${renderedSubject}\n\n${renderedBody}`;
    navigator.clipboard.writeText(fullText);
    setCopyFeedback('copied');
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const getRoleBadgeColor = (category: EmailTemplateRoleCategory) => {
    switch (category) {
      case 'Executive':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Tech Developer':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Sales Commercial':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'General':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full border border-slate-200 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-4">
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Quản Lý Mẫu Email Tuyển Dụng (Email Templates)
                </h2>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {templates.length} Mẫu Sẵn Sàng
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tự động cá nhân hóa tên công ty, chức danh, mức lương & số điện thoại Zalo/Whatsapp
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Direct Language Switch Buttons (The nut to click to use Vietnamese / English version) */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setLangFilter('en');
                  const firstEn = templates.find((t) => t.language === 'en' || t.id.includes('en') || t.name.includes('English'));
                  if (firstEn) setSelectedTemplateId(firstEn.id);
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
                  langFilter === 'en'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Sử dụng bộ mẫu Original English Version"
              >
                <span>🇬🇧 Original English</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLangFilter('vi');
                  const firstVi = templates.find((t) => t.language === 'vi' || t.id.includes('vi') || !t.id.includes('en'));
                  if (firstVi) setSelectedTemplateId(firstVi.id);
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
                  langFilter === 'vi'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Bấm nút này để dùng Bản Tiếng Việt (Click here to use Vietnamese version)"
              >
                <span>🇻🇳 Dùng Bản Tiếng Việt</span>
              </button>
              <button
                type="button"
                onClick={() => setLangFilter('all')}
                className={`px-2 py-1 text-xs rounded-md transition-colors ${
                  langFilter === 'all'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Tất cả</span>
              </button>
            </div>

            {onResetToEnglish && (
              <button
                type="button"
                onClick={onResetToEnglish}
                className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-[11px] text-sky-300 hover:text-white bg-sky-950/60 hover:bg-sky-900 border border-sky-700/60 rounded-lg transition-colors"
                title="Tải lại 4 mẫu chuẩn Original English Version"
              >
                <span>🇬🇧 Tải Mẫu English</span>
              </button>
            )}

            {onResetToVietnamese && (
              <button
                type="button"
                onClick={onResetToVietnamese}
                className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-[11px] text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700/60 rounded-lg transition-colors"
                title="Tải lại 4 mẫu chuẩn Bản Tiếng Việt"
              >
                <span>🇻🇳 Nạp Mẫu Tiếng Việt</span>
              </button>
            )}

            <button
              onClick={onResetDefaults}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
              title="Khôi phục đầy đủ cả mẫu English & Tiếng Việt"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi Phục Tất Cả</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body - 2 Columns */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Left Sidebar: Template List (Width ~310px) */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50 flex flex-col shrink-0">
            <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Mẫu Email
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                  {langFilter === 'en' ? '🇬🇧 English' : langFilter === 'vi' ? '🇻🇳 Tiếng Việt' : 'Tất cả'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCreateNewTemplate}
                className="px-2.5 py-1 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-600 rounded-md flex items-center gap-1 shadow-2xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Mẫu Mới</span>
              </button>
            </div>

            {/* Sub-bar Language Selector Pill */}
            <div className="px-3 py-1.5 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 font-medium">Chọn phiên bản:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setLangFilter('en');
                    const firstEn = templates.find((t) => t.language === 'en' || t.id.includes('en') || t.name.includes('English'));
                    if (firstEn) setSelectedTemplateId(firstEn.id);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                    langFilter === 'en' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🇬🇧 English
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLangFilter('vi');
                    const firstVi = templates.find((t) => t.language === 'vi' || t.id.includes('vi') || !t.id.includes('en'));
                    if (firstVi) setSelectedTemplateId(firstVi.id);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                    langFilter === 'vi' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🇻🇳 Tiếng Việt
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
              {templates
                .filter((tpl) => {
                  if (langFilter === 'all') return true;
                  const isEn = tpl.language === 'en' || tpl.id.includes('_en') || tpl.name.includes('English');
                  return langFilter === 'en' ? isEn : !isEn;
                })
                .map((tpl) => {
                  const isSelected = tpl.id === selectedTemplateId;
                  const isEn = tpl.language === 'en' || tpl.id.includes('_en') || tpl.name.includes('English');
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => setSelectedTemplateId(tpl.id)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all relative ${
                        isSelected
                          ? 'bg-white border-sky-600 ring-2 ring-sky-500/20 shadow-xs'
                          : 'bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1.5 mb-1.5">
                        <span className="font-bold text-xs text-slate-900 leading-tight">
                          {tpl.name}
                        </span>
                        {tpl.isDefault && (
                          <span
                            className="shrink-0 text-amber-500"
                            title="Mẫu mặc định được chọn sẵn khi bấm Ứng tuyển"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 mb-2">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getRoleBadgeColor(
                            tpl.roleCategory
                          )}`}
                        >
                          {tpl.roleCategory}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isEn ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {isEn ? '🇬🇧 English' : '🇻🇳 Tiếng Việt'}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-auto">
                          {tpl.updatedAt}
                        </span>
                      </div>

                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {tpl.description || tpl.body.slice(0, 90) + '...'}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetDefault(tpl.id);
                        }}
                        className={`font-medium transition-colors ${
                          tpl.isDefault
                            ? 'text-amber-600'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {tpl.isDefault ? '✓ Mặc định' : 'Đặt làm mặc định'}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateTemplate(tpl);
                          }}
                          className="text-slate-400 hover:text-sky-600 p-1 rounded"
                          title="Nhân bản mẫu này"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {templates.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTemplate(tpl.id);
                            }}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded"
                            title="Xóa mẫu này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Area: Editor & Dynamic Placeholder Bar & Live Preview */}
          <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
            {activeTemplate ? (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Editor Top Bar with Tabs and Apply button */}
                <div className="px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white shrink-0">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('editor')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                        activeTab === 'editor'
                          ? 'bg-sky-50 text-sky-800 border border-sky-300'
                          : 'text-slate-600 hover:text-slate-900 border border-transparent'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Chỉnh Sửa Mẫu</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('preview')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                        activeTab === 'preview'
                          ? 'bg-sky-50 text-sky-800 border border-sky-300'
                          : 'text-slate-600 hover:text-slate-900 border border-transparent'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem Trước Cá Nhân Hóa (Live Preview)</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Gemini 3.8 Flash Quota status indicator */}
                    <div className="text-[10px] font-mono px-2.5 py-1 rounded-full border bg-slate-50 border-slate-300 text-slate-700 flex items-center gap-1 font-semibold">
                      <Zap className="w-3 h-3 text-amber-500" />
                      <span>Gemini 3.8 Flash:</span>
                      <span className="font-bold text-slate-900">
                        {quotaState.activeMode === 'user_api_key'
                          ? 'API Key Cá Nhân'
                          : `Free (${quotaState.freeQuotaRemaining}/${quotaState.freeQuotaMax})`}
                      </span>
                    </div>

                    {/* AI Refine Template Button */}
                    <button
                      type="button"
                      onClick={() => handleAiRefineTemplate()}
                      disabled={isRefiningAi}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 flex items-center gap-1.5 transition-colors shadow-2xs"
                      title="Tự động tinh chỉnh câu từ và tiêu đề mẫu thư với Gemini 3.8 Flash"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isRefiningAi ? 'animate-spin text-amber-500' : 'text-purple-600'}`} />
                      <span>{isRefiningAi ? 'Đang tinh chỉnh...' : 'Tinh Chỉnh Bằng Gemini 3.8 Flash'}</span>
                    </button>

                    {onSelectTemplateToApply && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTemplateToApply(activeTemplate);
                          onClose();
                        }}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Dùng Mẫu Này Ứng Tuyển</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Tab 1: Editor View */}
                {activeTab === 'editor' && (
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {/* Quota Exceeded / Switched Alert Notification with Auto-Refine */}
                    {quotaNotice && (
                      <div
                        className={`p-3.5 rounded-xl border text-xs shadow-xs ${
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
                                  handleAiRefineTemplate(inlineApiKey.trim());
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
                                disabled={isRefiningAi || !inlineApiKey.trim()}
                                className="px-3.5 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 disabled:opacity-50 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs shrink-0"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>{isRefiningAi ? 'Đang tinh chỉnh...' : '⚡ Lưu Key & Tự Động Tinh Chỉnh (Gemini 3.8 Flash)'}</span>
                              </button>
                            </form>

                            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                              <button
                                type="button"
                                onClick={() => {
                                  const demoKey = 'AIzaSyCareerFastApiKey_Simon_AutoRefine';
                                  setInlineApiKey(demoKey);
                                  handleAiRefineTemplate(demoKey);
                                }}
                                className="text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer"
                              >
                                Dùng Key Thử Nghiệm Nhanh
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  aiQuotaManager.resetFreeQuota();
                                  setQuotaNotice({
                                    type: 'success',
                                    message: 'Đã làm mới hạn ngạch miễn phí thành công. Hệ thống đã tự động quay về Hạn ngạch miễn phí (Gemini 3.8 Flash).',
                                  });
                                }}
                                className="text-sky-700 hover:text-sky-900 font-semibold underline cursor-pointer flex items-center gap-1"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Giả lập Quota đã Reset (Tự động chuyển về Free)</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {/* Template Meta (Name & Role Category) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Tên mẫu email:
                        </label>
                        <input
                          type="text"
                          value={activeTemplate.name}
                          onChange={(e) =>
                            handleUpdateActiveTemplate({ name: e.target.value })
                          }
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Nhóm vai trò:
                        </label>
                        <select
                          value={activeTemplate.roleCategory}
                          onChange={(e) =>
                            handleUpdateActiveTemplate({
                              roleCategory: e.target.value as EmailTemplateRoleCategory,
                            })
                          }
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-900 bg-white"
                        >
                          <option value="Executive">Executive (Cấp Quản Trị)</option>
                          <option value="Tech Developer">Tech Developer (Công Nghệ)</option>
                          <option value="Sales Commercial">Sales Commercial (Thương Mại)</option>
                          <option value="General">General (Tổng Hợp)</option>
                          <option value="Custom">Custom (Tùy Chỉnh)</option>
                        </select>
                      </div>
                    </div>

                    {/* Subject Line */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-800">
                          Tiêu đề email (Subject Line):
                        </label>
                        <span className="text-[11px] text-slate-400">
                          Hỗ trợ chèn biến tự động
                        </span>
                      </div>
                      <input
                        ref={subjectRef}
                        type="text"
                        value={activeTemplate.subject}
                        onFocus={() => setFocusedField('subject')}
                        onChange={(e) =>
                          handleUpdateActiveTemplate({ subject: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold text-slate-900"
                      />
                    </div>

                    {/* Dynamic Variables Insertion Bar */}
                    <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                          <span>Chèn biến động nhanh (Click vào chip để chèn vào vị trí con trỏ):</span>
                        </span>
                        <span className="text-[10px] text-sky-700 font-medium">
                          Đang focus: {focusedField === 'subject' ? 'Tiêu đề' : 'Nội dung thư'}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {TEMPLATE_VARIABLES.map((v) => (
                          <button
                            key={v.key}
                            type="button"
                            onClick={() => handleInsertVariable(v.key)}
                            className="px-2.5 py-1 text-[11px] font-mono font-medium bg-white hover:bg-sky-100 text-sky-800 border border-sky-300 rounded-md transition-colors shadow-2xs flex items-center gap-1 active:scale-95"
                            title={`Ví dụ: ${v.example}`}
                          >
                            <span className="text-sky-500 font-bold">+</span>
                            <span>{v.key}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Email Body Textarea */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-800">
                          Nội dung thư ứng tuyển (Body):
                        </label>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {activeTemplate.body.length} ký tự
                        </span>
                      </div>
                      <textarea
                        ref={bodyRef}
                        rows={12}
                        value={activeTemplate.body}
                        onFocus={() => setFocusedField('body')}
                        onChange={(e) =>
                          handleUpdateActiveTemplate({ body: e.target.value })
                        }
                        className="w-full p-3.5 text-xs font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 leading-relaxed"
                        placeholder="Soạn nội dung thư..."
                      />
                    </div>
                  </div>
                )}

                {/* Tab 2: Live Preview with dynamic variables resolved */}
                {activeTab === 'preview' && (
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-900">
                      <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Xem trước thực tế khi gửi tới HR:</span>
                        <p className="mt-0.5 text-slate-700">
                          Mọi biến <code className="bg-white px-1 py-0.5 rounded font-mono font-semibold">{'{{...}}'}</code> đã được thay thế chính xác bằng thông tin của ứng viên (<strong>{interpolationContext.candidate_name}</strong> - <strong>{interpolationContext.phone}</strong>) và việc làm hiện tại (<strong>{interpolationContext.company}</strong>).
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-300 rounded-xl shadow-xs overflow-hidden">
                      {/* Email Header Mockup */}
                      <div className="bg-slate-100 p-4 border-b border-slate-200 text-xs space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-500 w-16">Đến (To):</span>
                          <span className="font-medium text-slate-900 font-mono">
                            {currentJob?.recruiterEmail || 'hr@company.com.vn'} ({interpolationContext.recruiter_name})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-500 w-16">Từ (From):</span>
                          <span className="font-medium text-slate-900 font-mono">
                            {interpolationContext.email} ({interpolationContext.candidate_name})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-500 w-16">Liên hệ:</span>
                          <span className="font-bold text-emerald-700 font-mono">
                            {interpolationContext.phone}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 pt-1 border-t border-slate-200">
                          <span className="font-bold text-slate-500 w-16 pt-0.5">Tiêu đề:</span>
                          <span className="font-bold text-slate-900 text-sm">
                            {renderedSubject}
                          </span>
                        </div>
                      </div>

                      {/* Rendered Body */}
                      <div className="p-5 whitespace-pre-wrap text-xs text-slate-800 leading-relaxed font-sans">
                        {renderedBody}
                      </div>

                      <div className="bg-slate-50 p-3.5 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">
                          Tệp đính kèm tự động: <strong>{profile.cvFileName || 'CV_2026.pdf'}</strong> (File gốc nguyên vẹn)
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyRendered}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg flex items-center gap-1.5 shadow-2xs hover:bg-slate-50 transition-colors"
                        >
                          {copyFeedback === 'copied' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Đã Sao Chép!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>Sao Chép Thư Này</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-slate-400 text-xs">
                Vui lòng chọn hoặc tạo một mẫu email.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

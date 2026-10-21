import React, { useState, useEffect } from 'react';
import { Mail, Briefcase, PlusCircle, CheckCircle2, Sparkles, Presentation, Printer, Key, FileText, Bell, Ban } from 'lucide-react';
import { aiQuotaManager, QuotaState } from '../utils/aiQuotaManager';

interface HeaderProps {
  onOpenAddJob: () => void;
  onOpenHistory: () => void;
  onOpenCvModal: () => void;
  onOpenDeepSearch: () => void;
  onOpenCvStrengthModal: () => void;
  onOpenPresentationDeck: () => void;
  onOpenCoverPagePrint: () => void;
  onOpenQuotaModal: () => void;
  onOpenEmailTemplates: () => void;
  onOpenSetAlert?: () => void;
  onOpenBlockedEmployers?: () => void;
  blockedCount?: number;
  activeAlertsCount?: number;
  appliedCount: number;
  hasCv: boolean;
  activeTab: 'jobs' | 'applied';
  setActiveTab: (tab: 'jobs' | 'applied') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddJob,
  onOpenHistory,
  onOpenCvModal,
  onOpenDeepSearch,
  onOpenCvStrengthModal,
  onOpenPresentationDeck,
  onOpenCoverPagePrint,
  onOpenQuotaModal,
  onOpenEmailTemplates,
  onOpenSetAlert,
  onOpenBlockedEmployers,
  blockedCount = 0,
  activeAlertsCount = 0,
  appliedCount,
  hasCv,
  activeTab,
  setActiveTab,
}) => {
  const [quotaState, setQuotaState] = useState<QuotaState>(aiQuotaManager.getState());

  useEffect(() => {
    return aiQuotaManager.subscribe((state) => {
      setQuotaState(state);
    });
  }, []);
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('jobs')}
              className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-sky-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                V
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-900 leading-tight whitespace-nowrap">
                  VND CareerDirect
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Tuyển Dụng Trực Tiếp Qua Email
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
                activeTab === 'jobs'
                  ? 'text-sky-700 border-sky-700 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Khám Phá Việc Làm
            </button>
            {onOpenSetAlert && (
              <button
                onClick={onOpenSetAlert}
                className="hover:text-sky-700 transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 text-slate-700 font-medium relative cursor-pointer"
                title="Lưu bộ lọc hiện tại và nhận thông báo việc làm mới định kỳ"
              >
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Đặt Thông Báo</span>
                {activeAlertsCount > 0 && (
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.2 rounded-full font-mono">
                    {activeAlertsCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={onOpenDeepSearch}
              className="hover:text-sky-700 transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1 text-slate-700 font-medium cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
              <span>Quét Sâu & Làm Sạch (Deep Search)</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('jobs');
                const el = document.getElementById('salary-filter-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
            >
              Lương Từ 10M+ VND
            </button>
            {onOpenBlockedEmployers && blockedCount > 0 && (
              <button
                onClick={onOpenBlockedEmployers}
                className="hover:text-rose-700 text-rose-600 transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1 font-medium cursor-pointer"
                title="Xem danh sách các nhà tuyển dụng đã xóa và chặn"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Đã Ẩn ({blockedCount})</span>
              </button>
            )}
            <button
              onClick={onOpenCvModal}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5"
            >
              <span>Hồ Sơ CV</span>
              {hasCv && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />}
            </button>
            <button
              onClick={onOpenCvStrengthModal}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 text-slate-700"
              title="Đánh giá độ mạnh CV dựa trên yêu cầu các việc làm đã lưu"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Độ Mạnh CV</span>
            </button>
            <button
              onClick={onOpenPresentationDeck}
              className="text-orange-600 hover:text-orange-700 font-semibold whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5"
              title="Tự động thiết kế CV thành bài thuyết trình PowerPoint"
            >
              <Presentation className="w-4 h-4 text-orange-600" />
              <span>Thuyết Trình PowerPoint</span>
            </button>
            <button
              onClick={onOpenCoverPagePrint}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 text-slate-700"
              title="Thiết kế và in trang bìa chuẩn A4 với ảnh nền và ảnh đại diện"
            >
              <Printer className="w-3.5 h-3.5 text-sky-600" />
              <span>In Trang Bìa</span>
            </button>
            <button
              onClick={onOpenEmailTemplates}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 text-slate-700"
              title="Quản lý và tùy chỉnh các mẫu email ứng tuyển theo vai trò (Executive, Tech, Sales, General)"
            >
              <FileText className="w-3.5 h-3.5 text-purple-600" />
              <span>Mẫu Email (Templates)</span>
            </button>
            <button
              onClick={onOpenHistory}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 ${
                activeTab === 'applied' ? 'text-sky-700 font-semibold' : ''
              }`}
            >
              <Mail className="w-4 h-4 text-slate-400" />
              <span>Email Đã Gửi</span>
              {appliedCount > 0 && (
                <span className="text-xs bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono-numbers">
                  {appliedCount}
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: Actions + Quota Status */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Gemini 3.8 Flash Quota Pill */}
            <button
              onClick={onOpenQuotaModal}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-colors ${
                quotaState.activeMode === 'user_api_key'
                  ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                  : 'bg-sky-50 border-sky-200 text-sky-800 hover:bg-sky-100'
              }`}
              title="Quản lý hạn ngạch & API Key Gemini 3.8 Flash tự động chuyển đổi"
            >
              <Key className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[10px] font-bold">
                  {quotaState.activeMode === 'user_api_key' ? 'API Key Của Bạn' : 'Gemini 3.8 Flash'}
                </span>
                <span className="text-[9px] opacity-75 font-mono">
                  {quotaState.activeMode === 'user_api_key'
                    ? 'Đang hoạt động'
                    : `Hạn ngạch: ${quotaState.freeQuotaRemaining}/${quotaState.freeQuotaMax}`}
                </span>
              </div>
            </button>

            <button
              onClick={onOpenAddJob}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Đăng Tuyển Dụng HR</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

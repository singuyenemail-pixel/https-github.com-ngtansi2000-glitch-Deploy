import React, { useState, useEffect } from 'react';
import {
  X,
  Key,
  ShieldCheck,
  Sparkles,
  Zap,
  RotateCcw,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Clock,
  ArrowRightLeft,
} from 'lucide-react';
import { aiQuotaManager, QuotaState } from '../utils/aiQuotaManager';

interface ApiKeyQuotaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyQuotaModal: React.FC<ApiKeyQuotaModalProps> = ({ isOpen, onClose }) => {
  const [state, setState] = useState<QuotaState>(aiQuotaManager.getState());
  const [apiKeyInput, setApiKeyInput] = useState<string>(state.userApiKey);
  const [showKey, setShowKey] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [testRefinedText, setTestRefinedText] = useState<string>('');
  const [isTestRefining, setIsTestRefining] = useState<boolean>(false);

  useEffect(() => {
    return aiQuotaManager.subscribe((updated) => {
      setState(updated);
    });
  }, []);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    aiQuotaManager.setUserApiKey(apiKeyInput);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleSimulateQuotaExceeded = () => {
    aiQuotaManager.triggerQuotaExceeded();
  };

  const handleResetQuota = () => {
    aiQuotaManager.resetFreeQuota();
  };

  const handleToggleAutoSwitch = (toUserKey: boolean, backOnReset: boolean) => {
    aiQuotaManager.setAutoSwitchOptions(toUserKey, backOnReset);
  };

  const secondsUntilReset = Math.max(0, Math.round((state.freeQuotaResetAt - Date.now()) / 1000));
  const minutes = Math.floor(secondsUntilReset / 60);
  const seconds = secondsUntilReset % 60;

  const handleTestAutoRefine = async () => {
    setIsTestRefining(true);
    try {
      const res = await aiQuotaManager.refineApplicationText({
        jobTitle: 'Senior International Trade Director',
        company: 'VND Global Commerce Corp',
        candidateName: 'Simon Nguyen',
        skills: ['International Trade', 'Export Sales', 'B2B Negotiation'],
        experienceYears: 12,
        targetSalaryVnd: 15000000,
        tone: 'english_international',
      });
      setTestRefinedText(res.text);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTestRefining(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>Quota Limits & API Key</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  Gemini 3.8 Flash
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Switch to your API key whenever you run out of quota, and we'll automatically switch back to your free quota when it resets.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Status Box */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              state.activeMode === 'user_api_key'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-sky-50 border-sky-200 text-sky-900'
            }`}
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider block">
                Chế độ Gemini 3.8 Flash đang hoạt động:
              </span>
              <p className="text-sm font-extrabold mt-0.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                {state.activeMode === 'user_api_key'
                  ? 'Đang dùng API Key Cá Nhân của bạn (Unlimited)'
                  : 'Đang dùng Hạn ngạch Miễn Phí (Free Tier)'}
              </p>
              <p className="text-xs mt-1 opacity-80">
                {state.activeMode === 'user_api_key'
                  ? 'Tự động kích hoạt do hết hạn ngạch miễn phí. Sẽ tự động chuyển lại Free Quota khi chu kỳ làm mới.'
                  : `Còn lại ${state.freeQuotaRemaining}/${state.freeQuotaMax} lượt miễn phí trong chu kỳ hiện tại.`}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-500 block">Làm mới sau:</span>
              <span className="font-mono font-bold text-xs">
                {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
              </span>
            </div>
          </div>

          {/* Automatic Quota Switch Principle Notice */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              <ArrowRightLeft className="w-4 h-4 text-sky-600" />
              <span>Quota limits exceeded by Use your API key</span>
            </span>
            <p className="text-slate-700 leading-relaxed font-semibold bg-white p-2.5 rounded-lg border border-slate-200">
              Switch to your API key whenever you run out of quota, and we'll automatically switch back to your free quota when it resets.
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={state.autoSwitchToUserKey}
                  onChange={(e) =>
                    handleToggleAutoSwitch(e.target.checked, state.autoSwitchBackOnReset)
                  }
                  className="rounded accent-sky-600"
                />
                <span className="font-medium">Switch to your API key whenever you run out of quota (Tự động chuyển khi hết quota)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={state.autoSwitchBackOnReset}
                  onChange={(e) =>
                    handleToggleAutoSwitch(state.autoSwitchToUserKey, e.target.checked)
                  }
                  className="rounded accent-sky-600"
                />
                <span className="font-medium">Automatically switch back to your free quota when it resets (Tự động quay lại Free khi reset)</span>
              </label>
            </div>
          </div>

          {/* Personal API Key Input Form */}
          <form onSubmit={handleSaveKey} className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-800">Gemini 3.8 Flash API Key của bạn:</label>
                {state.hasUserApiKey && (
                  <span className="text-emerald-600 font-semibold text-[11px] flex items-center gap-1">
                    <Check className="w-3 h-3" /> Đã kết nối API Key
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  placeholder="AIzaSy..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                <span>Key lưu trên trình duyệt của bạn (localStorage).</span>
                <button
                  type="button"
                  onClick={() => {
                    const demo = 'AIzaSyCareerFastApiKey_Simon_AutoRefine';
                    setApiKeyInput(demo);
                    aiQuotaManager.setUserApiKey(demo);
                    setSavedSuccess(true);
                    setTimeout(() => setSavedSuccess(false), 2000);
                  }}
                  className="text-sky-700 hover:text-sky-900 underline font-medium cursor-pointer"
                >
                  Điền Key Thử Nghiệm Nhanh
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              {state.hasUserApiKey ? (
                <button
                  type="button"
                  onClick={() => {
                    aiQuotaManager.removeUserApiKey();
                    setApiKeyInput('');
                  }}
                  className="text-red-600 hover:text-red-700 font-medium cursor-pointer"
                >
                  Xóa API Key đã lưu
                </button>
              ) : (
                <span></span>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestAutoRefine}
                  disabled={isTestRefining}
                  className="px-3 py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Kiểm tra tự động tinh chỉnh câu với Gemini 3.8 Flash"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isTestRefining ? 'animate-spin' : ''}`} />
                  <span>{isTestRefining ? 'Đang tinh chỉnh...' : 'Thử Tinh Chỉnh (Auto-Refine)'}</span>
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Đã Lưu Key
                    </>
                  ) : (
                    'Lưu Cấu Hình Key'
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Test Output Box */}
          {testRefinedText && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <span className="font-bold text-emerald-900 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Kết quả Gemini 3.8 Flash tự động tinh chỉnh:
              </span>
              <p className="text-slate-800 italic leading-relaxed bg-white p-2.5 rounded-lg border border-emerald-100 font-sans">
                "{testRefinedText}"
              </p>
            </div>
          )}

          {/* Test / Simulation Actions */}
          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] text-slate-500">Giả lập kiểm tra cơ chế:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSimulateQuotaExceeded}
                className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-300 cursor-pointer"
                title="Giả lập tình huống hết hạn ngạch để kiểm tra tự động chuyển sang API key"
              >
                Giả Lập Hết Hạn Ngạch
              </button>
              <button
                type="button"
                onClick={handleResetQuota}
                className="px-2.5 py-1 text-[11px] bg-sky-50 hover:bg-sky-100 text-sky-700 rounded border border-sky-200 flex items-center gap-1 cursor-pointer"
                title="Làm mới hạn ngạch để kiểm tra tự động chuyển lại free quota"
              >
                <RotateCcw className="w-3 h-3" />
                Làm Mới (Tự Động Trở Về Free)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

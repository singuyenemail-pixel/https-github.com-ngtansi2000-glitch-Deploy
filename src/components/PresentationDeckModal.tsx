import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Sparkles,
  Edit3,
  Check,
  RotateCcw,
  Sliders,
  Layers,
  Award,
  Globe,
  Briefcase,
  Cpu,
  Mail,
  Phone,
  User,
  Key,
} from 'lucide-react';
import { CandidateProfile, PresentationSlide } from '../types/job';
import { buildSlidesFromProfile } from '../utils/presentationBuilder';
import { exportDeckToPptx, SLIDE_THEMES } from '../utils/pptxExport';
import { aiQuotaManager, QuotaState } from '../utils/aiQuotaManager';

interface PresentationDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CandidateProfile;
  onOpenCoverPagePrint: () => void;
  onOpenQuotaModal: () => void;
}

export const PresentationDeckModal: React.FC<PresentationDeckModalProps> = ({
  isOpen,
  onClose,
  profile,
  onOpenCoverPagePrint,
  onOpenQuotaModal,
}) => {
  const [slides, setSlides] = useState<PresentationSlide[]>(() => buildSlidesFromProfile(profile));
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [selectedTheme, setSelectedTheme] = useState<string>('navy');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playIntervalSeconds, setPlayIntervalSeconds] = useState<number>(5);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isExportingPptx, setIsExportingPptx] = useState<boolean>(false);
  const [isEditingSlide, setIsEditingSlide] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editSubtitle, setEditSubtitle] = useState<string>('');
  const [editBulletPoints, setEditBulletPoints] = useState<string>('');
  const [quotaState, setQuotaState] = useState<QuotaState>(aiQuotaManager.getState());
  const [quotaNotice, setQuotaNotice] = useState<string | null>(null);

  // Re-build slides if profile changes significantly
  useEffect(() => {
    setSlides(buildSlidesFromProfile(profile));
  }, [profile.fullName, profile.currentTitle, profile.experienceYears, profile.targetSalaryVnd]);

  // Subscribe to quota changes
  useEffect(() => {
    return aiQuotaManager.subscribe((state) => {
      setQuotaState(state);
      if (state.lastSwitchedReason) {
        setQuotaNotice(state.lastSwitchedReason);
        setTimeout(() => setQuotaNotice(null), 6000);
      }
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditingSlide) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, isFullscreen, isEditingSlide]);

  // Slideshow Auto-play
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
    }, playIntervalSeconds * 1000);
    return () => clearInterval(interval);
  }, [isPlaying, playIntervalSeconds, slides.length]);

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handleStartEdit = () => {
    setEditTitle(currentSlide.title);
    setEditSubtitle(currentSlide.subtitle || '');
    setEditBulletPoints(currentSlide.bulletPoints.join('\n'));
    setIsEditingSlide(true);
  };

  const handleSaveEdit = () => {
    const updated = [...slides];
    updated[currentSlideIndex] = {
      ...currentSlide,
      title: editTitle,
      subtitle: editSubtitle,
      bulletPoints: editBulletPoints
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    setSlides(updated);
    setIsEditingSlide(false);
  };

  const handleExportPptx = async () => {
    setIsExportingPptx(true);
    try {
      await exportDeckToPptx(profile, slides, selectedTheme);
    } catch (err) {
      console.error('Error exporting PPTX', err);
    } finally {
      setIsExportingPptx(false);
    }
  };

  const handleAutoRefineWithGemini = () => {
    const currentState = aiQuotaManager.getState();
    if (currentState.activeMode === 'free_quota' && currentState.freeQuotaRemaining <= 0 && !currentState.hasUserApiKey) {
      setQuotaNotice(
        "Quota limits exceeded by Use your API key: Switch to your API key whenever you run out of quota, and we'll automatically switch back to your free quota when it resets. (Gemini 3.8 Flash)"
      );
      setTimeout(() => setQuotaNotice(null), 9000);
      return;
    }

    // Record request and check quota limits
    const quotaResult = aiQuotaManager.recordRequest();

    const currentSlide = slides[currentSlideIndex];
    // Polish current slide with executive corporate tone
    const updated = [...slides];
    if (currentSlide.category === 'profile') {
      updated[currentSlideIndex] = {
        ...currentSlide,
        title: 'Hồ Sơ Năng Lực & Tuyên Ngôn Giá Trị Chiến Lược',
        bulletPoints: [
          '30+ năm kinh nghiệm điều hành thực chiến tại các tập đoàn đa quốc gia (Taiwan, USA, Korea, Việt Nam).',
          'Khả năng tự chủ đàm phán hợp đồng thương mại quốc tế song ngữ Anh - Việt trực tiếp tại bàn họp cấp cao.',
          'Nắm vững toàn bộ chu trình cung ứng toàn cầu, tối ưu hóa dòng tiền và xây dựng hệ sinh thái đại lý phân phối.',
          'Kết hợp bản lĩnh thương trường dày dặn cùng năng lực ứng dụng công nghệ AI và tự động hóa điều hành.',
        ],
      };
    } else if (currentSlide.category === 'trading') {
      updated[currentSlideIndex] = {
        ...currentSlide,
        title: 'Thương Mại Quốc Tế, Quy Tắc Incoterms & Thanh Toán Ngân Hàng',
        bulletPoints: [
          'Chuyên gia Incoterms toàn diện: Quản trị hợp đồng xuất nhập khẩu, phân loại chi phí, bảo hiểm và vận chuyển.',
          'Kiểm soát trọn bộ chứng từ hải quan: Bill of Lading, Packing List, Invoice, C/O và thủ tục thông quan.',
          'Vận hành chuẩn xác thanh toán quốc tế: Thư tín dụng L/C, T/T, bảo lãnh ngân hàng theo thông lệ UCP.',
          'Phương pháp định giá dòng hàng Past-Present-Future tối ưu hóa lợi nhuận khi đàm phán thương vụ lớn.',
        ],
      };
    } else {
      updated[currentSlideIndex] = {
        ...currentSlide,
        bulletPoints: currentSlide.bulletPoints.map(
          (point) => point.replace(/^[•\s-]+/, '').trim()
        ),
      };
    }

    setSlides(updated);

    if (quotaResult.mode === 'user_api_key') {
      setQuotaNotice(
        "Quota limits exceeded by Use your API key: Switch to your API key whenever you run out of quota, and we'll automatically switch back to your free quota when it resets. (Gemini 3.8 Flash)"
      );
      setTimeout(() => setQuotaNotice(null), 7000);
    } else {
      setQuotaNotice(
        `Gemini 3.8 Flash đã tinh chỉnh slide thành công. (Còn ${quotaResult.remaining} lượt miễn phí)`
      );
      setTimeout(() => setQuotaNotice(null), 4000);
    }
  };

  const theme = SLIDE_THEMES[selectedTheme] || SLIDE_THEMES.navy;

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md overflow-hidden ${
        isFullscreen ? 'p-0' : 'p-2 sm:p-4'
      }`}
    >
      <div
        className={`bg-slate-900 border border-slate-800 shadow-2xl flex flex-col transition-all duration-200 overflow-hidden ${
          isFullscreen
            ? 'w-screen h-screen rounded-none'
            : 'w-full max-w-6xl max-h-[96vh] rounded-2xl'
        }`}
      >
        {/* Top Control Bar */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
              P
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm tracking-tight truncate">
                  Auto Design CV · PowerPoint Deck
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30 px-1.5 py-0.5 rounded">
                  Self Presentation
                </span>
                {/* Quota Badge Indicator */}
                <button
                  onClick={onOpenQuotaModal}
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full border flex items-center gap-1 transition-colors ${
                    quotaState.activeMode === 'user_api_key'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                      : 'bg-sky-500/20 text-sky-300 border-sky-500/40 hover:bg-sky-500/30'
                  }`}
                  title="Nhấn để cấu hình API Key & Quota tự động chuyển đổi"
                >
                  <Key className="w-3 h-3" />
                  <span>
                    Gemini 3.8 Flash:{' '}
                    {quotaState.activeMode === 'user_api_key'
                      ? 'API Key của bạn'
                      : `Free Quota (${quotaState.freeQuotaRemaining}/${quotaState.freeQuotaMax})`}
                  </span>
                </button>
              </div>
              <p className="text-xs text-slate-400 truncate">
                Tự động thiết kế hồ sơ năng lực thành bài thuyết trình slide chuyên nghiệp cho Nhà tuyển dụng
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Theme Selector */}
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sky-500"
              title="Giao diện màu sắc bài thuyết trình"
            >
              <option value="navy">Giao diện: Executive Navy</option>
              <option value="emerald">Giao diện: Modern Emerald</option>
              <option value="slate">Giao diện: Dark Minimalist</option>
              <option value="royal">Giao diện: Royal Sapphire</option>
            </select>

            {/* Print Cover Page Shortcut */}
            <button
              onClick={onOpenCoverPagePrint}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
              title="Thiết kế và in trang bìa riêng biệt có hình nền và ảnh đại diện"
            >
              <Printer className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">In Trang Bìa (Cover)</span>
            </button>

            {/* Export PPTX button */}
            <button
              onClick={handleExportPptx}
              disabled={isExportingPptx}
              className="px-3 py-1.5 text-xs font-semibold bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
              title="Tải về file PowerPoint (.pptx) thực thụ mở được trong MS PowerPoint & Google Slides"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExportingPptx ? 'Đang tạo PPTX...' : 'Tải File PowerPoint (.pptx)'}</span>
            </button>

            {/* Fullscreen toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quota Notification Banner if active */}
        {quotaNotice && (
          <div className="bg-sky-950 border-b border-sky-800 px-4 py-2.5 text-xs text-sky-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="leading-relaxed">{quotaNotice}</span>
              {quotaNotice.includes('API key') && (
                <button
                  type="button"
                  onClick={onOpenQuotaModal}
                  className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 hover:text-white border border-amber-500/40 text-[11px] font-bold ml-1.5 transition-colors"
                >
                  Sử dụng API Key
                </button>
              )}
            </div>
            <button
              onClick={() => setQuotaNotice(null)}
              className="text-slate-400 hover:text-white text-xs px-1.5"
            >
              ✕
            </button>
          </div>
        )}

        {/* Slide Stage Container */}
        <div className="flex-1 flex flex-col justify-center items-center p-3 sm:p-6 overflow-y-auto">
          {/* Main 16:9 Presentation Canvas */}
          <div
            className="w-full max-w-4xl aspect-[16/9] rounded-xl shadow-2xl relative flex flex-col justify-between overflow-hidden border transition-all duration-300"
            style={{
              backgroundColor: `#${theme.bgColor}`,
              borderColor: `#${theme.lineColor}`,
            }}
          >
            {/* Top Slide Header */}
            <div className="px-6 sm:px-10 pt-6 sm:pt-8 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span
                  className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border"
                  style={{
                    color: `#${theme.accentColor}`,
                    borderColor: `#${theme.lineColor}`,
                    backgroundColor: `#${theme.cardBg}`,
                  }}
                >
                  {currentSlide.badge || 'EXECUTIVE CAREER DECK'}
                </span>
                <span className="text-[11px] font-medium" style={{ color: `#${theme.mutedColor}` }}>
                  · {profile.fullName.toUpperCase()}
                </span>
              </div>
              <span className="text-xs font-mono" style={{ color: `#${theme.mutedColor}` }}>
                {currentSlideIndex + 1} / {slides.length}
              </span>
            </div>

            {/* Slide Body */}
            <div className="px-6 sm:px-10 py-3 sm:py-4 flex-1 flex flex-col justify-center">
              {/* Slide Title & Subtitle */}
              <div className="mb-4">
                <h2
                  className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight"
                  style={{ color: `#${theme.primaryColor}` }}
                >
                  {currentSlide.title}
                </h2>
                {currentSlide.subtitle && (
                  <p
                    className="text-xs sm:text-sm mt-1 font-medium italic"
                    style={{ color: `#${theme.accentColor}` }}
                  >
                    {currentSlide.subtitle}
                  </p>
                )}
              </div>

              {/* Slide Content Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                {/* Main Bullet Points Box */}
                <div
                  className={`rounded-xl p-4 sm:p-5 border flex flex-col justify-center ${
                    currentSlide.highlightStat ? 'md:col-span-8' : 'md:col-span-12'
                  }`}
                  style={{
                    backgroundColor: `#${theme.cardBg}`,
                    borderColor: `#${theme.lineColor}`,
                  }}
                >
                  <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
                    {currentSlide.bulletPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                        <span
                          className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                          style={{ backgroundColor: `#${theme.accentColor}` }}
                        ></span>
                        <span style={{ color: `#${theme.textColor}` }}>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Highlight Stat / Side Widget */}
                {currentSlide.highlightStat && (
                  <div
                    className="md:col-span-4 rounded-xl p-4 sm:p-5 border flex flex-col items-center justify-center text-center"
                    style={{
                      backgroundColor: `#${theme.cardBg}`,
                      borderColor: `#${theme.lineColor}`,
                    }}
                  >
                    <span
                      className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight"
                      style={{ color: `#${theme.accentColor}` }}
                    >
                      {currentSlide.highlightStat.number}
                    </span>
                    <span
                      className="text-xs sm:text-sm font-semibold mt-1"
                      style={{ color: `#${theme.textColor}` }}
                    >
                      {currentSlide.highlightStat.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Callout Box if present */}
              {currentSlide.calloutBox && (
                <div
                  className="mt-3 px-4 py-2 rounded-lg border text-center text-[11px] sm:text-xs"
                  style={{
                    backgroundColor: `#${theme.bgColor}`,
                    borderColor: `#${theme.accentColor}`,
                    color: `#${theme.textColor}`,
                  }}
                >
                  {currentSlide.calloutBox}
                </div>
              )}
            </div>

            {/* Slide Footer */}
            <div
              className="px-6 sm:px-10 pb-4 pt-2 border-t flex items-center justify-between text-[10px] sm:text-[11px]"
              style={{
                borderColor: `#${theme.lineColor}`,
                color: `#${theme.mutedColor}`,
              }}
            >
              <span>VND CareerDirect · Tuyển dụng & Thuyết trình trực tiếp với HR</span>
              <span>
                Hotline: <strong className="text-white">{profile.phone}</strong> · Email:{' '}
                <strong className="text-white">{profile.email}</strong>
              </span>
            </div>

            {/* Slide Navigation Overlay Buttons */}
            <button
              onClick={() =>
                setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1))
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity"
              title="Slide trước (Mũi tên trái)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() =>
                setCurrentSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0))
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity"
              title="Slide kế tiếp (Mũi tên phải hoặc Space)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Slide Deck Actions Toolbar */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-4 text-xs">
            {/* Auto-Refine with Gemini 3.8 Flash */}
            <button
              onClick={handleAutoRefineWithGemini}
              className="px-3 py-1.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white font-medium flex items-center gap-1.5 transition-colors shadow-sm"
              title="Tự động trau chuốt nội dung slide bằng Gemini 3.8 Flash (Tự động chuyển API Key khi quá hạn ngạch)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Tự động tinh chỉnh (Gemini 3.8 Flash)</span>
            </button>

            {/* Slideshow Auto-play */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 border transition-colors ${
                isPlaying
                  ? 'bg-amber-600 text-white border-amber-500'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Tạm Dừng Trình Chiếu' : 'Tự Động Chiếu (Slideshow)'}</span>
            </button>

            {/* Edit Slide Content */}
            <button
              onClick={handleStartEdit}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-400" />
              <span>Chỉnh Sửa Slide Này</span>
            </button>

            {/* Reset to Original Slides */}
            <button
              onClick={() => {
                setSlides(buildSlidesFromProfile(profile));
                setCurrentSlideIndex(0);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 font-medium flex items-center gap-1.5 transition-colors"
              title="Thiết lập lại nội dung slide chuẩn"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt Lại</span>
            </button>
          </div>

          {/* Inline Slide Editor Form Modal */}
          {isEditingSlide && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80">
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-lg w-full shadow-2xl text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-sky-400" />
                    Chỉnh sửa nội dung Slide #{currentSlideIndex + 1}
                  </h3>
                  <button
                    onClick={() => setIsEditingSlide(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Tiêu đề slide:</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Tiêu đề phụ (Subtitle):</label>
                    <input
                      type="text"
                      value={editSubtitle}
                      onChange={(e) => setEditSubtitle(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">
                      Các ý chính (mỗi dòng một ý):
                    </label>
                    <textarea
                      rows={5}
                      value={editBulletPoints}
                      onChange={(e) => setEditBulletPoints(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-4">
                  <button
                    onClick={() => setIsEditingSlide(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Lưu Thay Đổi
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Slide Thumbnails Filmstrip */}
        <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 overflow-x-auto shrink-0">
          <div className="flex items-center gap-3 justify-center min-w-max">
            {slides.map((s, idx) => {
              const isSelected = idx === currentSlideIndex;
              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`text-left rounded-lg p-2 border transition-all w-36 shrink-0 ${
                    isSelected
                      ? 'border-sky-500 bg-sky-950/40 shadow-sm scale-102 ring-1 ring-sky-500/50'
                      : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-mono">#{idx + 1}</span>
                    <span className="uppercase text-[9px] truncate max-w-[80px]">{s.category}</span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-200 truncate leading-snug">
                    {s.title}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import {
  X,
  Printer,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShieldCheck,
  Check,
  RotateCcw,
  Sliders,
  User,
  SlidersHorizontal,
} from 'lucide-react';
import { CandidateProfile } from '../types/job';
import { formatSalaryMillion } from '../utils/formatters';

interface CoverPagePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CandidateProfile;
  onUpdateProfile: (updated: Partial<CandidateProfile>) => void;
}

// Curated high quality background presets
export const BACKGROUND_PRESETS = [
  {
    id: 'corporate_skyscraper',
    name: 'Tòa Nhà Kính Hiện Đại (Corporate Skyscraper)',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0c4a6e 100%)',
    bgImage:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'global_trade',
    name: 'Giao Thương Quốc Tế (Global Trade & Logistics)',
    gradient: 'linear-gradient(135deg, #0b132b 0%, #1c2541 60%, #3a506b 100%)',
    bgImage:
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'minimal_slate',
    name: 'Xám Đá Tối Giản (Minimal Executive Slate)',
    gradient: 'linear-gradient(135deg, #18181b 0%, #27272a 70%, #3f3f46 100%)',
    bgImage:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'deep_emerald',
    name: 'Xanh Lục Thịnh Vượng (Deep Emerald Business)',
    gradient: 'linear-gradient(135deg, #022c22 0%, #064e3b 60%, #065f46 100%)',
    bgImage:
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'clean_monochrome',
    name: 'Trắng Sạch In Ấn (Clean Studio Print)',
    gradient: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 60%, #e2e8f0 100%)',
    bgImage: '',
  },
];

export const CoverPagePrintModal: React.FC<CoverPagePrintModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
}) => {
  const selfImageInputRef = useRef<HTMLInputElement>(null);
  const bgImageInputRef = useRef<HTMLInputElement>(null);

  // Self image & background state
  const [selfImage, setSelfImage] = useState<string>(
    profile.photoUrl || ''
  );
  const [selectedBgPresetId, setSelectedBgPresetId] = useState<string>('corporate_skyscraper');
  const [customBgImage, setCustomBgImage] = useState<string>(profile.coverBackgroundUrl || '');
  const [bgOverlayDarkness, setBgOverlayDarkness] = useState<number>(65); // 0 to 90%
  const [photoStyle, setPhotoStyle] = useState<'portrait_card' | 'circle' | 'square'>('portrait_card');
  const [showDobCitizen, setShowDobCitizen] = useState<boolean>(true);

  // Editable text elements
  const [nameText, setNameText] = useState<string>(profile.fullName || 'SIMON NGUYEN (NGUYỄN TẤN SĨ)');
  const [titleText, setTitleText] = useState<string>(
    profile.currentTitle || 'Thương Mại Quốc Nội , Quốc Tế & Dự Án'
  );
  const [headlineText, setHeadlineText] = useState<string>(
    profile.coverHeadline || 'THƯƠNG MẠI QUỐC NỘI , QUỐC TẾ & DỰ ÁN'
  );
  const [taglineText, setTaglineText] = useState<string>(
    profile.coverTagline ||
      'Hơn 30 năm kinh nghiệm điều hành thực chiến · Incoterms & Đàm phán thương mại quốc tế · Tiếng Anh lưu loát 20+ năm'
  );
  const [phoneText, setPhoneText] = useState<string>(profile.phone || 'Zalo/Whatsapp 0702499445');
  const [emailText, setEmailText] = useState<string>(profile.email || 'singuyenemail@gmail.com');
  const [cityText, setCityText] = useState<string>('TP. Hồ Chí Minh, Việt Nam');
  const [dobText, setDobText] = useState<string>(profile.dateOfBirth || '05-04-1971');
  const [citizenIdText, setCitizenIdText] = useState<string>(profile.citizenId || '089071000050');

  // Handle uploading candidate's own photo (one self image)
  const handleSelfImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setSelfImage(dataUrl);
      onUpdateProfile({ photoUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  // Handle uploading candidate's own background image (one background image)
  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCustomBgImage(dataUrl);
      onUpdateProfile({ coverBackgroundUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  // Trigger system print
  const handleTriggerPrint = () => {
    window.print();
  };

  const currentPreset = BACKGROUND_PRESETS.find((p) => p.id === selectedBgPresetId) || BACKGROUND_PRESETS[0];
  const activeBgImage = customBgImage || currentPreset.bgImage;
  const isLightPrint = selectedBgPresetId === 'clean_monochrome' && !customBgImage;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      {/* Hidden file inputs */}
      <input
        ref={selfImageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleSelfImageUpload}
      />
      <input
        ref={bgImageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleBgImageUpload}
      />

      {/* Main Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-6xl w-full shadow-2xl overflow-hidden my-auto flex flex-col max-h-[96vh]">
        {/* Header Bar */}
        <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-sm">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-white font-bold text-sm tracking-tight flex items-center gap-2">
                <span>Thiết Kế & In Trang Bìa (Executive Cover Page Print)</span>
                <span className="text-[10px] bg-sky-500/20 text-sky-400 border border-sky-500/30 px-1.5 py-0.5 rounded font-medium">
                  Chuẩn Khổ A4
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Cho phép tùy chỉnh 1 ảnh đại diện, 1 ảnh nền và thanh thông tin liên hệ ở đáy trang bìa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleTriggerPrint}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-lg flex items-center gap-2 shadow-lg shadow-sky-600/30 transition-all cursor-pointer"
              title="Mở hộp thoại in trình duyệt chuẩn A4 không ngắt trang"
            >
              <Printer className="w-4 h-4" />
              <span>In Trang Bìa (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Left Controls Sidebar + Right Live A4 Preview */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Controls Sidebar (4 cols) */}
          <div className="lg:col-span-4 bg-slate-950/70 border-r border-slate-800 p-4 overflow-y-auto space-y-4 text-xs text-slate-300">
            {/* Section 1: One Self Image Control */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-sky-400" />
                  1 Ảnh Cá Nhân (Self Image)
                </span>
                {selfImage && (
                  <button
                    onClick={() => {
                      setSelfImage('');
                      onUpdateProfile({ photoUrl: '' });
                    }}
                    className="text-[11px] text-red-400 hover:text-red-300"
                  >
                    Xóa ảnh
                  </button>
                )}
              </div>

              {selfImage ? (
                <div className="flex items-center gap-3">
                  <img
                    src={selfImage}
                    alt="Self"
                    className="w-14 h-16 object-cover rounded-lg border border-slate-700 shadow-sm"
                  />
                  <div className="space-y-1">
                    <button
                      onClick={() => selfImageInputRef.current?.click()}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-[11px] flex items-center gap-1"
                    >
                      <Upload className="w-3 h-3" />
                      Thay ảnh khác
                    </button>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setPhotoStyle('portrait_card')}
                        className={`px-1.5 py-0.5 rounded text-[10px] ${
                          photoStyle === 'portrait_card'
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        Khung thẻ đứng
                      </button>
                      <button
                        onClick={() => setPhotoStyle('circle')}
                        className={`px-1.5 py-0.5 rounded text-[10px] ${
                          photoStyle === 'circle'
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        Tròn
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => selfImageInputRef.current?.click()}
                  className="w-full py-3 border-2 border-dashed border-slate-700 hover:border-sky-500 rounded-lg text-slate-400 hover:text-slate-200 flex flex-col items-center justify-center gap-1 transition-colors"
                >
                  <Upload className="w-4 h-4 text-sky-400" />
                  <span className="font-medium">Tải lên ảnh chân dung của bạn</span>
                  <span className="text-[10px] text-slate-500">JPG, PNG, WEBP</span>
                </button>
              )}
            </div>

            {/* Section 2: One Background Image Control */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                  1 Ảnh Nền (Background Image)
                </span>
                {customBgImage && (
                  <button
                    onClick={() => {
                      setCustomBgImage('');
                      onUpdateProfile({ coverBackgroundUrl: '' });
                    }}
                    className="text-[11px] text-red-400 hover:text-red-300"
                  >
                    Xóa ảnh nền tùy chỉnh
                  </button>
                )}
              </div>

              {/* Upload custom background button */}
              <button
                onClick={() => bgImageInputRef.current?.click()}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors font-medium text-[11px]"
              >
                <Upload className="w-3.5 h-3.5 text-sky-400" />
                <span>Tải lên ảnh nền từ máy</span>
              </button>

              {/* Curated Presets */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] text-slate-400 block font-medium">
                  Hoặc chọn ảnh nền phong cách lãnh đạo:
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {BACKGROUND_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedBgPresetId(p.id);
                        setCustomBgImage('');
                      }}
                      className={`text-left px-2.5 py-1.5 rounded-lg border text-[11px] flex items-center justify-between transition-colors ${
                        selectedBgPresetId === p.id && !customBgImage
                          ? 'border-sky-500 bg-sky-950/40 text-white font-medium'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="truncate">{p.name}</span>
                      {selectedBgPresetId === p.id && !customBgImage && (
                        <Check className="w-3 h-3 text-sky-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Tint / Darkness Slider */}
              <div className="pt-2 border-t border-slate-800 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Độ mờ tối lớp nền (Overlay):</span>
                  <span className="font-mono text-sky-400">{bgOverlayDarkness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="5"
                  value={bgOverlayDarkness}
                  onChange={(e) => setBgOverlayDarkness(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Section 3: Contact Details & Text Inputs */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
              <span className="font-semibold text-white block">
                Thông tin & Liên hệ đáy trang bìa:
              </span>

              <div className="space-y-2 text-[11px]">
                <div>
                  <label className="text-slate-400 block mb-0.5">Họ và tên ứng viên:</label>
                  <input
                    type="text"
                    value={nameText}
                    onChange={(e) => setNameText(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-0.5">Chức danh chuyên môn:</label>
                  <input
                    type="text"
                    value={titleText}
                    onChange={(e) => setTitleText(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-0.5">Hotline:</label>
                    <input
                      type="text"
                      value={phoneText}
                      onChange={(e) => setPhoneText(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-0.5">Email liên hệ:</label>
                    <input
                      type="text"
                      value={emailText}
                      onChange={(e) => setEmailText(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-0.5">Địa chỉ / Khu vực:</label>
                  <input
                    type="text"
                    value={cityText}
                    onChange={(e) => setCityText(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="chk-dob"
                    checked={showDobCitizen}
                    onChange={(e) => setShowDobCitizen(e.target.checked)}
                    className="rounded accent-sky-500"
                  />
                  <label htmlFor="chk-dob" className="text-slate-300 cursor-pointer">
                    Hiển thị Ngày sinh ({dobText}) & CCCD ({citizenIdText})
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Preview Section (8 cols) */}
          <div className="lg:col-span-8 bg-slate-950 p-4 sm:p-6 flex flex-col items-center justify-center overflow-y-auto">
            {/* The A4 Print Canvas */}
            <div
              id="printable-cover-page"
              className={`w-full max-w-[620px] aspect-[1/1.414] rounded-lg shadow-2xl relative flex flex-col justify-between overflow-hidden border transition-all ${
                isLightPrint
                  ? 'bg-slate-50 text-slate-900 border-slate-300'
                  : 'bg-slate-950 text-white border-slate-800'
              }`}
              style={{
                backgroundImage: activeBgImage ? `url(${activeBgImage})` : currentPreset.gradient,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Overlay tint */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity"
                style={{
                  backgroundColor: isLightPrint
                    ? `rgba(255, 255, 255, ${bgOverlayDarkness / 100})`
                    : `rgba(15, 23, 42, ${bgOverlayDarkness / 100})`,
                }}
              />

              {/* Top Bar / Branding */}
              <div className="relative z-10 px-8 pt-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-sky-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                    V
                  </div>
                  <span className="text-xs font-bold tracking-wider uppercase opacity-90">
                    VND CareerDirect · Executive Dossier
                  </span>
                </div>
                <div className="text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded bg-black/30 backdrop-blur-xs border border-white/10">
                  CV 2026 OFFICIAL
                </div>
              </div>

              {/* Center Content: Photo, Headline, Name, Summary */}
              <div className="relative z-10 px-8 py-4 flex-1 flex flex-col justify-center items-center text-center">
                {/* 1 Self Image display */}
                {selfImage && (
                  <div className="mb-5">
                    {photoStyle === 'circle' ? (
                      <div className="w-32 h-32 rounded-full border-4 border-white/80 shadow-2xl overflow-hidden mx-auto ring-4 ring-sky-500/40">
                        <img src={selfImage} alt={nameText} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-28 h-36 rounded-xl border-3 border-amber-400/90 shadow-2xl overflow-hidden mx-auto ring-2 ring-black/40">
                        <img src={selfImage} alt={nameText} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                )}

                {/* Cover Headline Badge */}
                <span className="text-[11px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 mb-3 backdrop-blur-xs">
                  {headlineText}
                </span>

                {/* Candidate Name */}
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight uppercase mb-1 drop-shadow-md">
                  {nameText}
                </h1>

                {/* Title */}
                <p className="text-sm sm:text-base font-bold text-amber-400 max-w-md mx-auto leading-snug drop-shadow-sm">
                  {titleText}
                </p>

                {/* Tagline */}
                <p className="text-xs max-w-lg mx-auto mt-3 text-slate-200/90 leading-relaxed font-medium">
                  {taglineText}
                </p>

                {/* 4 Core Pillars Pills */}
                <div className="grid grid-cols-2 gap-2 mt-5 max-w-md w-full text-left">
                  <div className="bg-black/40 backdrop-blur-xs border border-white/10 rounded-lg p-2 text-[10px]">
                    <span className="font-bold text-sky-300 block">🌐 Quốc Tế & Song Ngữ</span>
                    <span className="text-slate-300">20+ năm văn phòng quốc tế, tiếng Anh đàm phán</span>
                  </div>
                  <div className="bg-black/40 backdrop-blur-xs border border-white/10 rounded-lg p-2 text-[10px]">
                    <span className="font-bold text-sky-300 block">📋 Incoterms & L/C</span>
                    <span className="text-slate-300">Thủ tục hải quan trọn gói, tài trợ thương mại</span>
                  </div>
                  <div className="bg-black/40 backdrop-blur-xs border border-white/10 rounded-lg p-2 text-[10px]">
                    <span className="font-bold text-sky-300 block">🏭 Dự Án & Nhà Máy</span>
                    <span className="text-slate-300">Nhà máy điện đạm, thực phẩm IQF, cáp điện</span>
                  </div>
                  <div className="bg-black/40 backdrop-blur-xs border border-white/10 rounded-lg p-2 text-[10px]">
                    <span className="font-bold text-sky-300 block">🤖 Công Nghệ & AI</span>
                    <span className="text-slate-300">Làm chủ AI/AGI, CAD, quản trị tự động hóa</span>
                  </div>
                </div>
              </div>

              {/* Bottom Contact Details Bar (Crucial User Requirement!) */}
              <div className="relative z-10 w-full bg-black/75 backdrop-blur-md border-t border-white/15 px-6 py-4 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 text-slate-200">
                  {/* Phone & Email */}
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 font-semibold text-white">
                      <Phone className="w-3.5 h-3.5 text-sky-400" />
                      {phoneText}
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold text-white">
                      <Mail className="w-3.5 h-3.5 text-sky-400" />
                      {emailText}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{cityText}</span>
                  </div>
                </div>

                {/* Sub row with DOB & Citizen ID if enabled */}
                {showDobCitizen && (
                  <div className="mt-2 pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                    <div className="flex items-center gap-3">
                      <span>
                        Ngày sinh: <strong className="text-slate-200">{dobText}</strong>
                      </span>
                      <span>
                        CCCD: <strong className="text-slate-200">{citizenIdText}</strong>
                      </span>
                    </div>
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Hồ sơ xác thực gửi trực tiếp Nhà tuyển dụng
                    </span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-3 text-center">
              Nhấn nút <strong>In Trang Bìa (Print)</strong> để in trực tiếp hoặc lưu dưới dạng file PDF chất lượng cao khổ A4.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

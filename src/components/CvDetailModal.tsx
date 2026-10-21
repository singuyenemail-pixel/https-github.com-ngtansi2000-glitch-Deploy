import React, { useState, useRef } from 'react';
import { X, User, Briefcase, Mail, Phone, Globe, Trash2, Check, Sparkles, FileText, Plus, Download, Upload } from 'lucide-react';
import { CandidateProfile } from '../types/job';
import { formatSalaryMillion } from '../utils/formatters';
import { Award, Presentation, Printer } from 'lucide-react';
import { downloadCvToPc } from '../utils/cvExporter';

interface CvDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CandidateProfile;
  onSaveProfile: (profile: CandidateProfile) => void;
  onClearCv: () => void;
  onLoadDemoProfile: () => void;
  onLoadSimonCv: () => void;
  onOpenPresentationDeck: () => void;
  onOpenCoverPagePrint: () => void;
}

export const CvDetailModal: React.FC<CvDetailModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onClearCv,
  onLoadDemoProfile,
  onLoadSimonCv,
  onOpenPresentationDeck,
  onOpenCoverPagePrint,
}) => {
  const [formData, setFormData] = useState<CandidateProfile>({ ...profile });
  const [skillInput, setSkillInput] = useState<string>('');
  const [savedNotice, setSavedNotice] = useState<boolean>(false);
  const reuploadInputRef = useRef<HTMLInputElement>(null);

  const handleReuploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeInKb = Math.round(file.size / 1024);
    const sizeStr = sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`;

    const binaryReader = new FileReader();
    binaryReader.onload = () => {
      const dataUrl = binaryReader.result as string;
      setFormData((prev) => ({
        ...prev,
        cvFileName: file.name,
        cvFileSize: sizeStr,
        cvUploadedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' hôm nay',
        originalFileDataUrl: dataUrl,
        originalFileName: file.name,
        originalFileType: file.type,
        originalFileSizeBytes: file.size,
      }));
    };
    binaryReader.readAsDataURL(file);

    // If it's a text file, attempt to parse basic info
    if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          // Detect candidate name if present
          const nameMatch = text.match(/Họ và tên \(Full Name\):\s*([^\n\r]+)/i);
          const emailMatch = text.match(/Email liên hệ:\s*([^\n\r]+)/i);
          const phoneMatch = text.match(/Số điện thoại \(Phone\):\s*([^\n\r]+)/i);
          setFormData((prev) => ({
            ...prev,
            fullName: nameMatch ? nameMatch[1].trim() : prev.fullName,
            email: emailMatch ? emailMatch[1].trim() : prev.email,
            phone: phoneMatch ? phoneMatch[1].trim() : prev.phone,
          }));
        }
      };
      reader.readAsText(file);
    }
  };

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    if (!formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden my-6">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Hồ Sơ Ứng Viên & Thông Tin CV
              </h2>
              <p className="text-xs text-slate-400">
                Dữ liệu này được tự động ghép vào câu ngắn ứng tuyển gửi HR
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-sm text-slate-700">
          {/* Quick Profile Loaders & Tools Banner */}
          <div className="bg-slate-900 text-white rounded-xl p-3 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-emerald-300">Hồ Sơ CV 2026: Simon Nguyen (Nguyễn Tấn Sĩ)</span>
                <p className="text-[11px] text-slate-400">30+ năm kinh nghiệm thương mại quốc tế & quản trị cấp cao</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  onLoadSimonCv();
                  onClose();
                }}
                className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors shadow-2xs"
              >
                Nạp Hồ Sơ Thực Tế
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPresentationDeck();
                }}
                className="px-2.5 py-1 text-xs font-semibold bg-orange-600 hover:bg-orange-500 text-white rounded-md transition-colors flex items-center gap-1"
              >
                <Presentation className="w-3 h-3" />
                <span>Thuyết Trình PPT</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCoverPagePrint();
                }}
                className="px-2.5 py-1 text-xs font-semibold bg-sky-700 hover:bg-sky-600 text-white rounded-md transition-colors flex items-center gap-1"
              >
                <Printer className="w-3 h-3" />
                <span>In Trang Bìa</span>
              </button>
            </div>
          </div>

          {/* Hidden File Input for Re-uploading improved CV */}
          <input
            type="file"
            ref={reuploadInputRef}
            onChange={handleReuploadFile}
            accept=".pdf,.doc,.docx,.txt,.md"
            className="hidden"
          />

          {/* CV File Bar Status in Modal with Download & Upload Again */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileText className="w-5 h-5 text-sky-600 shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-slate-500 font-medium">Tập tin CV ứng viên:</div>
                <div className="font-semibold text-slate-800 text-xs truncate">
                  {formData.cvFileName || 'Chưa tải lên file CV nào'}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Download CV to PC */}
              <button
                type="button"
                onClick={() => downloadCvToPc(formData)}
                className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-md flex items-center gap-1 transition-colors"
                title="Tải tệp CV về máy tính để cải thiện nội dung"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tải CV Về Máy (Download)</span>
              </button>

              {/* Upload file again */}
              <button
                type="button"
                onClick={() => reuploadInputRef.current?.click()}
                className="px-2.5 py-1 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-300 rounded-md flex items-center gap-1 transition-colors"
                title="Tải lên tệp CV mới sau khi đã cải thiện trên máy tính"
              >
                <Upload className="w-3.5 h-3.5 text-sky-600" />
                <span>Tải Lại Lên (Upload Again)</span>
              </button>

              {formData.cvFileName ? (
                <button
                  type="button"
                  onClick={() => {
                    onClearCv();
                    setFormData({ ...formData, cvFileName: null, cvFileSize: undefined });
                  }}
                  className="px-2.5 py-1 text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md flex items-center gap-1 transition-colors"
                  title="Xóa hồ sơ CV hiện tại"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa CV (Clear)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onLoadDemoProfile();
                    onClose();
                  }}
                  className="px-2.5 py-1 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors"
                >
                  Nạp Mẫu
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Họ và Tên
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-600 focus:outline-none"
                placeholder="Ví dụ: Nguyễn Thành Nam"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Vị trí / Chức danh chuyên môn
              </label>
              <input
                type="text"
                required
                value={formData.currentTitle}
                onChange={(e) => setFormData({ ...formData, currentTitle: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-600 focus:outline-none"
                placeholder="Ví dụ: Senior Frontend Engineer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Số năm kinh nghiệm
              </label>
              <input
                type="number"
                min={0}
                max={30}
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Mức lương kỳ vọng (/tháng)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={10000000}
                  max={50000000}
                  step={1000000}
                  value={formData.targetSalaryVnd}
                  onChange={(e) => setFormData({ ...formData, targetSalaryVnd: Number(e.target.value) })}
                  className="w-full accent-sky-700"
                />
                <span className="text-xs font-bold text-sky-800 font-mono-numbers shrink-0">
                  {formatSalaryMillion(formData.targetSalaryVnd)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Số điện thoại liên hệ (Zalo / Whatsapp)
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-600 focus:outline-none"
                placeholder="Zalo/Whatsapp 0702499445"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Email cá nhân
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-600 focus:outline-none"
                placeholder="singuyenemail@gmail.com"
              />
            </div>
          </div>

          {/* Key Skills */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Kỹ năng thế mạnh (Xuất hiện trong câu ngắn gửi HR)
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-sky-600 focus:outline-none"
                placeholder="Gõ kỹ năng rồi ấn Thêm (ví dụ: React, TypeScript, Node.js)..."
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1 border border-slate-200"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Liên kết Portfolio / GitHub (tùy chọn)
            </label>
            <input
              type="url"
              value={formData.portfolioUrl || ''}
              onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-600 focus:outline-none"
              placeholder="https://github.com/myname hoặc https://myportfolio.dev"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Hủy
            </button>

            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-600 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {savedNotice ? <Check className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{savedNotice ? 'Đã lưu hồ sơ' : 'Lưu & Cập Nhật Hồ Sơ'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useRef } from 'react';
import { Upload, FileText, Trash2, Edit3, CheckCircle, RefreshCw, AlertCircle, Sparkles, Presentation, Printer, Award, Download, Phone, Mail } from 'lucide-react';
import { CandidateProfile } from '../types/job';
import { formatSalaryMillion } from '../utils/formatters';
import { downloadCvToPc, downloadOriginalUploadedFile } from '../utils/cvExporter';

interface CvUploadBarProps {
  profile: CandidateProfile;
  onUpdateProfile: (updated: Partial<CandidateProfile>) => void;
  onClearCv: () => void;
  onOpenCvModal: () => void;
  onOpenCvStrengthModal: () => void;
  onOpenPresentationDeck: () => void;
  onOpenCoverPagePrint: () => void;
  onLoadDemoProfile: () => void;
  onLoadSimonCv: () => void;
  cvStrengthScore?: number;
}

export const CvUploadBar: React.FC<CvUploadBarProps> = ({
  profile,
  onUpdateProfile,
  onClearCv,
  onOpenCvModal,
  onOpenCvStrengthModal,
  onOpenPresentationDeck,
  onOpenCoverPagePrint,
  onLoadDemoProfile,
  onLoadSimonCv,
  cvStrengthScore,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert file size to readable string
    const sizeInKb = Math.round(file.size / 1024);
    const sizeStr = sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`;

    // Extract rudimentary name guessing from filename
    const cleanFileName = file.name;
    let guessedName = profile.fullName;
    if (!guessedName || guessedName === 'Ứng viên' || guessedName === 'Nguyễn Thành Nam') {
      const parts = cleanFileName.replace(/\.(pdf|docx|txt|doc|md)$/i, '').split(/[-_]/);
      if (parts.length > 0 && parts[0].length > 2) {
        guessedName = parts.slice(0, 3).join(' ');
      }
    }

    // Keep original file upload without changing any content
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      onUpdateProfile({
        cvFileName: file.name,
        cvFileSize: sizeStr,
        cvUploadedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' hôm nay',
        fullName: guessedName || profile.fullName || 'SIMON NGUYEN (NGUYỄN TẤN SĨ)',
        phone: profile.phone || 'Zalo/Whatsapp 0702499445',
        email: profile.email || 'singuyenemail@gmail.com',
        originalFileDataUrl: dataUrl,
        originalFileName: file.name,
        originalFileType: file.type,
        originalFileSizeBytes: file.size,
      });
    };
    reader.readAsDataURL(file);

    // Reset input so user can re-upload same file if desired
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const hasCv = Boolean(profile.cvFileName);

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.txt,.md"
          className="hidden"
          onChange={handleFileChange}
        />

        {hasCv ? (
          /* State 1: CV Loaded in File Bar with Clear Out Option */
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-sky-500/20 border border-sky-400/30 text-sky-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white truncate max-w-xs sm:max-w-md">
                    {profile.cvFileName}
                  </span>
                  <span className="text-xs text-emerald-400 flex items-center gap-1 shrink-0 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Đã nạp CV</span>
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
                  <span>{profile.cvFileSize || '210 KB'}</span>
                  <span aria-hidden="true">·</span>
                  <span>{profile.fullName} ({profile.currentTitle || 'Chuyên viên'})</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Phone className="w-3 h-3 inline text-emerald-400" />
                    <span>{profile.phone || 'Zalo/Whatsapp 0702499445'}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-300 flex items-center gap-1">
                    <Mail className="w-3 h-3 inline text-slate-400" />
                    <span>{profile.email || 'singuyenemail@gmail.com'}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Kỳ vọng: {formatSalaryMillion(profile.targetSalaryVnd || 25000000)}/tháng</span>
                </div>
              </div>
            </div>

            {/* Action Bar for File: PowerPoint Deck, Print Cover, Edit, Clear CV */}
            <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
              {/* PowerPoint Self Presentation Deck Button */}
              <button
                type="button"
                onClick={onOpenPresentationDeck}
                className="px-2.5 py-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
                title="Tự động thiết kế CV thành bài thuyết trình PowerPoint (.pptx)"
              >
                <Presentation className="w-3.5 h-3.5 text-orange-200" />
                <span>Thuyết Trình PowerPoint</span>
              </button>

              {/* Print Cover Page Button */}
              <button
                type="button"
                onClick={onOpenCoverPagePrint}
                className="px-2.5 py-1.5 text-xs font-semibold text-sky-200 hover:text-white bg-sky-950/70 hover:bg-sky-900 border border-sky-700/60 rounded-md flex items-center gap-1.5 transition-colors"
                title="Thiết kế và in trang bìa chuẩn A4 với ảnh chân dung và ảnh nền"
              >
                <Printer className="w-3.5 h-3.5 text-sky-400" />
                <span>In Trang Bìa</span>
              </button>

              <button
                type="button"
                onClick={onOpenCvStrengthModal}
                className="px-2.5 py-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-900/60 rounded-md border border-amber-700/50 flex items-center gap-1.5 transition-colors shadow-2xs"
                title="Đánh giá độ mạnh CV dựa trên yêu cầu các việc làm đã lưu"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Độ Mạnh CV {cvStrengthScore !== undefined ? `(${cvStrengthScore}/100)` : ''}</span>
              </button>

              {/* Download original uploaded file intact without changing any content */}
              {profile.originalFileDataUrl && (
                <button
                  type="button"
                  onClick={() => downloadOriginalUploadedFile(profile)}
                  className="px-2.5 py-1.5 text-xs font-semibold text-sky-300 hover:text-white bg-sky-950/70 hover:bg-sky-900 border border-sky-700/60 rounded-md flex items-center gap-1.5 transition-colors shadow-2xs"
                  title="Tải về tệp gốc nguyên vẹn bạn đã tải lên mà không thay đổi bất kỳ nội dung nào"
                >
                  <Download className="w-3.5 h-3.5 text-sky-400" />
                  <span>Tải File Gốc (Original)</span>
                </button>
              )}

              {/* Download CV to PC to edit and upload again */}
              <button
                type="button"
                onClick={() => downloadCvToPc(profile)}
                className="px-2.5 py-1.5 text-xs font-semibold text-emerald-300 hover:text-emerald-100 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/60 rounded-md flex items-center gap-1.5 transition-colors shadow-2xs"
                title="Tải tệp CV về máy tính của bạn để cải thiện và tải lên lại (Download CV to PC)"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tải CV Về Máy</span>
              </button>

              <button
                type="button"
                onClick={onOpenCvModal}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 flex items-center gap-1.5 transition-colors"
                title="Xem và chỉnh sửa thông tin ứng viên trích xuất từ CV"
              >
                <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                <span>Xem & Sửa Thông Tin</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-md border border-slate-700 flex items-center gap-1.5 transition-colors"
                title="Chọn một file CV khác để thay thế hoặc tải file đã chỉnh sửa lên lại"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Thay / Tải Lên Lại</span>
              </button>

              {/* Explicit Clear Out CV Option */}
              <button
                type="button"
                onClick={onClearCv}
                className="px-2.5 py-1.5 text-xs font-medium text-rose-300 hover:text-rose-100 bg-rose-950/60 hover:bg-rose-900/80 rounded-md border border-rose-800/50 flex items-center gap-1.5 transition-colors"
                title="Xóa bỏ CV hiện tại khỏi thanh tải file"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Xóa CV (Clear Out)</span>
              </button>
            </div>
          </div>
        ) : (
          /* State 2: No CV in File Bar - Upload Bar Action */
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center shrink-0">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200">
                    Thanh Đính Kèm File CV (CV Upload Bar)
                  </span>
                  <span className="text-xs text-amber-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Chưa chọn file CV</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Tải lên hồ sơ (PDF, DOCX, TXT) để tự động tạo câu ngắn ứng tuyển kèm CV gửi thẳng tới HR
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              {/* Load Simon Nguyen Real Profile */}
              <button
                type="button"
                onClick={onLoadSimonCv}
                className="px-2.5 py-1.5 text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700/60 rounded-md transition-colors flex items-center gap-1.5 shadow-2xs"
                title="Nạp ngay toàn bộ hồ sơ 6 trang CV thực tế 2026 của Simon Nguyen (Nguyễn Tấn Sĩ)"
              >
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>Nạp Hồ Sơ: Simon Nguyen (2026)</span>
              </button>

              <button
                type="button"
                onClick={onOpenPresentationDeck}
                className="px-2.5 py-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-md transition-colors flex items-center gap-1.5"
                title="Thuyết trình CV dạng slide PowerPoint"
              >
                <Presentation className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Thuyết Trình PPT</span>
              </button>

              <button
                type="button"
                onClick={() => downloadCvToPc(profile)}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                title="Tải mẫu CV chuẩn về máy tính để soạn thảo rồi tải lên lại"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tải CV Về Máy</span>
              </button>

              <button
                type="button"
                onClick={onLoadDemoProfile}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors whitespace-nowrap"
              >
                CV Mẫu
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Tải Lên File CV</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

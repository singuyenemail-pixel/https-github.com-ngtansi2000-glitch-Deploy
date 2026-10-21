import React, { useState } from 'react';
import { X, Trash2, Ban, ShieldAlert, Building2, Mail, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Job } from '../types/job';

interface DismissJobModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDismiss: (job: Job, blockEmployer: boolean) => void;
}

export const DismissJobModal: React.FC<DismissJobModalProps> = ({
  job,
  isOpen,
  onClose,
  onConfirmDismiss,
}) => {
  const [blockSimilar, setBlockSimilar] = useState<boolean>(true);

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-rose-950 text-white p-5 flex items-start justify-between gap-3 border-b border-rose-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Xóa Kết Quả Nhà Tuyển Dụng
              </h3>
              <p className="text-xs text-rose-200/80 mt-0.5">
                Cập nhật dữ liệu để không nhận các kết quả tương tự
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-rose-300 hover:text-white rounded-lg hover:bg-rose-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-slate-700">
          {/* Target Job Info Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Việc làm sẽ xóa:
            </span>
            <h4 className="font-bold text-slate-900 text-sm leading-snug">
              {job.title}
            </h4>
            <div className="flex flex-wrap items-center gap-2 text-slate-600 text-xs">
              <span className="flex items-center gap-1 font-semibold text-slate-800">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {job.company}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-slate-500">{job.recruiterEmail}</span>
            </div>
          </div>

          {/* Block Similar Results Option Checkbox */}
          <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-3.5 space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={blockSimilar}
                onChange={(e) => setBlockSimilar(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-rose-600 focus:ring-rose-500 accent-rose-600 cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 block text-xs">
                  Cập nhật dữ liệu: Không nhận các kết quả tương tự từ nhà tuyển dụng này
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Hệ thống sẽ ghi nhớ và tự động loại trừ mọi tin đăng mới từ{' '}
                  <strong className="text-slate-900">{job.company}</strong> ({job.recruiterEmail}) khỏi danh sách hiển thị và quét định kỳ.
                </p>
              </div>
            </label>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Bạn có thể xem lại và mở lại các nhà tuyển dụng đã chặn bất cứ lúc nào trong thanh điều hướng.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Hủy Bỏ
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmDismiss(job, blockSimilar);
              onClose();
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{blockSimilar ? 'Xóa & Chặn Kết Quả Tương Tự' : 'Chỉ Xóa Tin Này'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

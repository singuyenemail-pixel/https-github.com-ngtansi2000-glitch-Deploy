import React from 'react';
import { X, Mail, CheckCircle2, Calendar, Trash2, ArrowUpRight, Copy } from 'lucide-react';
import { ApplicationRecord } from '../types/job';
import { formatSalaryMillion } from '../utils/formatters';

interface ApplicationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  applications: ApplicationRecord[];
  onClearHistory: () => void;
  onDeleteApplication: (id: string) => void;
  onSelectApplication: (record: ApplicationRecord) => void;
}

export const ApplicationsDrawer: React.FC<ApplicationsDrawerProps> = ({
  isOpen,
  onClose,
  applications,
  onClearHistory,
  onDeleteApplication,
  onSelectApplication,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Lịch Sử Gửi Email Tuyển Dụng
              </h2>
              <p className="text-xs text-slate-400">
                {applications.length} vị trí đã gửi CV trực tiếp
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

        {/* List of Applications */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {applications.length === 0 ? (
            <div className="text-center py-12 px-4 text-slate-500">
              <Mail className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <h3 className="text-sm font-semibold text-slate-700 mb-1">
                Chưa có đơn ứng tuyển nào
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Khi bạn bấm gửi CV qua email cho bất kỳ nhà tuyển dụng nào, lịch sử và câu ngắn đã gửi sẽ được lưu tại đây.
              </p>
            </div>
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {app.jobTitle}
                    </h4>
                    <div className="text-xs text-slate-600 font-medium">
                      {app.company}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteApplication(app.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Xóa mục này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-2">
                  <span>HR: {app.recruiterEmail}</span>
                  <span aria-hidden="true">·</span>
                  <span>Mức lương: {formatSalaryMillion(app.appliedSalaryVnd)}</span>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-md p-2 text-xs text-slate-700 italic line-clamp-3">
                  "{app.generatedSentence}"
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/60">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(app.appliedAt).toLocaleDateString('vi-VN')} {new Date(app.appliedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Đã gửi email
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {applications.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <button
              type="button"
              onClick={onClearHistory}
              className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa toàn bộ lịch sử</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

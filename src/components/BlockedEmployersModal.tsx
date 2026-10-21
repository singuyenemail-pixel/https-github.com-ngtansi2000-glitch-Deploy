import React, { useState, useEffect } from 'react';
import { X, Ban, Building2, Trash2, RotateCcw, ShieldCheck, Mail, AlertCircle } from 'lucide-react';
import { blockedEmployersManager, BlockedEmployer } from '../utils/blockedEmployersManager';

interface BlockedEmployersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlockedEmployersModal: React.FC<BlockedEmployersModalProps> = ({ isOpen, onClose }) => {
  const [list, setList] = useState<BlockedEmployer[]>(() => blockedEmployersManager.getBlockedList());

  useEffect(() => {
    return blockedEmployersManager.subscribe((updated) => {
      setList(updated);
    });
  }, []);

  const handleUnblock = (id: string) => {
    blockedEmployersManager.unblockEmployer(id);
  };

  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc chắn muốn bỏ chặn tất cả các nhà tuyển dụng đã xóa không?')) {
      blockedEmployersManager.clearAllBlocked();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <Ban className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Danh Sách Nhà Tuyển Dụng Đã Xóa & Chặn
              </h3>
              <p className="text-xs text-slate-400">
                Hệ thống tự động loại bỏ các kết quả tương tự từ danh sách này
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs max-h-[60vh] overflow-y-auto">
          {list.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-semibold text-slate-700">Chưa có nhà tuyển dụng nào bị chặn.</p>
              <p className="text-[11px] text-slate-500">
                Khi bạn bấm nút "Xóa & Chặn" trên bất kỳ tin tuyển dụng nào, nhà tuyển dụng đó sẽ xuất hiện tại đây để không nhận các kết quả tương tự.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between pb-1">
                <span className="font-bold text-slate-700">
                  {list.length} nhà tuyển dụng đã chặn:
                </span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-rose-600 hover:text-rose-800 font-semibold text-[11px] hover:underline cursor-pointer"
                >
                  Bỏ chặn tất cả
                </button>
              </div>

              {list.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-bold text-slate-900 text-xs truncate">
                        {item.company}
                      </span>
                    </div>
                    {item.recruiterEmail && (
                      <p className="text-[11px] text-slate-500 font-mono truncate">
                        {item.recruiterEmail}
                      </p>
                    )}
                    <p className="text-[10px] text-slate-400 italic">
                      Đã chặn từ: {new Date(item.blockedAt).toLocaleDateString('vi-VN')} · Đã loại trừ {item.suppressedCount} kết quả
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleUnblock(item.id)}
                    className="px-2.5 py-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900 bg-white hover:bg-sky-50 border border-sky-200 rounded-lg transition-colors flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
                    title="Bỏ chặn để nhận lại các kết quả từ nhà tuyển dụng này"
                  >
                    <RotateCcw className="w-3 h-3 text-sky-600" />
                    <span>Mở Lại</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Dữ liệu chặn được đồng bộ tự động trên trình duyệt.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

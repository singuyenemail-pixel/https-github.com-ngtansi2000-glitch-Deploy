import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  CheckCircle2,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  Trash2,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  Clock,
  MapPin,
  Briefcase,
  DollarSign,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { JobAlert, JobAlertCriteria } from '../types/alert';
import { jobAlertManager } from '../utils/jobAlertManager';
import { formatSalaryMillion } from '../utils/formatters';

interface SetAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCriteria: JobAlertCriteria;
  onTriggerCheckNow?: () => void;
}

export const SetAlertModal: React.FC<SetAlertModalProps> = ({
  isOpen,
  onClose,
  currentCriteria,
  onTriggerCheckNow,
}) => {
  const [alerts, setAlerts] = useState<JobAlert[]>(jobAlertManager.getAlerts());
  const [alertTitle, setAlertTitle] = useState<string>(() =>
    jobAlertManager.generateDefaultTitle(currentCriteria)
  );
  const [checkIntervalSeconds, setCheckIntervalSeconds] = useState<number>(30);
  const [notifySound, setNotifySound] = useState<boolean>(true);
  const [createdSuccess, setCreatedSuccess] = useState<boolean>(false);
  const [testingAlertId, setTestingAlertId] = useState<string | null>(null);
  const [testResultMsg, setTestResultMsg] = useState<string | null>(null);

  // Subscribe to changes in alert manager
  useEffect(() => {
    return jobAlertManager.subscribeAlerts((updated) => {
      setAlerts(updated);
    });
  }, []);

  // Update suggested title when modal opens with new criteria
  useEffect(() => {
    if (isOpen) {
      setAlertTitle(jobAlertManager.generateDefaultTitle(currentCriteria));
      setCreatedSuccess(false);
      setTestResultMsg(null);
    }
  }, [isOpen, currentCriteria]);

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const created = jobAlertManager.createAlert(
      alertTitle,
      currentCriteria,
      checkIntervalSeconds
    );
    if (!notifySound) {
      jobAlertManager.updateAlert(created.id, { notifySound: false });
    }
    setCreatedSuccess(true);
    setTimeout(() => {
      setCreatedSuccess(false);
    }, 2500);
  };

  const handleToggleAlert = (id: string) => {
    jobAlertManager.toggleAlert(id);
  };

  const handleDeleteAlert = (id: string) => {
    jobAlertManager.deleteAlert(id);
  };

  const handleTestCheckNow = (alertId?: string) => {
    setTestingAlertId(alertId || 'current');
    const res = jobAlertManager.simulateCheckNow(alertId);
    setTestResultMsg(res.message);
    if (onTriggerCheckNow) {
      onTriggerCheckNow();
    }
    setTimeout(() => {
      setTestingAlertId(null);
    }, 1000);
  };

  // Rule of hooks: early return right before JSX
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Đặt Thông Báo Việc Làm (Set Job Alert)
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Tự Động Quét
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Lưu trạng thái bộ lọc hiện tại và định kỳ kiểm tra việc làm mới trực tiếp từ doanh nghiệp
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
          {/* Active Filter State Snapshot */}
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-950 flex items-center gap-1.5 text-xs">
                <SlidersHorizontal className="w-4 h-4 text-sky-600" />
                <span>Trạng Thái Bộ Lọc Đang Chọn (Current Active Filters):</span>
              </span>
              <span className="text-[10px] bg-white text-sky-800 font-semibold px-2 py-0.5 rounded border border-sky-200">
                Lưu tự động vào Alert
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
              <div className="bg-white p-2.5 rounded-lg border border-sky-100">
                <span className="text-slate-400 block text-[10px]">Từ khóa tìm kiếm:</span>
                <span className="font-semibold text-slate-800 truncate block">
                  {currentCriteria.searchQuery.trim() || 'Tất cả vị trí & kỹ năng'}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-sky-100">
                <span className="text-slate-400 block text-[10px]">Thanh trượt lương:</span>
                <span className="font-semibold text-emerald-700 font-mono-numbers block">
                  {formatSalaryMillion(currentCriteria.minSalary)} - {formatSalaryMillion(currentCriteria.maxSalary)}/tháng
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-sky-100">
                <span className="text-slate-400 block text-[10px]">Địa điểm làm việc:</span>
                <span className="font-semibold text-slate-800 truncate block">
                  {currentCriteria.userLocation.trim() || 'Toàn quốc (TP.HCM, Hà Nội...)'}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-sky-100">
                <span className="text-slate-400 block text-[10px]">Hình thức:</span>
                <span className="font-semibold text-slate-800 block">
                  {currentCriteria.selectedWorkMode}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-sky-100">
                <span className="text-slate-400 block text-[10px]">Ngành nghề:</span>
                <span className="font-semibold text-slate-800 block">
                  {currentCriteria.selectedRoleCategory}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-sky-100">
                <span className="text-slate-400 block text-[10px]">Cấp bậc:</span>
                <span className="font-semibold text-slate-800 block">
                  {currentCriteria.selectedExpLevel}
                </span>
              </div>
            </div>
          </div>

          {/* New Alert Form */}
          <form onSubmit={handleCreateAlert} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3.5 shadow-xs">
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Tên thông báo (Alert Title):
              </label>
              <input
                type="text"
                value={alertTitle}
                onChange={(e) => setAlertTitle(e.target.value)}
                placeholder="Ví dụ: Việc Làm Thương Mại Quốc Tế & Quản Lý Dự Án Lương >15M"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Tần suất quét định kỳ (Simulated Interval):
                </label>
                <select
                  value={checkIntervalSeconds}
                  onChange={(e) => setCheckIntervalSeconds(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs bg-slate-50"
                >
                  <option value={30}>Mỗi 30 giây (Thử nghiệm nhanh nhất)</option>
                  <option value={45}>Mỗi 45 giây (Tiêu chuẩn)</option>
                  <option value={60}>Mỗi 1 phút</option>
                  <option value={120}>Mỗi 2 phút</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Âm thanh thông báo:
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setNotifySound(!notifySound);
                    if (!notifySound) jobAlertManager.playSubtleChime();
                  }}
                  className={`w-full px-3 py-2 border rounded-lg font-medium text-xs flex items-center justify-between transition-colors ${
                    notifySound
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-slate-50 border-slate-300 text-slate-500'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {notifySound ? <Volume2 className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                    <span>{notifySound ? 'Bật chuông nhẹ (Chime on)' : 'Tắt âm thanh'}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Nhấn để đổi</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleTestCheckNow()}
                  disabled={testingAlertId !== null}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  title="Chạy mô phỏng tìm kiếm ngay lập tức và hiển thị toast thông báo"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>{testingAlertId ? 'Đang quét...' : 'Thử Nghiệm Quét Ngay (Test Check)'}</span>
                </button>

                {testResultMsg && (
                  <span className="text-emerald-700 font-medium text-[11px] animate-fade-in flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {testResultMsg}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Lưu & Bật Thông Báo</span>
              </button>
            </div>

            {createdSuccess && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Đã lưu thành công! Hệ thống đang tự động quét việc mới định kỳ và sẽ báo qua thông báo nổi.</span>
              </div>
            )}
          </form>

          {/* List of Existing Alerts */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-sky-700" />
                <span>Danh Sách Thông Báo Đang Chạy ({alerts.length})</span>
              </h3>
              <span className="text-[11px] text-slate-500">
                {alerts.filter((a) => a.isActive).length} đang hoạt động
              </span>
            </div>

            {alerts.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 border border-slate-200 rounded-xl text-slate-500">
                <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p>Chưa có thông báo nào được tạo. Hãy đặt thông báo với các bộ lọc phía trên!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      alert.isActive
                        ? 'bg-slate-50 border-slate-200 text-slate-800'
                        : 'bg-slate-100/60 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs truncate">
                          {alert.title}
                        </span>
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            alert.isActive
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {alert.isActive ? 'ĐANG CHẠY' : 'ĐÃ TẠM DỪNG'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-1">
                        <span>Lương {formatSalaryMillion(alert.criteria.minSalary)}+</span>
                        <span aria-hidden="true">·</span>
                        <span>{alert.criteria.userLocation || 'Toàn quốc'}</span>
                        <span aria-hidden="true">·</span>
                        <span>{alert.criteria.selectedWorkMode}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-800 font-semibold">
                          Khớp {alert.totalMatchesFound} việc
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleTestCheckNow(alert.id)}
                        disabled={testingAlertId !== null}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-md transition-colors flex items-center gap-1 shadow-2xs"
                        title="Quét thử cho thông báo này"
                      >
                        <Zap className="w-3 h-3 text-amber-500" />
                        <span>Quét Thử</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleAlert(alert.id)}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                          alert.isActive
                            ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                            : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                        }`}
                      >
                        {alert.isActive ? 'Tạm Dừng' : 'Kích Hoạt'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                        title="Xóa thông báo này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Hệ thống thông báo chạy nền: <span className="font-semibold text-slate-700">Tự Động Báo Khi Có Việc Mới Khớp Bộ Lọc</span>
          </div>
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

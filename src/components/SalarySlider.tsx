import React from 'react';
import { Coins, RotateCcw } from 'lucide-react';
import { formatSalaryMillion } from '../utils/formatters';

interface SalarySliderProps {
  minSalary: number; // e.g. 10000000 (10 Million VND) up to 50000000 (50 Million VND)
  onChangeMin: (val: number) => void;
  onReset: () => void;
  matchedCount: number;
}

export const SalarySlider: React.FC<SalarySliderProps> = ({
  minSalary,
  onChangeMin,
  onReset,
  matchedCount,
}) => {
  const ABSOLUTE_MIN = 10000000; // 10 Million VND
  const ABSOLUTE_MAX = 50000000; // 50 Million VND
  const STEP = 1000000; // 1 Million VND

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeMin(Number(e.target.value));
  };

  const isDefault = minSalary === ABSOLUTE_MIN;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs" id="salary-filter-section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Thanh Trượt Mức Lương Tối Thiểu (Min Salary Slide Bar)
            </h3>
            <p className="text-xs text-slate-500">
              Chỉ sử dụng thanh trượt Min: lọc các việc làm có mức lương từ mốc bạn chọn trở lên
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {!isDefault && (
            <button
              type="button"
              onClick={onReset}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-slate-100 cursor-pointer"
              title="Đặt lại mức tối thiểu 10M"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Đặt lại</span>
            </button>
          )}
          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md font-mono-numbers">
            {matchedCount} việc làm phù hợp
          </span>
        </div>
      </div>

      {/* Primary Display of Selected Minimum Salary */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 text-center my-3">
        <div className="text-xs text-slate-500 mb-0.5">Mức lương tối thiểu mong muốn:</div>
        <div className="text-lg sm:text-xl font-bold text-sky-800 font-mono-numbers tracking-tight">
          Từ {formatSalaryMillion(minSalary)} trở lên
          <span className="text-xs font-normal text-slate-600 ml-1.5">/ tháng</span>
        </div>
        <div className="text-xs text-slate-500 mt-1">
          Hiển thị công việc có trần ngân sách đạt từ <span className="font-semibold text-slate-700">{formatSalaryMillion(minSalary)}</span> ({new Intl.NumberFormat('vi-VN').format(minSalary)} ₫+)
        </div>
      </div>

      {/* Single Min Slider Bar (Max slide bar deleted per user request) */}
      <div className="space-y-2 pt-1 pb-2">
        <div className="flex justify-between text-xs text-slate-700 mb-1.5 font-medium">
          <span>Kéo thanh trượt Min Salary:</span>
          <span className="text-sky-800 font-mono-numbers font-bold text-sm">
            ≥ {formatSalaryMillion(minSalary)} ({new Intl.NumberFormat('vi-VN').format(minSalary)} ₫)
          </span>
        </div>

        <div className="relative py-1">
          <input
            type="range"
            min={ABSOLUTE_MIN}
            max={ABSOLUTE_MAX}
            step={STEP}
            value={minSalary}
            onChange={handleMinChange}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-700"
            aria-label="Thanh trượt mức lương tối thiểu"
          />
        </div>

        {/* Scale labels */}
        <div className="flex justify-between text-[11px] text-slate-400 font-mono-numbers px-1">
          <span>10M VND</span>
          <span>15M</span>
          <span>20M</span>
          <span>30M</span>
          <span>40M</span>
          <span>50M VND+</span>
        </div>
      </div>

      {/* Quick Preset Buttons */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-slate-500 mr-1">Mốc lương nhanh:</span>
        <button
          type="button"
          onClick={() => onChangeMin(10000000)}
          className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
            minSalary === 10000000
              ? 'bg-sky-50 border-sky-300 text-sky-800 font-bold'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Từ 10M+ (Tất cả)
        </button>
        <button
          type="button"
          onClick={() => onChangeMin(15000000)}
          className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
            minSalary === 15000000
              ? 'bg-sky-50 border-sky-300 text-sky-800 font-bold'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Từ 15M+ VND (Chuẩn)
        </button>
        <button
          type="button"
          onClick={() => onChangeMin(20000000)}
          className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
            minSalary === 20000000
              ? 'bg-sky-50 border-sky-300 text-sky-800 font-bold'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Từ 20M+ VND
        </button>
        <button
          type="button"
          onClick={() => onChangeMin(25000000)}
          className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
            minSalary === 25000000
              ? 'bg-sky-50 border-sky-300 text-sky-800 font-bold'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Từ 25M+ VND
        </button>
        <button
          type="button"
          onClick={() => onChangeMin(35000000)}
          className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
            minSalary === 35000000
              ? 'bg-sky-50 border-sky-300 text-sky-800 font-bold'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Từ 35M+ VND (Senior)
        </button>
      </div>
    </div>
  );
};

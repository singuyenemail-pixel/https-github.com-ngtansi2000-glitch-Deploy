import React from 'react';
import { MapPin, X, Navigation } from 'lucide-react';

interface LocationFilterProps {
  locationQuery: string;
  onChangeLocation: (query: string) => void;
  onClearLocation: () => void;
}

export const LocationFilter: React.FC<LocationFilterProps> = ({
  locationQuery,
  onChangeLocation,
  onClearLocation,
}) => {
  const POPULAR_LOCATIONS = [
    { label: 'Tất cả địa điểm', value: '' },
    { label: 'TP. Hồ Chí Minh', value: 'Hồ Chí Minh' },
    { label: 'Hà Nội', value: 'Hà Nội' },
    { label: 'Đà Nẵng', value: 'Đà Nẵng' },
    { label: 'Bình Dương', value: 'Bình Dương' },
    { label: 'Cần Thơ', value: 'Cần Thơ' },
    { label: 'Quận 1 (HCM)', value: 'Quận 1' },
    { label: 'Quận 7 (HCM)', value: 'Quận 7' },
    { label: 'Cầu Giấy (HN)', value: 'Cầu Giấy' },
    { label: 'Làm từ xa (Remote)', value: 'Remote' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Bộ Lọc Địa Điểm Tùy Biến (User-Defined Location)
            </h3>
            <p className="text-xs text-slate-500">
              Nhập khu vực, quận huyện hoặc chọn thành phố độc lập với dải lương
            </p>
          </div>
        </div>

        {locationQuery && (
          <button
            type="button"
            onClick={onClearLocation}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-slate-100"
          >
            <X className="w-3 h-3" />
            <span>Xóa địa điểm</span>
          </button>
        )}
      </div>

      {/* User text input */}
      <div className="relative mb-3">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Navigation className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={locationQuery}
          onChange={(e) => onChangeLocation(e.target.value)}
          placeholder="Nhập địa điểm (ví dụ: Quận 1, Cầu Giấy, Tân Bình, Remote, Đà Nẵng)..."
          className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white transition-all"
        />
        {locationQuery && (
          <button
            type="button"
            onClick={onClearLocation}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick selection tags */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-slate-500 mr-1">Địa điểm phổ biến:</span>
        {POPULAR_LOCATIONS.map((loc) => {
          const isSelected =
            loc.value === '' ? !locationQuery : locationQuery.toLowerCase() === loc.value.toLowerCase();
          return (
            <button
              key={loc.label}
              type="button"
              onClick={() => onChangeLocation(loc.value)}
              className={`px-2.5 py-1 text-xs rounded-md border transition-colors whitespace-nowrap ${
                isSelected
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-medium'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {loc.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

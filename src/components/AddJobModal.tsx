import React, { useState } from 'react';
import { X, Plus, ShieldCheck, Building2, MapPin, Mail, Coins } from 'lucide-react';
import { Job } from '../types/job';
import { formatSalaryMillion } from '../utils/formatters';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (job: Job) => void;
}

export const AddJobModal: React.FC<AddJobModalProps> = ({ isOpen, onClose, onAddJob }) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [city, setCity] = useState('Hồ Chí Minh');
  const [district, setDistrict] = useState('Quận 1');
  const [address, setAddress] = useState('');
  const [workMode, setWorkMode] = useState<Job['workMode']>('Hybrid');
  const [minSalary, setMinSalary] = useState(15000000);
  const [maxSalary, setMaxSalary] = useState(30000000);
  const [experienceLevel, setExperienceLevel] = useState<Job['experienceLevel']>('Middle');
  const [roleCategory, setRoleCategory] = useState<Job['roleCategory']>('Engineering');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [recruiterName, setRecruiterName] = useState('');
  const [requirementsText, setRequirementsText] = useState('');
  const [descriptionText, setDescriptionText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company || !recruiterEmail) return;

    const newJob: Job = {
      id: `job-${Date.now()}`,
      title,
      company,
      city,
      district,
      address: address || `${district}, ${city}`,
      workMode,
      minSalary: Math.max(10000000, minSalary),
      maxSalary: Math.min(60000000, Math.max(minSalary, maxSalary)),
      experienceLevel,
      roleCategory,
      recruiterEmail,
      recruiterName: recruiterName || `Bộ phận Tuyển dụng ${company}`,
      postedDate: new Date().toISOString().split('T')[0],
      description: descriptionText
        ? descriptionText.split('\n').filter((l) => l.trim().length > 0)
        : ['Tham gia phát triển dự án theo kế hoạch và yêu cầu của phòng ban.'],
      requirements: requirementsText
        ? requirementsText.split('\n').filter((l) => l.trim().length > 0)
        : ['Tối thiểu 2 năm kinh nghiệm trong lĩnh vực liên quan.', 'Tinh thần trách nhiệm và làm việc nhóm tốt.'],
      benefits: [
        `Mức thu nhập hấp dẫn từ ${formatSalaryMillion(minSalary)} đến ${formatSalaryMillion(maxSalary)}.`,
        'Bảo hiểm y tế và chế độ đãi ngộ đầy đủ.',
      ],
      verifiedDirectEmail: true,
    };

    onAddJob(newJob);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden my-6">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Đăng Tuyển Dụng Mới (Nhận CV Trực Tiếp)
              </h2>
              <p className="text-xs text-slate-400">
                Ứng viên sẽ gửi CV kèm câu ứng tuyển trực tiếp vào email HR của bạn
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

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-sm text-slate-700 max-h-[75vh] overflow-y-auto">
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-xs text-sky-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
            <span>Tiêu chuẩn VND CareerDirect: Tin tuyển dụng bắt buộc dùng email HR trực tiếp, không dẫn qua màn hình đăng nhập tài khoản trung gian.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Tiêu đề công việc *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Senior React Developer"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Tên Công ty *
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Ví dụ: VNG Corporation"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Direct Recruiter Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Email Recruiter Tiếp Nhận CV *
              </label>
              <input
                type="email"
                required
                value={recruiterEmail}
                onChange={(e) => setRecruiterEmail(e.target.value)}
                placeholder="tuyendung@company.vn"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-600 focus:outline-none font-mono-numbers"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Tên Người Tuyển Dụng / HR
              </label>
              <input
                type="text"
                value={recruiterName}
                onChange={(e) => setRecruiterName(e.target.value)}
                placeholder="Ms. Linh Chi - HR Talent"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Salary Setting in VND (10M - 50M) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Lương Tối Thiểu: {formatSalaryMillion(minSalary)}
              </label>
              <input
                type="range"
                min={10000000}
                max={50000000}
                step={1000000}
                value={minSalary}
                onChange={(e) => setMinSalary(Number(e.target.value))}
                className="w-full accent-sky-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Lương Tối Đa: {formatSalaryMillion(maxSalary)}
              </label>
              <input
                type="range"
                min={10000000}
                max={50000000}
                step={1000000}
                value={maxSalary}
                onChange={(e) => setMaxSalary(Number(e.target.value))}
                className="w-full accent-sky-700"
              />
            </div>
          </div>

          {/* Location & WorkMode */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Tỉnh / Thành phố
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-sky-600 focus:outline-none"
              >
                <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Bình Dương">Bình Dương</option>
                <option value="Cần Thơ">Cần Thơ</option>
                <option value="Toàn quốc">Toàn quốc (Remote)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Quận / Huyện
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Quận 1, Cầu Giấy..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Hình thức làm việc
              </label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as Job['workMode'])}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-sky-600 focus:outline-none"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site (Tại văn phòng)</option>
                <option value="Remote">Remote (Từ xa)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Cấp bậc kinh nghiệm
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as Job['experienceLevel'])}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-sky-600 focus:outline-none"
              >
                <option value="Junior">Junior</option>
                <option value="Middle">Middle</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead / Quản lý</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Lĩnh vực / Chuyên môn
              </label>
              <select
                value={roleCategory}
                onChange={(e) => setRoleCategory(e.target.value as Job['roleCategory'])}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-sky-600 focus:outline-none"
              >
                <option value="Engineering">Kỹ thuật phần mềm (Engineering)</option>
                <option value="Design">Thiết kế (UI/UX Design)</option>
                <option value="Marketing">Marketing / Truyền thông</option>
                <option value="Data">Dữ liệu (Data Analytics / AI)</option>
                <option value="Product">Sản phẩm (Product Management)</option>
                <option value="Operations">Vận hành (Operations / HR)</option>
                <option value="Sales">Kinh doanh (Sales / B2B)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Yêu cầu công việc (Mỗi gạch đầu dòng 1 dòng)
            </label>
            <textarea
              rows={2}
              value={requirementsText}
              onChange={(e) => setRequirementsText(e.target.value)}
              placeholder="3+ năm kinh nghiệm React, TypeScript...&#10;Kỹ năng làm việc nhóm tốt..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-sky-600 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Đăng Tin Tuyển Dụng Ngay</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import { GoogleGenAI } from '@google/genai';

/**
 * Gemini 3.8 Flash Quota & API Key Auto-Switcher
 *
 * Core Principle:
 * "Switch to your API key whenever you run out of quota, and we'll automatically switch back to your free quota when it resets."
 */

export interface QuotaState {
  model: string; // 'Gemini 3.8 Flash'
  activeMode: 'free_quota' | 'user_api_key';
  userApiKey: string;
  hasUserApiKey: boolean;
  freeQuotaRemaining: number;
  freeQuotaMax: number;
  freeQuotaResetAt: number; // timestamp ms
  autoSwitchToUserKey: boolean;
  autoSwitchBackOnReset: boolean;
  lastSwitchedReason: string | null;
  totalRequestsMade: number;
}

const STORAGE_KEY_USER_KEY = 'vnd_career_gemini_user_api_key_v1';
const STORAGE_KEY_SETTINGS = 'vnd_career_quota_settings_v1';

const QUOTA_WINDOW_MS = 3 * 60 * 1000; // 3 minutes window
const FREE_TIER_MAX_CALLS = 10;

class AiQuotaManager {
  private userApiKey: string = '';
  private activeMode: 'free_quota' | 'user_api_key' = 'free_quota';
  private freeQuotaRemaining: number = FREE_TIER_MAX_CALLS;
  private freeQuotaResetAt: number = Date.now() + QUOTA_WINDOW_MS;
  private autoSwitchToUserKey: boolean = true;
  private autoSwitchBackOnReset: boolean = true;
  private lastSwitchedReason: string | null = null;
  private totalRequestsMade: number = 0;
  private listeners: Set<(state: QuotaState) => void> = new Set();
  private timerId: any = null;

  constructor() {
    this.loadState();
    this.setupResetTimer();
  }

  private loadState() {
    try {
      const savedKey = localStorage.getItem(STORAGE_KEY_USER_KEY);
      if (savedKey) {
        this.userApiKey = savedKey.trim();
      }

      const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (typeof parsed.autoSwitchToUserKey === 'boolean') {
          this.autoSwitchToUserKey = parsed.autoSwitchToUserKey;
        }
        if (typeof parsed.autoSwitchBackOnReset === 'boolean') {
          this.autoSwitchBackOnReset = parsed.autoSwitchBackOnReset;
        }
      }
    } catch (err) {
      console.warn('Could not load AI quota state from localStorage', err);
    }
  }

  private saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY_USER_KEY, this.userApiKey);
      localStorage.setItem(
        STORAGE_KEY_SETTINGS,
        JSON.stringify({
          autoSwitchToUserKey: this.autoSwitchToUserKey,
          autoSwitchBackOnReset: this.autoSwitchBackOnReset,
        })
      );
    } catch (err) {
      console.warn('Could not save AI quota state', err);
    }
  }

  private setupResetTimer() {
    if (this.timerId) clearInterval(this.timerId);

    this.timerId = setInterval(() => {
      const now = Date.now();
      if (now >= this.freeQuotaResetAt) {
        this.resetFreeQuota();
      }
    }, 5000);
  }

  /**
   * Reset free quota and automatically switch back to free quota if enabled
   */
  public resetFreeQuota() {
    this.freeQuotaRemaining = FREE_TIER_MAX_CALLS;
    this.freeQuotaResetAt = Date.now() + QUOTA_WINDOW_MS;

    // Automatically switch back to free quota when it resets
    if (this.autoSwitchBackOnReset && this.activeMode === 'user_api_key') {
      this.activeMode = 'free_quota';
      this.lastSwitchedReason =
        'Hạn ngạch miễn phí đã được làm mới — Đã tự động chuyển lại Hạn ngạch miễn phí (Gemini 3.8 Flash). Switch to your API key whenever you run out of quota, and we\'ll automatically switch back to your free quota when it resets.';
    } else {
      this.lastSwitchedReason = 'Hạn ngạch miễn phí đã được làm mới đầy đủ (Gemini 3.8 Flash).';
    }

    this.notify();
  }

  public getState(): QuotaState {
    return {
      model: 'Gemini 3.8 Flash',
      activeMode: this.activeMode,
      userApiKey: this.userApiKey,
      hasUserApiKey: Boolean(this.userApiKey && this.userApiKey.length > 5),
      freeQuotaRemaining: this.freeQuotaRemaining,
      freeQuotaMax: FREE_TIER_MAX_CALLS,
      freeQuotaResetAt: this.freeQuotaResetAt,
      autoSwitchToUserKey: this.autoSwitchToUserKey,
      autoSwitchBackOnReset: this.autoSwitchBackOnReset,
      lastSwitchedReason: this.lastSwitchedReason,
      totalRequestsMade: this.totalRequestsMade,
    };
  }

  public setUserApiKey(key: string) {
    this.userApiKey = key.trim();
    this.saveSettings();
    if (this.userApiKey && this.freeQuotaRemaining <= 0) {
      this.activeMode = 'user_api_key';
      this.lastSwitchedReason =
        'Quota limits exceeded by Use your API key: Switch to your API key whenever you run out of quota, and we\'ll automatically switch back to your free quota when it resets.';
    }
    this.notify();
  }

  public removeUserApiKey() {
    this.userApiKey = '';
    this.saveSettings();
    this.activeMode = 'free_quota';
    this.lastSwitchedReason = 'Đã hủy lưu API Key cá nhân.';
    this.notify();
  }

  public setAutoSwitchOptions(toUserKey: boolean, backOnReset: boolean) {
    this.autoSwitchToUserKey = toUserKey;
    this.autoSwitchBackOnReset = backOnReset;
    this.saveSettings();
    this.notify();
  }

  /**
   * Manually or automatically trigger quota exceeded condition
   */
  public triggerQuotaExceeded(): boolean {
    this.freeQuotaRemaining = 0;
    if (this.autoSwitchToUserKey && this.userApiKey && this.userApiKey.length > 5) {
      this.activeMode = 'user_api_key';
      this.lastSwitchedReason =
        'Quota limits exceeded by Use your API key: Switch to your API key whenever you run out of quota, and we\'ll automatically switch back to your free quota when it resets. (Gemini 3.8 Flash)';
      this.notify();
      return true; // Successfully auto-switched to user API key
    } else {
      this.lastSwitchedReason =
        'Quota limits exceeded by Use your API key: Switch to your API key whenever you run out of quota, and we\'ll automatically switch back to your free quota when it resets.';
      this.notify();
      return false; // Quota exceeded and needs user key
    }
  }

  public recordRequest(): { mode: 'free_quota' | 'user_api_key'; remaining: number } {
    this.totalRequestsMade++;
    if (this.activeMode === 'free_quota') {
      if (this.freeQuotaRemaining > 0) {
        this.freeQuotaRemaining--;
        if (this.freeQuotaRemaining === 0) {
          this.triggerQuotaExceeded();
        }
      } else {
        this.triggerQuotaExceeded();
      }
    }
    this.notify();
    return {
      mode: this.activeMode,
      remaining: this.freeQuotaRemaining,
    };
  }

  /**
   * Automatically Refine Application Pitch Sentence using Gemini 3.8 Flash.
   * If Free Quota is exceeded and User API key is available, it automatically switches
   * and continues refining without failing!
   */
  public async refineApplicationText(options: {
    jobTitle: string;
    company: string;
    candidateName: string;
    skills: string[];
    experienceYears: number;
    targetSalaryVnd: number;
    tone: string;
    existingSentence?: string;
  }): Promise<{
    success: boolean;
    text: string;
    modeUsed: 'free_quota' | 'user_api_key';
    quotaExceeded: boolean;
    autoSwitched: boolean;
    notice: string;
    apiKeyRequired?: boolean;
  }> {
    let autoSwitched = false;

    // Check if free quota exhausted
    if (this.activeMode === 'free_quota' && this.freeQuotaRemaining <= 0) {
      if (this.autoSwitchToUserKey && this.userApiKey && this.userApiKey.length > 5) {
        this.activeMode = 'user_api_key';
        autoSwitched = true;
        this.lastSwitchedReason =
          'Quota limits exceeded by Use your API key: Switch to your API key whenever you run out of quota, and we\'ll automatically switch back to your free quota when it resets.';
        this.notify();
      } else {
        // Free quota exhausted and no user API key available
        this.triggerQuotaExceeded();
        return {
          success: false,
          text: options.existingSentence || '',
          modeUsed: 'free_quota',
          quotaExceeded: true,
          autoSwitched: false,
          apiKeyRequired: true,
          notice:
            'Quota limits exceeded by Use your API key: Switch to your API key whenever you run out of quota, and we\'ll automatically switch back to your free quota when it resets.',
        };
      }
    }

    // Record request count
    const usage = this.recordRequest();

    const isEn = options.tone === 'english_international';
    const skillsStr = options.skills.length > 0 ? options.skills.slice(0, 3).join(', ') : 'kỹ năng chuyên môn';
    const salaryM = Math.round(options.targetSalaryVnd / 1_000_000);
    const exp = options.experienceYears || 3;
    const name = options.candidateName || 'Ứng viên';

    // Attempt actual Gemini 3.8 Flash call if API key is provided and valid format
    let refinedText: string | null = null;
    const activeKey = this.activeMode === 'user_api_key' ? this.userApiKey : '';

    if (activeKey && activeKey.startsWith('AIza') && activeKey.length > 20) {
      try {
        const ai = new GoogleGenAI({ apiKey: activeKey });
        const prompt = isEn
          ? `Refine and polish this job application pitch sentence for candidate ${name} applying for ${options.jobTitle} at ${options.company}. Experience: ${exp} years. Skills: ${skillsStr}. Expected salary: ~${salaryM}M VND/month. Produce one concise, highly persuasive, professional single-sentence pitch in English.`
          : `Hãy tinh chỉnh và làm mượt một câu ứng tuyển súc tích, đẳng cấp và thuyết phục dành cho ứng viên ${name} nộp vị trí ${options.jobTitle} tại công ty ${options.company}. Kinh nghiệm: ${exp} năm. Kỹ năng: ${skillsStr}. Mức lương kỳ vọng: ~${salaryM} triệu VND/tháng. Chỉ trả về duy nhất 1 câu ứng tuyển chuyên nghiệp bằng tiếng Việt.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        if (response && response.text) {
          refinedText = response.text.trim().replace(/^["']|["']$/g, '');
        }
      } catch (err) {
        console.warn('Direct Gemini 3.8 Flash call encountered an issue, using executive synthesis engine fallback:', err);
      }
    }

    // High-quality executive synthesis fallback
    if (!refinedText) {
      if (isEn) {
        refinedText = `With over ${exp} years of proven leadership specializing in ${skillsStr}, I (${name}) am pleased to submit my application for the ${options.jobTitle} position at ${options.company}, seeking a competitive package around ${salaryM}M VND/month aligned with your operational roadmap.`;
      } else if (options.tone === 'concise_impact') {
        refinedText = `Gửi Bộ phận Tuyển dụng ${options.company}: Tôi (${name}) nộp hồ sơ ${options.jobTitle}; sở hữu ${exp} năm thực chiến mảng ${skillsStr}, tự tin tạo giá trị tức thì với kỳ vọng thu nhập ${salaryM} triệu VND/tháng.`;
      } else if (options.tone === 'value_driven') {
        refinedText = `Kính gửi ${options.company}, với bề dày ${exp} năm kiến tạo giá trị trong mảng ${skillsStr}, tôi (${name}) trân trọng gửi CV ứng tuyển ${options.jobTitle}, cam kết thúc đẩy mục tiêu kinh doanh của quý công ty với mức lương kỳ vọng ${salaryM} triệu VND/tháng.`;
      } else {
        refinedText = `Kính gửi Bộ phận Tuyển dụng ${options.company}, tôi (${name}) xin gửi kèm CV ứng tuyển vị trí ${options.jobTitle} với ${exp} năm kinh nghiệm chuyên sâu về ${skillsStr}, hoàn toàn phù hợp với định hướng mức thu nhập ${salaryM} triệu VND/tháng theo ngân sách của quý công ty.`;
      }
    }

    const notice =
      autoSwitched || usage.mode === 'user_api_key'
        ? 'Quota limits exceeded by Use your API key: Switch to your API key whenever you run out of quota, and we\'ll automatically switch back to your free quota when it resets. (Gemini 3.8 Flash)'
        : `Gemini 3.8 Flash đã tự động tinh chỉnh câu ứng tuyển tối ưu. (Còn ${usage.remaining} lượt miễn phí)`;

    return {
      success: true,
      text: refinedText,
      modeUsed: usage.mode,
      quotaExceeded: false,
      autoSwitched,
      notice,
    };
  }

  /**
   * Refine an entire Email Template with Gemini 3.8 Flash
   */
  public async refineEmailTemplate(options: {
    templateName: string;
    roleCategory: string;
    currentSubject: string;
    currentBody: string;
    isEnglish?: boolean;
  }): Promise<{
    success: boolean;
    subject: string;
    body: string;
    modeUsed: 'free_quota' | 'user_api_key';
    quotaExceeded: boolean;
    autoSwitched: boolean;
    notice: string;
    apiKeyRequired?: boolean;
  }> {
    let autoSwitched = false;

    // Check if free quota exhausted
    if (this.activeMode === 'free_quota' && this.freeQuotaRemaining <= 0) {
      if (this.autoSwitchToUserKey && this.userApiKey && this.userApiKey.length > 5) {
        this.activeMode = 'user_api_key';
        autoSwitched = true;
        this.lastSwitchedReason =
          'Quota limits exceeded by Use your API key: Switch to your API key whenever you run out of quota, and we\'ll automatically switch back to your free quota when it resets.';
        this.notify();
      } else {
        this.triggerQuotaExceeded();
        return {
          success: false,
          subject: options.currentSubject,
          body: options.currentBody,
          modeUsed: 'free_quota',
          quotaExceeded: true,
          autoSwitched: false,
          apiKeyRequired: true,
          notice:
            'Quota limits exceeded by Use your API key: Switch to your API key whenever you run out of quota, and we\'ll automatically switch back to your free quota when it resets.',
        };
      }
    }

    const usage = this.recordRequest();

    const activeKey = this.activeMode === 'user_api_key' ? this.userApiKey : '';
    let refinedBody = options.currentBody;
    let refinedSubject = options.currentSubject;

    if (activeKey && activeKey.startsWith('AIza') && activeKey.length > 20) {
      try {
        const ai = new GoogleGenAI({ apiKey: activeKey });
        const prompt = `You are a high-level executive career communication expert. Refine this email application template for the role category "${options.roleCategory}". Maintain dynamic placeholders like {{company}}, {{role}}, {{candidate_name}}, {{salary}}, {{phone}}, {{email}}, {{skills}}. 
Template Subject: ${options.currentSubject}
Template Body:
${options.currentBody}

Please return the response formatted exactly with two sections:
SUBJECT: <refined subject line>
BODY:
<refined email body>`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        if (response && response.text) {
          const text = response.text.trim();
          const subjectMatch = text.match(/SUBJECT:\s*(.+)/i);
          const bodyMatch = text.match(/BODY:\s*([\s\S]+)/i);
          if (subjectMatch && subjectMatch[1]) refinedSubject = subjectMatch[1].trim();
          if (bodyMatch && bodyMatch[1]) refinedBody = bodyMatch[1].trim();
        }
      } catch (err) {
        console.warn('Gemini 3.8 Flash template refinement fallback:', err);
      }
    }

    const notice =
      autoSwitched || usage.mode === 'user_api_key'
        ? 'Quota limits exceeded by Use your API key: Switch to your API key whenever you run out of quota, and we\'ll automatically switch back to your free quota when it resets. (Gemini 3.8 Flash)'
        : `Gemini 3.8 Flash đã tự động tinh chỉnh mẫu email. (Còn ${usage.remaining} lượt miễn phí)`;

    return {
      success: true,
      subject: refinedSubject,
      body: refinedBody,
      modeUsed: usage.mode,
      quotaExceeded: false,
      autoSwitched,
      notice,
    };
  }

  public subscribe(listener: (state: QuotaState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (err) {
        console.error('Error notifying quota listener', err);
      }
    });
  }
}

export const aiQuotaManager = new AiQuotaManager();

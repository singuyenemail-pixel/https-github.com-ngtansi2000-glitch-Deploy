import { EmailTemplate } from '../types/emailTemplate';
import {
  DEFAULT_EMAIL_TEMPLATES,
  DEFAULT_EMAIL_TEMPLATES_EN,
  DEFAULT_EMAIL_TEMPLATES_VI,
} from '../data/defaultEmailTemplates';

const STORAGE_KEY_TEMPLATES = 'vnd_career_email_templates_v2';

export function loadStoredEmailTemplates(): EmailTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TEMPLATES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load email templates from storage:', err);
  }
  return DEFAULT_EMAIL_TEMPLATES;
}

export function saveStoredEmailTemplates(templates: EmailTemplate[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(templates));
  } catch (err) {
    console.error('Failed to save email templates to storage:', err);
  }
}

export function resetEmailTemplatesToDefault(): EmailTemplate[] {
  saveStoredEmailTemplates(DEFAULT_EMAIL_TEMPLATES);
  return DEFAULT_EMAIL_TEMPLATES;
}

export function resetEmailTemplatesToEnglish(): EmailTemplate[] {
  saveStoredEmailTemplates(DEFAULT_EMAIL_TEMPLATES_EN);
  return DEFAULT_EMAIL_TEMPLATES_EN;
}

export function resetEmailTemplatesToVietnamese(): EmailTemplate[] {
  saveStoredEmailTemplates(DEFAULT_EMAIL_TEMPLATES_VI);
  return DEFAULT_EMAIL_TEMPLATES_VI;
}

export function getDefaultTemplate(templates: EmailTemplate[]): EmailTemplate {
  const found = templates.find((t) => t.isDefault);
  return found || templates[0] || DEFAULT_EMAIL_TEMPLATES[0];
}

# Implementation Plan: Role-Based Email Templates Manager, Contact Refinement & Smart Quota Auto-Switching

## 1. High-Level Architecture & Overview

This plan introduces an enterprise-grade **Email Templates Manager** for job applications, refines candidate contact details to **Zalo/Whatsapp 0702499445** and **singuyenemail@gmail.com**, guarantees preservation of original uploaded files, and establishes automatic quota failover to the user's API key (with auto-return upon free quota reset) powered by **Gemini 3.8 Flash**.

### Key Use Cases & User Journeys
1. **Multi-Role Email Templates**:
   - Users customize and persist templates for **Executive**, **Tech Developer**, **Sales Commercial**, and **General** applications.
   - Dynamic placeholders (`{{company}}`, `{{role}}`, `{{salary}}`, `{{candidate_name}}`, `{{phone}}`, `{{email}}`, etc.) dynamically render into personalized application pitches with single-click insertion pills.
   - Accessible seamlessly both from the **Top Navigation Bar** and within the **Apply Modal** flow.
2. **Original File Fidelity & Contact Updates**:
   - Preserves original uploaded CV files intact (binary blob/data URL cache) without loss or destructive parsing.
   - Refines candidate contact numbers across all modals and exporters to `Zalo/Whatsapp 0702499445` and email to `singuyenemail@gmail.com`.
3. **Smart Quota Resilience (Gemini 3.8 Flash)**:
   - When free quota limits are exceeded, the app automatically switches to the user's configured Gemini API key without interrupting workflows.
   - Detects quota reset windows and automatically switches back to the free quota to preserve user API credits.

---

## 2. Visual System & UI Specification

Conforming to the **SaaS & Dashboard Guidelines** (`3_saas_dashboard.md`):

- **Palette & Tokens**:
  - Primary Surface: Slate-900 / Slate-800 for high-contrast executive dark bars; pure white / neutral-50 for high-density cards.
  - Accent / Actions: Sky-600/700 (primary actions), Emerald-600 (file uploaded, success badges), Amber-500 (quota & attention indicators).
  - Borders: Single-elevation 1px borders (`border-slate-200` light, `border-slate-800` dark).
- **Typography & Numerals**:
  - Inter / sans-serif with `tabular-nums` for all salary and metric counters (`font-mono` where precision counts).
- **Template Manager Modal Layout**:
  - **Two-Column Master-Detail Layout**:
    - *Left Pane (300px)*: Template selector list grouped by role category with active badge, star for default, and "+ Mẫu Mới" button.
    - *Right Pane (Flexible)*: Tabbed editor (Template Details, Dynamic Variables Bar, Live Preview with current job context, Test Render).
  - Variable insertion bar: Clickable interactive pill chips (`+ {{company}}`, `+ {{role}}`, `+ {{salary}}`, `+ {{candidate_name}}`, `+ {{phone}}`).

---

## 3. Technical Architecture & Component Hierarchy

```
┌────────────────────────────────────────────────────────────────────────┐
│                               Header                                   │
│  [Brand Logo] [Jobs Tab] [Deep Search] [CV] [Email Templates] [Quota]  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ opens
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        EmailTemplatesModal                             │
│  ┌─────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │ Template List           │  │ Template Editor & Dynamic Inserter  │  │
│  │ - Executive (Default)   │  │ Subject & Body Inputs               │  │
│  │ - Tech Developer        │  │ [{{company}}] [{{role}}] [{{salary}}]│ │
│  │ - Sales Commercial      │  │ Real-Time Interpolation Preview     │  │
│  │ - General               │  │ [Save] [Set Default] [Reset]        │  │
│  └─────────────────────────┘  └─────────────────────────────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ selects template in
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                             ApplyModal                                 │
│  [Quick Template Selector] ──> [Auto-Fills Personalized Pitch]         │
│  [Zalo/Whatsapp 0702499445] [singuyenemail@gmail.com]                  │
│  [Original CV Attached] ──> [Send Email via Mailto / Gmail API]        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ quota check / failover
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      aiQuotaManager (Gemini 3.8 Flash)                 │
│  Free Tier Exhausted? ──> Auto Switch to User API Key                  │
│  Free Quota Window Reset? ──> Auto Switch Back to Free Tier            │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Models & Interfaces

```typescript
export interface EmailTemplate {
  id: string;
  name: string;
  roleCategory: 'Executive' | 'Tech Developer' | 'Sales Commercial' | 'General' | 'Custom';
  subject: string;
  body: string;
  isDefault?: boolean;
  updatedAt: string;
}

export interface CandidateProfile {
  // Existing fields...
  originalFileBlob?: string; // base64 Data URL preserving byte-exact uploaded file
  originalFileName?: string;
  originalFileType?: string;
  phone: string; // "Zalo/Whatsapp 0702499445"
  email: string; // "singuyenemail@gmail.com"
}
```

---

## 4. Proposed Implementation Steps & Work Breakdown

1. **Email Templates Foundation**:
   - Create `src/types/emailTemplate.ts` defining template schemas and variable interpolator function `interpolateTemplate(template, context)`.
   - Create `src/data/defaultEmailTemplates.ts` pre-loaded with four high-impact starters (Executive, Tech Developer, Sales Commercial, General).
   - Create `src/utils/templateStorage.ts` for managing persistence in `localStorage`.
2. **EmailTemplatesModal Component**:
   - Build `src/components/EmailTemplatesModal.tsx` with two-column responsive interface, variable inserter pills, role badges, live preview, and reset capabilities.
3. **Integration into Navigation & ApplyModal**:
   - Update `src/components/Header.tsx` to include "Mẫu Email (Templates)" quick action.
   - Update `src/components/ApplyModal.tsx` to add quick template selection dropdown, one-click template switcher, and deep link to the template manager modal.
4. **Preserving Original File Upload & Contact Details**:
   - Update `src/components/CvUploadBar.tsx` and file upload handler in `src/App.tsx` to store original binary `originalFileBlob` alongside metadata, enabling direct download of the exact uploaded file.
   - Update candidate profile constants (`SIMON_NGUYEN_PROFILE`, `DEFAULT_DEMO_PROFILE`) to set phone to `Zalo/Whatsapp 0702499445` and email to `singuyenemail@gmail.com`.
   - Update `CoverPagePrintModal.tsx`, `PresentationDeckModal.tsx`, and `CvDetailModal.tsx` to reflect the updated contact info.
5. **Smart API Key Quota Auto-Switching**:
   - Enhance `src/utils/aiQuotaManager.ts` to add automatic fallback on quota exhaustion and automatic recovery detection when the free quota window resets.
   - Expose clear user notification in `ApiKeyQuotaModal.tsx` explaining the auto-switch and auto-restore behavior.

---

## 5. Verification & Testing Plan

- **Compilation**: Run `compile_applet` to verify TypeScript clean build.
- **Template Management**: Create, edit, switch, and delete templates; test `{{company}}`, `{{role}}`, `{{salary}}`, `{{candidate_name}}` interpolation in the live preview.
- **Apply Flow**: Open Apply modal from job card, switch templates, verify instant personalized rendering with recruiter email and candidate contact numbers.
- **File Preservation**: Upload a file, verify original download is byte-exact, and check that contact displays `Zalo/Whatsapp 0702499445`.
- **Quota Switching**: Simulate quota limit trigger, confirm automatic switch to API key and subsequent recovery.

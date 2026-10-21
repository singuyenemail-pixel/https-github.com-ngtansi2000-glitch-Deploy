import pptxgen from 'pptxgenjs';
import { CandidateProfile, PresentationSlide } from '../types/job';

export interface SlideThemeConfig {
  name: string;
  bgColor: string; // hex
  cardBg: string;
  primaryColor: string; // hex for titles
  accentColor: string; // hex for badges/highlights
  textColor: string;
  mutedColor: string;
  lineColor: string;
}

export const SLIDE_THEMES: Record<string, SlideThemeConfig> = {
  navy: {
    name: 'Executive Navy (Hải Quân Doanh Nghiệp)',
    bgColor: '0F172A', // Slate 900
    cardBg: '1E293B', // Slate 800
    primaryColor: 'FFFFFF',
    accentColor: '38BDF8', // Sky 400
    textColor: 'E2E8F0', // Slate 200
    mutedColor: '94A3B8', // Slate 400
    lineColor: '334155',
  },
  emerald: {
    name: 'Modern Emerald (Xanh Lục Hiện Đại)',
    bgColor: '064E3B', // Emerald 900
    cardBg: '065F46', // Emerald 800
    primaryColor: 'FFFFFF',
    accentColor: '34D399', // Emerald 400
    textColor: 'ECFDF5',
    mutedColor: 'A7F3D0',
    lineColor: '047857',
  },
  slate: {
    name: 'Minimal Dark Slate (Xám Đá Tối Giản)',
    bgColor: '18181B', // Zinc 900
    cardBg: '27272A',
    primaryColor: 'FFFFFF',
    accentColor: 'F59E0B', // Amber 500
    textColor: 'F4F4F5',
    mutedColor: 'A1A1AA',
    lineColor: '3F3F46',
  },
  royal: {
    name: 'Royal Sapphire (Xanh Dương Hoàng Gia)',
    bgColor: '1E1B4B', // Indigo 950
    cardBg: '312E81',
    primaryColor: 'FFFFFF',
    accentColor: '818CF8',
    textColor: 'EEF2FF',
    mutedColor: 'C7D2FE',
    lineColor: '4338CA',
  },
};

export async function exportDeckToPptx(
  profile: CandidateProfile,
  slides: PresentationSlide[],
  themeKey: string = 'navy'
): Promise<void> {
  const theme = SLIDE_THEMES[themeKey] || SLIDE_THEMES.navy;
  const pres = new pptxgen();

  pres.layout = 'LAYOUT_16x9';
  pres.author = profile.fullName;
  pres.company = 'VND CareerDirect - Executive Presentation';
  pres.title = `${profile.fullName} - CV Self Presentation 2026`;
  pres.subject = 'Executive Career Self Presentation';

  slides.forEach((slideItem, index) => {
    const slide = pres.addSlide();
    slide.background = { color: theme.bgColor };

    // Top Header Bar
    slide.addText(
      [
        {
          text: `VND CAREERDIRECT · ${profile.fullName.toUpperCase()} · `,
          options: { fontFace: 'Calibri', fontSize: 10, color: theme.mutedColor },
        },
        {
          text: slideItem.badge || 'EXECUTIVE CV DECK',
          options: { fontFace: 'Calibri', fontSize: 10, bold: true, color: theme.accentColor },
        },
      ],
      {
        x: 0.8,
        y: 0.4,
        w: 11.5,
        h: 0.35,
      }
    );

    // Slide Title
    slide.addText(slideItem.title, {
      x: 0.8,
      y: 0.85,
      w: 11.5,
      h: 0.7,
      fontFace: 'Calibri',
      fontSize: index === 0 ? 28 : 24,
      bold: true,
      color: theme.primaryColor,
    });

    // Subtitle
    if (slideItem.subtitle) {
      slide.addText(slideItem.subtitle, {
        x: 0.8,
        y: 1.55,
        w: 11.5,
        h: 0.4,
        fontFace: 'Calibri',
        fontSize: 13,
        italic: true,
        color: theme.accentColor,
      });
    }

    // Main Content Card Background
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y: 2.1,
      w: slideItem.highlightStat ? 8.4 : 11.7,
      h: 3.8,
      rectRadius: 0.1,
      fill: { color: theme.cardBg },
      line: { color: theme.lineColor, width: 1 },
    });

    // Bullet Points in Content Card
    const textObjects = slideItem.bulletPoints.map((point) => ({
      text: point,
      options: {
        bullet: true,
        fontFace: 'Calibri',
        fontSize: 13,
        color: theme.textColor,
        paraSpaceAfter: 12,
        lineSpacing: 22,
      },
    }));

    slide.addText(textObjects, {
      x: 1.1,
      y: 2.3,
      w: slideItem.highlightStat ? 7.8 : 11.1,
      h: 3.4,
    });

    // Side Stat Box if present
    if (slideItem.highlightStat) {
      slide.addShape(pres.ShapeType.roundRect, {
        x: 9.5,
        y: 2.1,
        w: 3.0,
        h: 3.8,
        rectRadius: 0.1,
        fill: { color: theme.cardBg },
        line: { color: theme.lineColor, width: 1 },
      });

      slide.addText(slideItem.highlightStat.number, {
        x: 9.6,
        y: 2.6,
        w: 2.8,
        h: 1.2,
        fontFace: 'Calibri',
        fontSize: 40,
        bold: true,
        align: 'center',
        color: theme.accentColor,
      });

      slide.addText(slideItem.highlightStat.label, {
        x: 9.6,
        y: 3.9,
        w: 2.8,
        h: 0.8,
        fontFace: 'Calibri',
        fontSize: 12,
        bold: true,
        align: 'center',
        color: theme.textColor,
      });
    }

    // Callout Box at bottom
    if (slideItem.calloutBox) {
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.8,
        y: 6.1,
        w: 11.7,
        h: 0.7,
        rectRadius: 0.08,
        fill: { color: theme.bgColor },
        line: { color: theme.accentColor, width: 1 },
      });

      slide.addText(slideItem.calloutBox, {
        x: 1.0,
        y: 6.15,
        w: 11.3,
        h: 0.6,
        fontFace: 'Calibri',
        fontSize: 11,
        color: theme.textColor,
        align: 'center',
      });
    }

    // Footer with Slide Number and direct recruiter email note
    slide.addText(
      `Trang ${index + 1}/${slides.length} · Ứng tuyển & Tiếp cận trực tiếp Nhà tuyển dụng qua Email · Hotline: ${profile.phone}`,
      {
        x: 0.8,
        y: 7.0,
        w: 11.7,
        h: 0.3,
        fontFace: 'Calibri',
        fontSize: 9,
        color: theme.mutedColor,
        align: 'right',
      }
    );
  });

  const safeFileName = (profile.fullName || 'Candidate').replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1EA0-\u1EF9]/g, '_');
  await pres.writeFile({ fileName: `${safeFileName}_CV_Self_Presentation_2026.pptx` });
}

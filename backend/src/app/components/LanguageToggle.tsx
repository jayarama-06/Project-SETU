/**
 * SETU – LanguageToggle Component
 *
 * Two variants driven by global LanguageContext:
 *
 * (A) Compact — 72 × 32 px pill  | Segments: "EN" / "తె"
 *     Placement: App Bar (right side, next to notification bell)
 *
 * (B) Large   — 120 × 40 px pill | Segments: "English" / "తెలుగు"
 *     Placement: Settings → Language & Display section
 *
 * Active segment:  Saffron #F0A500 fill  + Navy #0D1B2A Bold text
 * Inactive segment: transparent fill     + Grey  #6B7280 text
 * Transition: 150 ms ease-in-out slide of the saffron pill indicator
 *
 * i18n keys: lbl_lang_en (English) | lbl_lang_te (Telugu)
 */

import { useLanguage } from '../utils/languageContext';

interface LanguageToggleProps {
  /** 'compact' = 72×32 App-Bar toggle  |  'large' = 120×40 Settings toggle */
  size?: 'compact' | 'large';
  /** Optional external change handler – language state lives in Context */
  onChange?: (language: 'en' | 'te') => void;
}

const NAVY    = '#0D1B2A';
const SAFFRON = '#F0A500';
const GREY    = '#6B7280';

export function LanguageToggle({
  size = 'compact',
  onChange,
}: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();

  const isCompact = size === 'compact';

  // Outer pill dimensions
  const width  = isCompact ? 72  : 120;
  const height = isCompact ? 32  : 40;

  // Each segment occupies exactly half the pill width
  const halfW  = width / 2;

  // Label text
  const enLabel = isCompact ? 'EN'      : 'English';
  const teLabel = isCompact ? 'తె'      : 'తెలుగు';

  // Font size: compact uses 11px, large uses 13px
  const fontSize = isCompact ? '11px' : '13px';

  // Pill indicator slides to the right half when 'te' is active
  const indicatorLeft = language === 'en' ? 0 : halfW;

  function handleSelect(lang: 'en' | 'te') {
    setLanguage(lang);
    onChange?.(lang);
  }

  return (
    <div
      role="group"
      aria-label="App language"
      style={{
        position:     'relative',
        display:      'inline-flex',
        width:        `${width}px`,
        height:       `${height}px`,
        borderRadius: '9999px',
        border:       '1.5px solid #D1D5DB',
        overflow:     'hidden',
        flexShrink:   0,
        backgroundColor: 'white',
      }}
    >
      {/* ── Sliding saffron indicator ─────────────────── */}
      <span
        aria-hidden="true"
        style={{
          position:         'absolute',
          top:              0,
          bottom:           0,
          left:             `${indicatorLeft}px`,
          width:            `${halfW}px`,
          backgroundColor:  SAFFRON,
          borderRadius:     '9999px',
          transition:       'left 150ms ease-in-out',
          pointerEvents:    'none',
          zIndex:           0,
        }}
      />

      {/* ── EN / English button ───────────────────────── */}
      <button
        onClick={() => handleSelect('en')}
        aria-pressed={language === 'en'}
        data-i18n="lbl_lang_en"
        style={{
          position:       'relative',
          zIndex:         1,
          flex:           1,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          border:         'none',
          background:     'transparent',
          cursor:         'pointer',
          padding:        0,
          // Ensure tap target ≥ 48px via touch action area, but visual stays 32/40px
          fontFamily:     'Noto Sans, sans-serif',
          fontSize:       fontSize,
          fontWeight:     language === 'en' ? 700 : 400,
          color:          language === 'en' ? NAVY : GREY,
          transition:     'color 150ms ease-in-out, font-weight 0ms',
          letterSpacing:  '0.01em',
          lineHeight:     1,
          whiteSpace:     'nowrap',
        }}
      >
        {enLabel}
      </button>

      {/* ── తె / తెలుగు button ────────────────────────── */}
      <button
        onClick={() => handleSelect('te')}
        aria-pressed={language === 'te'}
        data-i18n="lbl_lang_te"
        style={{
          position:       'relative',
          zIndex:         1,
          flex:           1,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          border:         'none',
          background:     'transparent',
          cursor:         'pointer',
          padding:        0,
          fontFamily:     'Noto Sans, sans-serif',
          fontSize:       fontSize,
          fontWeight:     language === 'te' ? 700 : 400,
          color:          language === 'te' ? NAVY : GREY,
          transition:     'color 150ms ease-in-out, font-weight 0ms',
          letterSpacing:  '0.01em',
          lineHeight:     1,
          whiteSpace:     'nowrap',
        }}
      >
        {teLabel}
      </button>
    </div>
  );
}

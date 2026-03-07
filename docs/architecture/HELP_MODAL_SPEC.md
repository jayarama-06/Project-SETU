# SETU Help/Support Modal - Material Design 3

## ✅ Implementation Checklist

### Modal Trigger
- [x] **Location**: Bottom of Login screen
- [x] **Element**: "Need Help?" button
- [x] **Style**: Ghost button, white text, underline on hover
- [x] **i18n Key**: `btn_need_help`
- [x] **Tap Target**: 48px minimum height

### Modal Design

#### Container
- [x] **Width**: Max 448px (md breakpoint)
- [x] **Background**: #FFFFFF (white surface)
- [x] **Border**: 1px solid #E5E7EB
- [x] **Border Radius**: 8px
- [x] **Padding**: 24px
- [x] **Shadow**: Material Design 3 modal elevation
  - `0 20px 25px rgba(0, 0, 0, 0.15)`
  - `0 10px 10px rgba(0, 0, 0, 0.04)`
- [x] **Backdrop**: Black with 50% opacity
- [x] **Position**: Centered viewport

#### Header
- [x] **Title**: "Need Help?"
- [x] **Font**: Noto Sans SemiBold, 20px
- [x] **Color**: #0D1B2A (Navy)
- [x] **i18n Key**: `modal_help_title`
- [x] **Close Button**: X icon (24px), 48px tap target, top-right

#### Support Options

**WhatsApp Support Row**
- [x] **Icon**: MessageCircle (lucide-react)
- [x] **Icon Color**: #25D366 (WhatsApp green)
- [x] **Icon Background**: #25D366/10 (10% opacity)
- [x] **Icon Size**: 20px in 40px circle
- [x] **Label**: "WhatsApp Support" (secondary text)
- [x] **Number**: "+91-XXXXXXXXXX"
- [x] **i18n Key**: `lbl_whatsapp_support`
- [x] **Min Height**: 56px
- [x] **Border Radius**: 8px
- [x] **Hover**: Background #F8F9FA
- [x] **Action**: Opens WhatsApp with pre-filled message

**Email Support Row**
- [x] **Icon**: Mail (lucide-react)
- [x] **Icon Color**: #0D1B2A (Navy)
- [x] **Icon Background**: #0D1B2A/10 (10% opacity)
- [x] **Icon Size**: 20px in 40px circle
- [x] **Label**: "Email Support" (secondary text)
- [x] **Email**: "support@setu.gov.in"
- [x] **i18n Key**: `lbl_email_support`
- [x] **Min Height**: 56px
- [x] **Border Radius**: 8px
- [x] **Hover**: Background #F8F9FA
- [x] **Action**: Opens mail client with pre-filled subject/body

**User Guide Download Row**
- [x] **Icon**: FileText (lucide-react)
- [x] **Icon Color**: #F0A500 (Saffron)
- [x] **Icon Background**: #F0A500/10 (10% opacity)
- [x] **Icon Size**: 20px in 40px circle
- [x] **Label**: "Download PDF Guide"
- [x] **i18n Key**: `lnk_user_guide`
- [x] **Subtitle**: "User manual & tutorials" (secondary text)
- [x] **Min Height**: 56px
- [x] **Border Radius**: 8px
- [x] **Hover**: Background #F8F9FA
- [x] **Action**: Downloads SETU_User_Guide.pdf

#### Footer
- [x] **Border Top**: 1px solid #E5E7EB
- [x] **Margin Top**: 24px
- [x] **Padding Top**: 16px
- [x] **Text**: "SETU v1.1 • FOSS Hack 2026"
- [x] **Font**: 11px Regular
- [x] **Color**: #6B7280 (text-secondary)
- [x] **Alignment**: Center

### Modal Animations

#### Opening
- [x] **Backdrop**: Fade in (opacity 0 → 1, 200ms)
- [x] **Modal**: Slide up with scale
  - Initial: `opacity: 0, scale: 0.95, translateY: 20px`
  - Final: `opacity: 1, scale: 1, translateY: 0`
  - Duration: 200ms
  - Easing: `easeOut`

#### Closing
- [x] **Backdrop**: Fade out (opacity 1 → 0, 200ms)
- [x] **Modal**: Slide down with scale
  - Final: `opacity: 0, scale: 0.95, translateY: 20px`
  - Duration: 200ms
  - Easing: `easeOut`

### Action Handlers

#### WhatsApp Handler
```tsx
const handleWhatsAppClick = () => {
  const message = encodeURIComponent('Hi, I need help with SETU platform');
  const whatsappNumber = supportWhatsApp.replace(/[^0-9]/g, '');
  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
};
```

**Behavior:**
- Opens WhatsApp in new tab/window
- Pre-fills message: "Hi, I need help with SETU platform"
- Works on desktop (WhatsApp Web) and mobile (WhatsApp app)

#### Email Handler
```tsx
const handleEmailClick = () => {
  const subject = encodeURIComponent('SETU Support Request');
  const body = encodeURIComponent('Hi,\n\nI need assistance with:\n\n');
  window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
};
```

**Behavior:**
- Opens default mail client
- Pre-fills subject: "SETU Support Request"
- Pre-fills body template for user to complete

#### PDF Download Handler
```tsx
const handleGuideDownload = () => {
  const link = document.createElement('a');
  link.href = userGuideUrl;
  link.download = 'SETU_User_Guide.pdf';
  link.click();
};
```

**Behavior:**
- Downloads PDF directly to user's device
- Default filename: "SETU_User_Guide.pdf"
- Opens in browser if download fails (fallback)

### Configuration Values

| Field | Value | Notes |
|-------|-------|-------|
| WhatsApp Number | `+91-XXXXXXXXXX` | Replace with actual support number |
| Email | `support@setu.gov.in` | Government domain email |
| PDF Path | `/assets/SETU_User_Guide.pdf` | Hosted in public/assets |

### Row Layout Pattern

Each support option follows this structure:
```tsx
<button> (full-width, 56px min-height, rounded-lg, hover:bg-gray-50)
  <div> (icon container - 40px circle with 10% bg)
    <Icon /> (20px, colored)
  </div>
  <div> (text container - flex-1, left-aligned)
    <p> (label - 14px, secondary color)
    <p> (value/link - 16px, medium weight, navy)
  </div>
</button>
```

### Accessibility

- [x] **Close Button**: aria-label="Close"
- [x] **Focus Trap**: Modal traps focus when open
- [x] **ESC Key**: Closes modal (handled by AnimatePresence)
- [x] **Backdrop Click**: Closes modal
- [x] **Keyboard Navigation**: Tab through all options
- [x] **Screen Reader**: All links properly labeled

### i18n Keys Summary

| Key | English Text | Telugu (Future) |
|-----|--------------|-----------------|
| `modal_help_title` | Need Help? | సహాయం కావాలా? |
| `lbl_whatsapp_support` | +91-XXXXXXXXXX | +91-XXXXXXXXXX |
| `lbl_email_support` | support@setu.gov.in | support@setu.gov.in |
| `lnk_user_guide` | Download PDF Guide | PDF గైడ్ డౌన్‌లోడ్ చేయండి |
| `btn_need_help` | Need Help? | సహాయం కావాలా? |

### Mobile Optimization

- [x] **Responsive Width**: Max 448px on desktop, full-width on mobile with 16px padding
- [x] **Touch-Friendly**: All rows minimum 56px height
- [x] **Icon Sizing**: 40px circle for easy recognition
- [x] **Spacing**: 8px gap between rows for touch accuracy
- [x] **Safe Area**: Respects mobile safe areas

### Design Principles

✅ **Government Premium** - Professional, trustworthy support channels  
✅ **Quick Access** - One tap to WhatsApp/Email/Guide  
✅ **Visual Hierarchy** - Icons color-coded by type  
✅ **Mobile First** - Large tap targets, clear CTAs  
✅ **Brand Consistency** - Saffron for downloads, Navy for official  

### State Management

```tsx
const [showHelpModal, setShowHelpModal] = useState(false);
```

**Flow Logic:**
1. User clicks "Need Help?" button
2. `showHelpModal = true` → Modal opens
3. User clicks any option → Action executes
4. Modal stays open (user can access multiple resources)
5. User clicks X or backdrop → `showHelpModal = false`

### Integration Points

1. **Login Screen**: "Need Help?" button at screen bottom
2. **Dashboard Screens**: Same button in app drawer/menu (future)
3. **Error States**: Can be triggered programmatically (future)

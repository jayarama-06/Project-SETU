# SETU - Material Design 3 Implementation

## ✅ Implemented Design Specifications

### Color Tokens (Exact Match)
- **Primary Navy**: `#0D1B2A` - App bar, sidebar, primary buttons, headings
- **Navy Light**: `#162336` - Hover states, active navigation
- **Saffron Gold**: `#F0A500` - FAB, CTAs, active indicators
- **Saffron Light**: `#FDE9B0` - Badge backgrounds, highlights
- **Background**: `#F8F9FA` - Page background (NOT white)
- **Surface**: `#FFFFFF` - Cards, modals, inputs
- **Text Primary**: `#0D1B2A` - Headings, body copy
- **Text Secondary**: `#6B7280` - Captions, timestamps
- **Border**: `#E5E7EB` - Card borders, dividers

### Status Colors
- **Success**: `#22C55E` / `#DCFCE7` - Resolved status
- **Warning**: `#F59E0B` / `#FEF3C7` - Pending/In-Progress
- **Danger**: `#EF4444` / `#FEE2E2` - Critical urgency, errors
- **Info/Indigo**: `#4F46E5` / `#EEF2FF` - L1 escalation
- **Orange**: `#F97316` - L3 escalation

### Escalation Level Colors
- **L0**: `#9CA3AF` (Gray)
- **L1**: `#4F46E5` (Indigo)
- **L2**: `#F59E0B` (Warning)
- **L3**: `#F97316` (Orange)
- **L4**: `#EF4444` (Danger)

### Material Design 3 Specifications

#### Elevation/Shadows
- **Card Shadow**: `0 1px 3px rgba(0, 0, 0, 0.08)` ✅
- **Dropdown Shadow**: `0 4px 6px rgba(0, 0, 0, 0.10), 0 2px 4px rgba(0, 0, 0, 0.06)` ✅
- **Modal Shadow**: `0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.04)` ✅

#### Border Radius
- **Standard**: `8px` ✅
- **Full/Pills**: `9999px` ✅

#### Component Dimensions
- **Input Height**: `48px` ✅
- **Button Height**: `48px` ✅
- **Bottom Nav Height**: `56px` ✅
- **Minimum Tap Target**: `48px × 48px` ✅

#### Cards
- **Padding**: `16px` ✅
- **Border**: `1px solid #E5E7EB` ✅
- **Border Radius**: `8px` ✅
- **Shadow**: `0 1px 3px rgba(0, 0, 0, 0.08)` ✅

#### Typography
- **Font Family**: Noto Sans (with Telugu support) ✅
- **Page Title**: 24px, Bold 700 ✅
- **Section Head**: 18px, SemiBold 600 ✅
- **Card Title**: 16px, SemiBold 600 ✅
- **Body**: 14px, Regular 400 ✅
- **Label/Tag**: 12px, Medium 500 ✅
- **Caption**: 11px, Regular 400 ✅

### Component Compliance

#### ✅ IssueCard
- 16px padding
- 1px #E5E7EB border
- 8px border radius
- 0 1px 3px rgba(0,0,0,0.08) shadow
- 4px left border for urgency indicator
- White (#FFFFFF) surface
- Proper text colors (#0D1B2A, #6B7280)

#### ✅ StatusBadge
- Correct colors for all 8 states
- Uppercase tracking-wide text
- 12px font size, medium weight

#### ✅ EscalationBadge
- Correct L0-L4 colors
- Dot indicator (1.5px rounded)
- 15% opacity background tint
- Pulse animation on L2+

#### ✅ UrgencyBadge
- 4 levels: Low/Medium/High/Critical
- Score display (0-140 scale)
- Pulse animation on Critical (100+)

#### ✅ LanguageToggle
- 72px wide × 32px tall (compact)
- Pill-shaped (9999px radius)
- Saffron active state
- EN / తె labels
- Smooth 150ms transitions

#### ✅ Bottom Navigation (Mobile)
- 56px height (exact)
- 48px min tap targets
- Saffron active color
- Layout indicator animation
- 4 tabs max

#### ✅ Login Screen
- Navy background
- White card with proper shadow
- 8px border radius on inputs
- 48px input height
- Language toggle bottom-right
- Dual tabs (Login/Setup)

#### ✅ School Staff Dashboard
- Navy app bar (14px height)
- #F8F9FA background
- Summary stat cards with proper styling
- Filter chips (48px min height)
- Saffron FAB (14px diameter)
- 56px bottom nav
- Staggered card animations

#### ✅ Official Dashboard
- 260px Navy sidebar
- White surface main area
- 4 KPI cards with proper shadows
- Priority escalations table
- Hover states on rows
- Active nav indicators

### Design Principles Applied

✅ **Minimalist & Premium** - Clean layouts, generous whitespace
✅ **Mobile-First** - 360px viewport design
✅ **48px Tap Targets** - All interactive elements
✅ **8px Base Unit** - Consistent spacing system
✅ **Material Motion** - Smooth transitions (150ms standard)
✅ **High Contrast** - WCAG AA compliant
✅ **Zero Training** - Intuitive UI patterns
✅ **Status Always Visible** - Clear visual hierarchy
✅ **Urgency is Visual** - Color-coded indicators

## English-Only UI Labels

All UI labels are in English as specified:
- Home, My Issues, Notifications, Profile
- Log In, First Time Setup
- Dashboard, Grievance Monitor, Analytics Reports
- Submitted, Acknowledged, Resolved, etc.

Telugu is handled via global i18n toggle (not yet implemented - requires translation layer).

# SETU Forgot Password Modal - Material Design 3

## ✅ Implementation Checklist

### Modal Trigger
- [x] **Location**: Below password field in Login tab
- [x] **Element**: Text link "Forgot Password?"
- [x] **Style**: Saffron #F0A500, 12px Regular, underline on hover
- [x] **i18n Key**: `lnk_forgot_password`
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
- [x] **Title**: "Forgot Password?"
- [x] **Font**: Noto Sans SemiBold, 20px
- [x] **Color**: #0D1B2A (Navy)
- [x] **i18n Key**: `modal_forgot_pw_title`
- [x] **Close Button**: X icon (24px), 48px tap target, top-right

#### Content

**School ID Input Field**
- [x] **Label**: "School ID"
- [x] **i18n Key**: `lbl_school_id`
- [x] **Height**: 48px
- [x] **Border**: 1px #E5E7EB
- [x] **Border Radius**: 8px
- [x] **Placeholder**: "Enter your School ID"
- [x] **Focus Ring**: Saffron #F0A500

**Helper Text**
- [x] **Text**: "An OTP will be sent to the registered contact number."
- [x] **Font**: Noto Sans Regular, 14px
- [x] **Color**: #6B7280 (text-secondary)
- [x] **i18n Key**: `lbl_otp_info`
- [x] **Position**: Below input field

#### Actions

**Send OTP Button**
- [x] **Label**: "Send OTP"
- [x] **i18n Key**: `btn_send_otp`
- [x] **Width**: Full-width
- [x] **Height**: 48px
- [x] **Background**: #0D1B2A (Navy)
- [x] **Text Color**: #FFFFFF (white)
- [x] **Font**: Noto Sans SemiBold, 16px
- [x] **Border Radius**: 8px
- [x] **Hover**: Background changes to #162336
- [x] **Disabled State**: Grayed out when School ID is empty

**Cancel Link**
- [x] **Label**: "Cancel"
- [x] **i18n Key**: `btn_cancel`
- [x] **Style**: Text link, #6B7280, underline on hover
- [x] **Font**: 14px Regular
- [x] **Position**: Below Send OTP button
- [x] **Tap Target**: 48px minimum height

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

### Modal Actions

#### Send OTP Flow
1. User clicks "Forgot Password?" link
2. Modal opens with animation
3. User enters School ID
4. User clicks "Send OTP" button (or presses Enter)
5. Modal closes
6. OTP input field appears inline below password field in Login form
7. Success message displays: "OTP sent to your registered contact number"

#### Cancel Flow
1. User clicks "Cancel" link or X button
2. Modal fades out
3. Form state unchanged
4. No OTP field appears

### OTP Field Integration

**Appears After Send OTP**
- [x] **Label**: "Enter OTP"
- [x] **i18n Key**: `lbl_otp`
- [x] **Input Type**: Text (6-digit numeric)
- [x] **Max Length**: 6 characters
- [x] **Height**: 48px
- [x] **Border Radius**: 8px
- [x] **Placeholder**: "Enter 6-digit OTP"
- [x] **Location**: Between password field and "Forgot Password?" link
- [x] **Helper Text**: "OTP sent to your registered contact number"
- [x] **Helper i18n Key**: `lbl_otp_sent`

### Accessibility

- [x] **Close Button**: aria-label="Close"
- [x] **Focus Trap**: Modal traps focus when open
- [x] **ESC Key**: Closes modal (handled by AnimatePresence)
- [x] **Backdrop Click**: Closes modal
- [x] **Enter Key**: Submits form when in School ID input
- [x] **Keyboard Navigation**: Tab through inputs and buttons

### i18n Keys Summary

| Key | English Text | Telugu (Future) |
|-----|--------------|-----------------|
| `modal_forgot_pw_title` | Forgot Password? | పాస్‌వర్డ్ మర్చిపోయారా? |
| `lbl_school_id` | School ID | పాఠశాల ID |
| `lbl_otp_info` | An OTP will be sent to the registered contact number. | నమోదిత సంప్రదింపు నంబర్‌కు OTP పంపబడుతుంది. |
| `btn_send_otp` | Send OTP | OTP పంపండి |
| `btn_cancel` | Cancel | రద్దు చేయండి |
| `lbl_otp` | Enter OTP | OTP నమోదు చేయండి |
| `lbl_otp_sent` | OTP sent to your registered contact number | మీ నమోదిత సంప్రదింపు నంబర్‌కు OTP పంపబడింది |

### Mobile Optimization

- [x] **Responsive Width**: Max 448px on desktop, full-width on mobile with 16px padding
- [x] **Touch-Friendly**: All interactive elements minimum 48px
- [x] **Scrollable**: Content scrolls if viewport too small
- [x] **Safe Area**: Respects mobile safe areas

### State Management

```tsx
const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
const [showOTPField, setShowOTPField] = useState(false);
const [otp, setOtp] = useState('');
```

**Flow Logic:**
1. `showForgotPasswordModal = true` → Modal opens
2. User submits → `showForgotPasswordModal = false`, `showOTPField = true`
3. OTP field renders in Login form
4. User can verify OTP (future implementation with Supabase)

### Integration with Supabase (Future)

When backend is connected:
1. **Send OTP**: Call Supabase Edge Function to send SMS/WhatsApp OTP
2. **Verify OTP**: Validate OTP against Supabase auth
3. **Reset Password**: Show password reset fields after successful OTP verification
4. **Update Password**: Update user password in Supabase auth

---

**Status**: Forgot Password modal fully implemented ✅  
**Next**: OTP verification flow, password reset, Supabase integration

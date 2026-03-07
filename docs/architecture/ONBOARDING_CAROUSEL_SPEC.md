# SETU Onboarding Carousel - Material Design 3

## ✅ Implementation Checklist

### Screen Design

#### Background & Layout
- [x] **Full-screen**: Navy #0D1B2A background
- [x] **Viewport**: Mobile-first 360px optimized
- [x] **Structure**: Fixed inset-0 with flex column layout

#### Top Bar
- [x] **Position**: Top-right corner with padding
- [x] **Language Toggle**: 72px × 32px compact pill
- [x] **Skip Button**: 
  - Text: "Skip" white 14px
  - i18n key: `btn_skip`
  - Min tap target: 48px height
  - Action: Jumps directly to Login screen

#### Center Content

**Illustration Area**
- [x] **Dimensions**: 200px × 200px
- [x] **Format**: SVG placeholder graphics
- [x] **Margin Bottom**: 32px (2rem)
- [x] **Illustrations**:
  - Slide 1: School building with abstract community elements
  - Slide 2: Escalation flow with connected nodes
  - Slide 3: Tracking checklist with completed items

**Heading**
- [x] **Font**: Noto Sans Bold
- [x] **Size**: 28px
- [x] **Color**: #FFFFFF (White)
- [x] **Alignment**: Center
- [x] **Margin Bottom**: 16px

**Body Text**
- [x] **Font**: Noto Sans Regular
- [x] **Size**: 16px
- [x] **Color**: #E5E7EB (Light gray)
- [x] **Alignment**: Center
- [x] **H-Padding**: 24px
- [x] **Line Height**: Relaxed (1.625)

#### Bottom Section

**Dot Pagination**
- [x] **Position**: Above CTA button, centered
- [x] **Spacing**: 8px gap between dots
- [x] **Margin Bottom**: 24px
- [x] **Active Dot**: 
  - Width: 24px
  - Height: 8px
  - Border radius: 4px (pill shape)
  - Color: #F0A500 (Saffron)
- [x] **Inactive Dots**: 
  - Width: 8px
  - Height: 8px
  - Border radius: 50% (circle)
  - Color: #6B7280 (Gray)
- [x] **Transition**: 300ms smooth animation
- [x] **Clickable**: Tapping dot navigates to that slide

**CTA Button**
- [x] **Width**: Full-width
- [x] **Height**: 56px
- [x] **Background**: #F0A500 (Saffron)
- [x] **Text Color**: #0D1B2A (Navy)
- [x] **Font**: Noto Sans Bold, 16px
- [x] **Border Radius**: 8px
- [x] **Position**: Pinned 16px from bottom
- [x] **Hover State**: Slightly lighter Saffron (#FDB913)
- [x] **Labels**:
  - Slides 1-2: "Next" (i18n: `btn_next`)
  - Slide 3: "Get Started" (i18n: `btn_get_started`)

### Carousel Content

#### Slide 1: Welcome
```
Heading: "Welcome to SETU"
i18n: onboard_h1

Body: "Report school issues in 2 minutes. Track every report to resolution."
i18n: onboard_body1

Illustration: School building graphic
CTA: "Next"
Dot State: [ACTIVE, inactive, inactive]
```

#### Slide 2: Smart Escalation
```
Heading: "Your Report Reaches the Right Person"
i18n: onboard_h2

Body: "Smart auto-escalation ensures your grievance reaches district and state officials if unresolved."
i18n: onboard_body2

Illustration: Escalation flow graphic
CTA: "Next"
Dot State: [inactive, ACTIVE, inactive]
```

#### Slide 3: Tracking
```
Heading: "Nothing Gets Lost"
i18n: onboard_h3

Body: "Every report is tracked from submission to resolution. Full transparency, always."
i18n: onboard_body3

Illustration: Tracking checklist graphic
CTA: "Get Started"
Dot State: [inactive, inactive, ACTIVE]
```

### Animations & Interactions

#### Slide Transitions

**Spring Animation**
- [x] **Type**: Spring physics
- [x] **Stiffness**: 300
- [x] **Damping**: 30
- [x] **Opacity Fade**: 200ms
- [x] **Direction**: 
  - Forward: New slide enters from right (x: 1000)
  - Backward: New slide enters from left (x: -1000)

**Swipe Gesture**
- [x] **Drag Axis**: Horizontal (x-axis only)
- [x] **Constraints**: left: 0, right: 0
- [x] **Elastic**: 1 (drag beyond bounds with resistance)
- [x] **Threshold**: 10,000 swipe power units
- [x] **Formula**: `Math.abs(offset) * velocity`
- [x] **Behavior**:
  - Swipe left → Next slide (if not last)
  - Swipe right → Previous slide (if not first)
  - Weak swipe → Snap back to current

**Enter Animation**
```tsx
enter: (direction: number) => ({
  x: direction > 0 ? 1000 : -1000,
  opacity: 0,
})
```

**Center Animation**
```tsx
center: {
  zIndex: 1,
  x: 0,
  opacity: 1,
}
```

**Exit Animation**
```tsx
exit: (direction: number) => ({
  zIndex: 0,
  x: direction < 0 ? 1000 : -1000,
  opacity: 0,
})
```

#### Button Actions

**Next Button (Slides 1-2)**
- [x] Increments `currentSlide` state
- [x] Sets direction to `1` (forward)
- [x] Triggers slide transition animation

**Get Started Button (Slide 3)**
- [x] Calls `onComplete()` callback
- [x] App navigates to Login screen
- [x] Future: Shared element transition (button expands full-screen)

**Skip Button**
- [x] Calls `onSkip()` callback
- [x] Immediately navigates to Login screen
- [x] Bypasses remaining slides

**Dot Navigation**
- [x] Clicking any dot navigates to that slide
- [x] Sets direction based on target vs current
- [x] Smooth transition animation

### State Management

```tsx
const [currentSlide, setCurrentSlide] = useState(0); // 0-2
const [direction, setDirection] = useState(0);       // -1, 0, 1
```

**Flow Logic:**
1. User sees Slide 1 by default
2. User swipes left OR taps "Next" → Slide 2
3. User swipes left OR taps "Next" → Slide 3
4. User taps "Get Started" → Navigate to Login
5. OR User taps "Skip" at any time → Navigate to Login

### App Flow Integration

```
Splash (2.25s) → Fade to White (0.4s) → Onboarding → Login → Dashboard
                                           ↑
                                        Skip bypasses
```

**State Transitions:**
- `splash` → `onboarding` (auto after 2.65s)
- `onboarding` → `login` (Skip or Get Started)
- `login` → `authenticated` (after login)

### i18n Keys Summary

| Key | English Text | Telugu (Future) |
|-----|--------------|-----------------|
| `btn_skip` | Skip | దాటవేయండి |
| `onboard_h1` | Welcome to SETU | SETU కు స్వాగతం |
| `onboard_body1` | Report school issues in 2 minutes. Track every report to resolution. | 2 నిమిషాల్లో పాఠశాల సమస్యలను నివేదించండి. ప్రతి నివేదికను పరిష్కారం వరకు ట్రాక్ చేయండి. |
| `onboard_h2` | Your Report Reaches the Right Person | మీ నివేదిక సరైన వ్యక్తికి చేరుకుంటుంది |
| `onboard_body2` | Smart auto-escalation ensures your grievance reaches district and state officials if unresolved. | పరిష్కరించకపోతే మీ ఫిర్యాదు జిల్లా మరియు రాష్ట్ర అధికారులకు చేరుకునేలా స్మార్ట్ ఆటో-ఎస్కలేషన్ నిర్ధారిస్తుంది. |
| `onboard_h3` | Nothing Gets Lost | ఏదీ పోదు |
| `onboard_body3` | Every report is tracked from submission to resolution. Full transparency, always. | ప్రతి నివేదిక సబ్మిషన్ నుండి పరిష్కారం వరకు ట్రాక్ చేయబడుతుంది. పూర్తి పారదర్శకత, ఎల్లప్పుడూ. |
| `btn_next` | Next | తదుపరి |
| `btn_get_started` | Get Started | ప్రారంభించండి |

### SVG Illustrations

#### Illustration 1: School Building
- **Elements**: Building with roof, door, windows
- **Colors**: Saffron (#F0A500) primary, Navy accents
- **Background**: Subtle circle with 10% opacity
- **Style**: Minimalist, geometric, iconic

#### Illustration 2: Escalation Flow
- **Elements**: Connected circles representing hierarchy
- **Colors**: Saffron gradient (60%, 80%, 100% opacity)
- **Background**: Subtle circle with 10% opacity
- **Style**: Network diagram, upward flow

#### Illustration 3: Tracking Checklist
- **Elements**: Document/list with checkmarks
- **Colors**: Saffron (#F0A500) for list, Navy for checks
- **Background**: Subtle circle with 10% opacity
- **Style**: Simple checklist with completion indicator

### Accessibility

- [x] **Touch Gestures**: Swipe left/right for navigation
- [x] **Visual Feedback**: Dot pagination shows current position
- [x] **Skip Option**: Users can bypass onboarding
- [x] **Tap Targets**: All interactive elements minimum 48px
- [x] **Contrast**: White text on Navy meets WCAG AA
- [x] **Screen Reader**: All headings and buttons properly labeled

### Mobile Optimization

- [x] **Viewport**: Optimized for 360px mobile screens
- [x] **Padding**: Horizontal 24px for body text readability
- [x] **Touch Areas**: 56px CTA button, 48px Skip button
- [x] **Swipe Threshold**: Calibrated for one-handed use
- [x] **Safe Area**: Content respects mobile safe areas

### Design Principles

✅ **First Impressions** - Clean, premium, trustworthy government interface  
✅ **Value Proposition** - Clear benefits in 3 focused slides  
✅ **Quick Exit** - Skip button respects user agency  
✅ **Smooth Flow** - Spring physics create natural transitions  
✅ **Touch-First** - Swipe gestures feel native and responsive  

### Future Enhancements

- [ ] **Shared Element Transition**: "Get Started" button expands to fill screen before revealing dashboard
- [ ] **Progress Bar**: Optional linear progress indicator
- [ ] **Auto-Advance**: Timer-based auto-play (disabled by default)
- [ ] **Lottie Animations**: Replace static SVGs with animated illustrations
- [ ] **Haptic Feedback**: Vibration on slide change (mobile PWA)
- [ ] **A/B Testing**: Track skip rate vs completion rate
- [ ] **Skip Preference**: Remember if user has seen onboarding before

### Local Storage Integration (Future)

```tsx
// Check if user has completed onboarding
const hasSeenOnboarding = localStorage.getItem('setu_onboarding_complete');

if (!hasSeenOnboarding) {
  // Show onboarding
} else {
  // Skip directly to Login
}

// Mark onboarding as complete
localStorage.setItem('setu_onboarding_complete', 'true');
```

---

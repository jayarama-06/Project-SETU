import { createBrowserRouter, Navigate } from 'react-router';
import { AuthGuard } from './components/AuthGuard';
import { Splash } from './screens/Splash';
import { Onboarding } from './screens/Onboarding';
import { Login } from './screens/Login';
import { RCOLogin } from './screens/RCOLogin';
import { SchoolStaffDashboard } from './screens/SchoolStaffDashboard';
import { PrincipalDashboard } from './screens/PrincipalDashboard';
import { SchoolWideIssues } from './screens/SchoolWideIssues';
import { MyIssues } from './screens/MyIssues';
import { PrincipalMyReports } from './screens/PrincipalMyReports';
import { ReportIssue } from './screens/ReportIssue';
import { IssueDetailStaff } from './screens/IssueDetailStaff';
import { IssueDetailPrincipal } from './screens/IssueDetailPrincipal';
import { StaffActivityOverview } from './screens/StaffActivityOverview';
import { SchoolHealthSummary } from './screens/SchoolHealthSummary';
import { Notifications } from './screens/Notifications';
import { PrincipalNotifications } from './screens/PrincipalNotifications';
import { SettingsStaff } from './screens/SettingsStaff';
import { RCODashboard } from './screens/RCODashboard';
import { RCOIssueQueue } from './screens/RCOIssueQueue';
import { RCOIssueDetail } from './screens/RCOIssueDetail';
import { RCOSchoolDirectory } from './screens/RCOSchoolDirectory';
import { RCOAnalytics } from './screens/RCOAnalytics';
import { RCONotifications } from './screens/RCONotifications';
import { RCOSettings } from './screens/RCOSettings';
import { ChipShowcase } from './components/ChipShowcase';
import { AdminSchools } from './screens/AdminSchools';
import { AdminAddSchool } from './screens/AdminAddSchool';
import { AdminCreatePrincipal } from './screens/AdminCreatePrincipal';
import { AdminLogin } from './screens/AdminLogin';
import { AdminDashboard } from './screens/AdminDashboard';

/**
 * SETU Route Map
 * ─────────────────────────────────────────
 * /                      → Splash (auto-redirects)
 * /onboarding            → Onboarding carousel
 * /login                 → Login (Staff/Principal)
 * /rco/login             → RCOLogin (Official Portal)
 * /admin/login           → AdminLogin (Official Portal)
 *
 * /staff/*               → AuthGuard (session required)
 *   /staff               → redirect → /staff/my-issues
 *   /staff/dashboard     → SchoolStaffDashboard
 *   /staff/my-issues     → MyIssues
 *   /staff/report        → ReportIssue (multi-step wizard)
 *   /staff/issues/:id    → IssueDetailStaff
 *   /staff/notifications → Notifications
 *   /staff/settings      → SettingsStaff
 *
 * /principal/*           → AuthGuard (session required)
 *   /principal           → redirect → /principal/dashboard
 *   /principal/dashboard → PrincipalDashboard
 *   /principal/all-issues → SchoolWideIssues
 *   /principal/staff-activity → StaffActivityOverview
 *   /principal/school-health → SchoolHealthSummary
 *   /principal/my-issues → PrincipalMyReports
 *   /principal/report    → ReportIssue
 *   /principal/issues/:id → IssueDetailPrincipal
 *   /principal/notifications → PrincipalNotifications
 *   /principal/settings  → SettingsStaff
 *
 * /rco/*                 → AuthGuard (session required)
 *   /rco                 → redirect → /rco/dashboard
 *   /rco/dashboard       → RCODashboard (RCO Desktop)
 *   /rco/issue-queue     → RCOIssueQueue (Issue Queue Full View)
 *   /rco/issues/:issueId → RCOIssueDetail (Issue Detail View)
 *   /rco/directory       → RCOSchoolDirectory (School Directory)
 *   /rco/analytics       → RCOAnalytics (Analytics Dashboard)
 *   /rco/notifications   → RCONotifications (Notifications Dashboard)
 *   /rco/settings        → RCOSettings (Settings Dashboard)
 *
 * /admin/*               → AuthGuard (session required)
 *   /admin               → redirect → /admin/dashboard
 *   /admin/dashboard     → AdminDashboard (Main Admin Home)
 *   /admin/schools       → AdminSchools (School Management)
 *
 * *                      → redirect → /
 */
export const router = createBrowserRouter([
  {
    path: '/',
    Component: Splash,
  },
  {
    path: '/onboarding',
    Component: Onboarding,
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/rco/login',
    Component: RCOLogin,
  },
  {
    path: '/admin/login',
    Component: AdminLogin,
  },

  // ── Staff flow (mobile PWA) ─────────────────
  {
    path: '/staff',
    Component: AuthGuard,
    children: [
      { index: true, element: <Navigate to="my-issues" replace /> },
      { path: 'dashboard',     Component: SchoolStaffDashboard },
      { path: 'my-issues',     Component: MyIssues },
      { path: 'report',        Component: ReportIssue },
      { path: 'issues/:issueId', Component: IssueDetailStaff },
      { path: 'notifications', Component: Notifications },
      { path: 'settings',      Component: SettingsStaff },
    ],
  },

  // ── Principal flow (mobile PWA) ──────────────
  {
    path: '/principal',
    Component: AuthGuard,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard',     Component: PrincipalDashboard },
      { path: 'all-issues',    Component: SchoolWideIssues },
      { path: 'staff-activity', Component: StaffActivityOverview },
      { path: 'school-health', Component: SchoolHealthSummary },
      { path: 'my-issues',     Component: PrincipalMyReports },
      { path: 'report',        Component: ReportIssue },
      { path: 'issues/:issueId', Component: IssueDetailPrincipal },
      { path: 'notifications', Component: PrincipalNotifications },
      { path: 'settings',      Component: SettingsStaff },
    ],
  },

  // ── RCO / Official flow (desktop) ─────────
  {
    path: '/rco',
    Component: AuthGuard,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', Component: RCODashboard },
      { path: 'issue-queue', Component: RCOIssueQueue },
      { path: 'issues/:issueId', Component: RCOIssueDetail },
      { path: 'directory', Component: RCOSchoolDirectory },
      { path: 'analytics', Component: RCOAnalytics },
      { path: 'notifications', Component: RCONotifications },
      { path: 'settings', Component: RCOSettings },
    ],
  },

  // ── Admin / Official flow (desktop) ─────────
  // NOTE: For production, wrap in AuthGuard. Currently public for testing.
  {
    path: '/admin',
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', Component: AdminDashboard },
      { path: 'schools', Component: AdminSchools },
    ],
  },

  // ── Admin public routes (no auth for now) ───
  {
    path: '/admin/schools/add',
    Component: AdminAddSchool,
  },
  {
    path: '/admin/schools/create-principal',
    Component: AdminCreatePrincipal,
  },

  // ── Catch-all ────────────────────────────────
  { path: '*', element: <Navigate to="/" replace /> },
  
  // ── Development/QA Routes ───────────────────
  {
    path: '/chip-showcase',
    Component: ChipShowcase,
  },
]);

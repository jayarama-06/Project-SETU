/**
 * SETU – Centralized i18n Translations
 * All UI text with English/Telugu translations
 * Keys follow AP-04 naming convention
 */

import type { AppLanguage } from './languageContext';

type TranslationKey = string;
type Translation = { en: string; te: string };

export const translations: Record<TranslationKey, Translation> = {
  // ═══════════════════════════════════════════════════════════
  // STATUS CHIPS (AP-03)
  // ═══════════════════════════════════════════════════════════
  status_submitted: { en: 'Submitted', te: 'సమర్పించబడింది' },
  status_acknowledged: { en: 'Acknowledged', te: 'ఆమోదించబడింది' },
  status_in_progress: { en: 'In Progress', te: 'పురోగతిలో ఉంది' },
  status_awaiting: { en: 'Awaiting Response', te: 'స్పందన కోసం వేచి ఉంది' },
  status_resolved_pending: { en: 'Resolved (Pending)', te: 'పరిష్కరించబడింది (పెండింగ్)' },
  status_dispute: { en: 'Dispute Filed', te: 'వివాదం దాఖలు చేయబడింది' },
  status_resolved: { en: 'Resolved', te: 'పరిష్కరించబడింది' },
  status_closed: { en: 'Closed', te: 'మూసివేయబడింది' },

  // LEGACY STATUS (for backward compatibility)
  status_open: { en: 'New', te: 'కొత్త' },

  // ═══════════════════════════════════════════════════════════
  // URGENCY CHIPS
  // ═══════════════════════════════════════════════════════════
  urgency_low: { en: 'Low', te: 'తక్కువ' },
  urgency_medium: { en: 'Medium', te: 'మధ్యస్థ' },
  urgency_high: { en: 'High', te: 'అధిక' },
  urgency_critical: { en: 'Critical', te: 'క్లిష్టమైన' },

  // ═══════════════════════════════════════════════════════════
  // ESCALATION LEVEL CHIPS
  // ═══════════════════════════════════════════════════════════
  escalation_l0: { en: 'L0 - Submitted', te: 'L0 - సమర్పించబడింది' },
  escalation_l1: { en: 'L1 - Acknowledged', te: 'L1 - ఆమోదించబడింది' },
  escalation_l2: { en: 'L2 - In Progress', te: 'L2 - పురోగతిలో' },
  escalation_l3: { en: 'L3 - Escalated', te: 'L3 - పెంచబడింది' },
  escalation_l4: { en: 'L4 - Critical', te: 'L4 - క్లిష్టమైన' },

  // ═══════════════════════════════════════════════════════════
  // NAVIGATION (nav_)
  // ═══════════════════════════════════════════════════════════
  nav_home: { en: 'Home', te: 'హోమ్' },
  nav_my_issues: { en: 'Issue Tracker', te: 'సమస్య ట్రాకర్' },
  nav_my_reports: { en: 'Report Status', te: 'నివేదిక స్థితి' },
  nav_notifications: { en: 'Notifications', te: 'నోటిఫికేషన్లు' },
  nav_profile: { en: 'Profile', te: 'ప్రొఫైల్' },
  nav_dashboard: { en: 'Dashboard', te: 'డాష్‌బోర్డ్' },
  nav_analytics: { en: 'Analytics', te: 'విశ్లేషణలు' },
  nav_schools: { en: 'Schools', te: 'పాఠశాలలు' },
  nav_issue_queue: { en: 'Issue Queue', te: 'సమస్య క్యూ' },
  nav_settings: { en: 'Settings', te: 'సెట్టింగ్‌లు' },

  // ═══════════════════════════════════════════════════════════
  // BUTTONS (btn_)
  // ═══════════════════════════════════════════════════════════
  btn_log_in: { en: 'Log In', te: 'లాగిన్ చేయండి' },
  btn_log_out: { en: 'Log Out', te: 'లాగ్అవుట్ చేయండి' },
  btn_submit_issue: { en: 'Submit Issue', te: 'సమస్యను సమర్పించండి' },
  btn_continue: { en: 'Continue', te: 'కొనసాగించు' },
  btn_cancel: { en: 'Cancel', te: 'రద్దు చేయండి' },
  btn_save: { en: 'Save', te: 'సేవ్ చేయండి' },
  btn_edit: { en: 'Edit', te: 'సవరించు' },
  btn_delete: { en: 'Delete', te: 'తొలగించు' },
  btn_confirm: { en: 'Confirm', te: 'నిర్ధారించండి' },
  btn_back: { en: 'Back', te: 'వెనుకకు' },
  btn_next: { en: 'Next', te: 'తదుపరి' },
  btn_filter: { en: 'Filter', te: 'ఫిల్టర్' },
  btn_sort: { en: 'Sort', te: 'క్రమీకరించు' },
  btn_apply: { en: 'Apply', te: 'వర్తింపజేయండి' },
  btn_reset: { en: 'Reset', te: 'రీసెట్ చేయండి' },

  // ═══════════════════════════════════════════════════════════
  // SCREEN TITLES (scr_)
  // ═══════════════════════════════════════════════════════════
  scr_my_issues: { en: 'Issue Tracker', te: 'సమస్య ట్రాకర్' },
  scr_my_reports: { en: 'Report Status', te: 'నివేదిక స్థితి' },
  scr_notifications: { en: 'Notifications', te: 'నోటిఫికేషన్లు' },
  scr_settings: { en: 'Settings', te: 'సెట్టింగ్‌లు' },
  scr_report_issue: { en: 'Report Issue', te: 'సమస్యను నివేదించండి' },
  scr_issue_details: { en: 'Issue Details', te: 'సమస్య వివరాలు' },

  // ═══════════════════════════════════════════════════════════
  // LABELS (lbl_)
  // ═══════════════════════════════════════════════════════════
  lbl_school_id: { en: 'School ID', te: 'పాఠాల ID' },
  lbl_issue_id: { en: 'Issue ID', te: 'సమస్య ID' },
  lbl_issue_title: { en: 'Issue Title', te: 'సమస్య శీర్షిక' },
  lbl_category: { en: 'Category', te: 'వర్గం' },
  lbl_description: { en: 'Description', te: 'వివరణ' },
  lbl_status: { en: 'Status', te: 'స్థితి' },
  lbl_urgency: { en: 'Urgency', te: 'అత్యవసరత' },
  lbl_time_ago: { en: 'Time Ago', te: 'సమయం క్రితం' },
  lbl_submitted: { en: 'Submitted!', te: 'సమర్పించబడింది!' },
  lbl_voice_note: { en: 'Voice Note', te: 'వాయిస్ నోట్' },
  lbl_photo: { en: 'Photo', te: 'ఫోటో' },

  // ═══════════════════════════════════════════════════════════
  // PLACEHOLDERS (placeholder_)
  // ═══════════════════════════════════════════════════════════
  placeholder_description: { en: 'Enter description...', te: 'వివరణను నమోదు చేయండి...' },
  placeholder_search: { en: 'Search issues...', te: 'సమస్యలను శోధించండి...' },

  // ═══════════════════════════════════════════════════════════
  // MODAL TITLES (modal_)
  // ═══════════════════════════════════════════════════════════
  modal_logout_title: { en: 'Confirm Logout', te: 'లాగౌట్ నిర్ధారించండి' },
  modal_logout_body: { en: 'Are you sure you want to log out?', te: 'మీరు నిజంగా లాగ్అవుట్ చేయాలనుకుంటున్నారా?' },

  // ═══════════════════════════════════════════════════════════
  // KPIs (kpi_)
  // ═══════════════════════════════════════════════════════════
  kpi_overdue: { en: 'Overdue', te: 'గడువు దాటింది' },
  kpi_pending: { en: 'Pending', te: 'పెండింగ్' },
  kpi_resolved: { en: 'Resolved', te: 'పరిష్కరించబడింది' },
  kpi_total_issues: { en: 'Total Issues', te: 'మొత్తం సమస్యలు' },

  // ══════════════════════════════════════════════════════════
  // NOTIFICATION TYPES (notif_)
  // ═══════════════════════════════════════════════════════════
  notif_escalation: { en: 'Escalation Notice', te: 'పెంపు నోటీసు' },
  notif_new_issue: { en: 'New Issue', te: 'కొత్త సమస్య' },
  notif_status_update: { en: 'Status Update', te: 'స్థితి నవీకరణ' },

  // ═══════════════════════════════════════════════════════════
  // FILTERS & CHIPS (filter_, chip_)
  // ═══════════════════════════════════════════════════════════
  filter_all: { en: 'All', te: 'అన్నీ' },
  filter_active: { en: 'Active', te: 'క్రియాశీల' },
  filter_resolved: { en: 'Resolved', te: 'పరిష్కరించబడింది' },
  filter_my_reports: { en: 'My Reports Only', te: 'నా నివేదికలు మాత్రమే' },
  chip_critical: { en: 'Critical', te: 'క్లిష్టమైన' },
  chip_high: { en: 'High', te: 'అధిక' },
  chip_medium: { en: 'Medium', te: 'మధ్యస్థ' },
  chip_low: { en: 'Low', te: 'తక్కువ' },
  chip_my_reports: { en: 'My Reports', te: 'నా నివేదికలు' },
  
  // EMPTY STATES
  empty_no_issues: { en: 'No Issues Found', te: 'సమస్యలు కనపడలేదు' },
  empty_no_notifications: { en: 'No Notifications', te: 'నోటిఫికేషన్లు లేవు' },
  btn_report_new: { en: 'Report New Issue', te: 'కొత్త సమస్యను నివేదించండి' },

  // ═══════════════════════════════════════════════════════════
  // OPTIONS (opt_)
  // ═══════════════════════════════════════════════════════════
  opt_take_photo: { en: 'Take Photo', te: 'ఫోటో తీయండి' },
  opt_choose_gallery: { en: 'Choose from Gallery', te: 'గ్యాలరీ నుండి ఎంచుకోండి' },
  opt_remove_photo: { en: 'Remove Photo', te: 'ఫోటోను తొలగించు' },
  opt_gallery: { en: 'Gallery', te: 'గ్యాలరీ' },

  // ═══════════════════════════════════════════════════════════
  // APP SPLASH & CORE (lbl_app_*)
  // ═══════════════════════════════════════════════════════════
  lbl_app_name: { en: 'SETU', te: 'SETU' },
  lbl_app_tagline: { en: 'Smart Escalation & Tracking Utility', te: 'స్మార్ట్ ఎస్కలేషన్ & ట్రాకింగ్ యుటిలిటీ' },

  // ═══════════════════════════════════════════════════════════
  // LOGIN SCREEN (A-02)
  // ═══════════════════════════════════════════════════════════
  tab_log_in: { en: 'Log In', te: 'లాగిన్' },
  tab_first_time: { en: 'First Time Setup', te: 'మొదటి సారి సెటప్' },
  lbl_password: { en: 'Password', te: 'పాస్‌వర్డ్' },
  btn_toggle_password: { en: 'Toggle Password', te: 'పాస్‌వర్డ్ చూపించు' },
  lnk_forgot_password: { en: 'Forgot Password?', te: 'పాస్‌వర్డ్ మర్చిపోయారా?' },
  lbl_lang_toggle: { en: 'Language', te: 'భాష' },
  btn_need_help: { en: 'Need Help?', te: 'సహాయం కావాలా?' },
  lbl_login_error: { en: 'Invalid credentials. Please try again.', te: 'చెల్లని ప్రమాణాలు. దయచేసి మళ్లీ ప్రయత్నించండి.' },
  lbl_school_name: { en: 'School Name', te: 'పాఠశాల పేరు' },
  lbl_headmaster_name: { en: 'Headmaster Name', te: 'ప్రధానోపాధ్యాయుడి పేరు' },
  lbl_contact_number: { en: 'Contact Number', te: 'సంప్రదింపు నంబర్' },
  lbl_whatsapp_number: { en: 'WhatsApp Number', te: 'WhatsApp నంబర్' },
  btn_submit_registration: { en: 'Submit Registration', te: 'నమోదును సమర్పించండి' },
  lbl_pending_approval: { en: 'Your registration is pending district approval.', te: 'మీ నమోదు జిల్లా ఆమోదం కోసం పెండింగ్‌లో ఉంది.' },

  // LOGIN MODALS
  modal_forgot_pw_title: { en: 'Forgot Password?', te: 'పాస్‌వర్డ్ మర్చిపోయారా?' },
  lbl_otp_info: { en: 'An OTP will be sent to the registered contact number.', te: 'నమోదిత సంప్రదింపు నంబర్‌కు OTP పంపబడుతుంది.' },
  btn_send_otp: { en: 'Send OTP', te: 'OTP పంపండి' },
  modal_help_title: { en: 'Need Help?', te: 'సహాయం కావాలా?' },
  lbl_whatsapp_support: { en: 'WhatsApp Support', te: 'WhatsApp మద్దతు' },
  lbl_email_support: { en: 'Email Support', te: 'ఇమెయిల్ మద్దతు' },
  lnk_user_guide: { en: 'Download PDF Guide', te: 'PDF గైడ్ డౌన్‌లోడ్ చేయండి' },

  // ═══════════════════════════════════════════════════════════
  // ONBOARDING (A-03)
  // ═══════════════════════════════════════════════════════════
  btn_skip: { en: 'Skip', te: 'దాటవేయి' },
  onboard_h1: { en: 'Welcome to SETU', te: 'SETU కి స్వాగతం' },
  onboard_body1: { en: 'Report school issues in 2 minutes. Track every report to resolution.', te: '2 నిమిషాల్లో పాఠశాల సమస్యలను నివేదించండి. ప్రతి నివేదికను పరిష్కారం వరకు టరాక్ చేయండి.' },
  onboard_h2: { en: 'Your Report Reaches the Right Person', te: 'మీ నివేదిక సరైన వ్యక్తికి చేరుతుంది' },
  onboard_body2: { en: 'Issues are automatically escalated to the right authority based on urgency.', te: 'అత్యవసరత ఆధారంగా సమస్యలు స్వయంచాలకంగా సరైన అధికారికి పంపబడతాయి.' },
  onboard_h3: { en: 'Nothing Gets Lost', te: 'ఏదీ పోదు' },
  onboard_body3: { en: 'Every issue is tracked with a unique ID. Get real-time updates until resolution.', te: 'ప్రతి సమస్య ప్రత్యేక ID తో ట్రాక్ చేయబడుతుంది. పరిష్కారం వరకు నిజ-సమయ అప్‌డేట్‌లు పొందండి.' },
  btn_get_started: { en: 'Get Started', te: 'ప్రారంభించండి' },

  // ═══════════════════════════════════════════════════════════
  // DASHBOARD (A-04)
  // ═══════════════════════════════════════════════════════════
  lbl_school_name_appbar: { en: 'School Name', te: 'పాఠశాల పేరు' },
  btn_notifications: { en: 'Notifications', te: 'నోటిఫికేషన్లు' },
  lbl_open_count: { en: 'Open', te: 'తెరిచి' },
  lbl_pending_count: { en: 'Pending', te: 'పెండింగ్' },
  lbl_resolved_count: { en: 'Resolved', te: 'పరిష్కరించబడింది' },
  chip_all: { en: 'All', te: 'అన్నీ' },
  chip_pending: { en: 'Pending', te: 'పెండింగ్' },
  chip_resolved: { en: 'Resolved', te: 'పరిష్కరించబడింది' },
  fab_report_issue: { en: 'Report Issue', te: 'సమస్యను నివేదించు' },
  btn_filter_sort: { en: 'Filter / Sort', te: 'ఫిల్టర్ / క్రమీకరించు' },

  // FILTER MODAL
  modal_filter_title: { en: 'Filter & Sort', te: 'ఫిల్టర్ & క్రమీకరణ' },
  sort_urgency: { en: 'Urgency', te: 'అత్యవసరత' },
  sort_date: { en: 'Date Added', te: 'తేదీ జోడించబడింది' },
  sort_updated: { en: 'Last Updated', te: 'చివరి నవీకరణ' },

  // CATEGORIES
  cat_water: { en: 'Water', te: 'నీరు' },
  cat_electricity: { en: 'Electricity', te: 'విద్యుత్' },
  cat_building: { en: 'Building', te: 'భవనం' },
  cat_safety: { en: 'Safety', te: 'భద్రత' },
  cat_finance: { en: 'Finance', te: 'ఆర్థిక' },
  cat_other: { en: 'Other', te: 'ఇతర' },

  // ═══════════════════════════════════════════════════════════
  // REPORT ISSUE FLOW (A-05 to A-08)
  // ═══════════════════════════════════════════════════════════
  scr_report_title: { en: 'Report an Issue', te: 'సమస్యను నివేదించండి' },
  lbl_step1: { en: 'Step 1 of 4 — Category & Title', te: 'దశ 1 / 4 — వర్గం & శీర్షిక' },
  lbl_step2: { en: 'Step 2 of 4 — Description & Photo', te: 'దశ 2 / 4 — వివరణ & ఫోటో' },
  lbl_step3: { en: 'Step 3 of 4 — Urgency', te: 'దశ 3 / 4 — అత్యవసరత' },
  lbl_step4: { en: 'Step 4 of 4 — Review', te: 'దశ 4 / 4 — సమీక్ష' },
  
  lbl_category_prompt: { en: 'What is the issue about?', te: 'సమస్య దేనికి సంబంధించినది?' },
  lbl_issue_title_field: { en: 'Issue Title', te: 'సమస్య శీర్షిక' },
  placeholder_issue_title: { en: 'Briefly describe the issue', te: 'సమస్యను సంక్షిప్తంగా వివరించండి' },
  
  lbl_desc_prompt: { en: 'Describe the problem', te: 'సమస్యను వివరించండి' },
  placeholder_description_detailed: { en: 'What happened? When did it start? How many students are affected?', te: 'ఏమి జరిగింది? ఎప్పుడు ప్రారంభమైంది? ఎంత మంది విద్యార్థులు ప్రభావితమయ్యారు?' },
  btn_take_photo: { en: 'Take Photo', te: 'ఫోటో తీయండి' },
  btn_choose_gallery: { en: 'Choose from Gallery', te: 'గ్యాలరీ నుండి ఎంచుకోండి' },
  btn_remove_photo: { en: 'Remove Photo', te: 'ఫోటోను తొలగించు' },
  btn_voice_note: { en: 'Hold to record (max 60s)', te: 'రికార్డ్ చేయడానికి పట్టుకోండి (గరిష్టం 60సె)' },
  
  lbl_urgency_prompt: { en: 'How urgent is this?', te: 'ఇది ఎంత అత్యవసరం?' },
  lbl_urgency_note: { en: 'Our system also auto-scores urgency. Your input helps prioritise faster.', te: 'మా సిస్టమ్ కూడా అత్యవసరతను స్వయంచాలకంగా స్కోర్ చేస్తుంది. మీ ఇన్‌పుట్ వేగంగా ప్రాధాన్యత ఇవ్వడానికి సహాయపడుతుంది.' },
  card_can_wait: { en: 'Can Wait', te: 'వేచి ఉండవచ్చు' },
  lbl_can_wait_body: { en: 'Not immediately affecting students', te: 'విద్యార్థులను వెంటనే ప్రభావితం చేయద' },
  card_soon: { en: 'Needs Attention Soon', te: 'త్వరలో శ్రద్ధ అవసరం' },
  lbl_soon_body: { en: 'Affecting daily activity but manageable', te: 'రోజువారీ కార్యకలాపాలను ప్రభావితం చేస్తుంది కానీ నిర్వహించదగినది' },
  card_urgent: { en: 'Urgent Now', te: 'ఇప్పుడే అత్యవసరం' },
  lbl_urgent_body: { en: 'Immediate risk to health or safety', te: 'ఆరోగ్యం లేదా భద్రతకు తక్షణ ప్రమాదం' },
  
  lbl_review_title: { en: 'Review your report', te: 'మీ నివేదికను సమీక్షించండి' },
  lbl_edit: { en: 'Edit', te: 'సవరించు' },
  lnk_edit: { en: 'Edit', te: 'సవరించు' },
  lbl_offline_banner: { en: 'Offline — draft saved. Will submit when reconnected.', te: 'ఆఫ్‌లైన్ — డ్రాఫ్ట్ సేవ్ చేయబడింది. తిరిగి కనెక్ట్ అయినప్పుడు సమర్పించబడుతుంది.' },
  lbl_submit_note: { en: 'Submitting is permanent. You can track status from My Issues.', te: 'సమర్పించడం శాశ్వతం. మీరు నా సమస్యల నుండి స్థితిని ట్రాక్ చేయవచ్చు.' },

  // REPORT MODALS
  modal_discard_title: { en: 'Leave without saving?', te: 'సేవ్ చేయకుండా వదిలేయాలా?' },
  modal_discard_body: { en: 'Your draft will be saved and you can continue later.', te: 'మీ డ్రాఫ్ట్ సేవ్ చేయబడుతుంది మరియు మీరు తర్వాత కొనసాగించవచ్చు.' },
  btn_discard: { en: 'Discard', te: 'విస్మరించు' },
  btn_save_draft: { en: 'Save Draft', te: 'డ్రాఫ్ట్ సేవ్ చేయండి' },
  
  modal_submit_fail_title: { en: 'Submission Failed', te: 'సమర్పణ విఫలమైంది' },
  modal_submit_fail_body: { en: 'Your draft has been saved. It will be submitted automatically when you reconnect.', te: 'మీ డ్రాఫ్ట్ సేవ్ చేయబడింది. మీరు తిరిగి కనెక్ట్ అయినప్పుడు స్వయంచాలకంగా సమర్పించబడుతుంది.' },
  btn_try_again: { en: 'Try Again', te: 'మళ్లీ ప్రయత్నించండి' },
  lnk_view_drafts: { en: 'View Saved Drafts', te: 'సేవ్ చేసిన డ్రాఫ్ట్‌లను చూడండి' },

  // ═══════════════════════════════════════════════════════════
  // ISSUE DETAIL (A-09)
  // ═══════════════════════════════════════════════════════════
  lbl_issue_id_appbar: { en: 'Issue', te: 'సమస్య' },
  lbl_submission_meta: { en: 'Submitted', te: 'సమర్పించబడింది' },
  lbl_timeline: { en: 'Timeline / Updates', te: 'టైమ్‌లైన్ / అప్‌డేట్‌లు' },
  lnk_show_history: { en: 'Show full history', te: 'పూర్తి చరిత్రను చూపించు' },
  placeholder_add_comment: { en: 'Add a note...', te: 'గమనిక జోడించండి...' },
  btn_dispute: { en: 'Dispute Resolution', te: 'పరిష్కారాన్ని వివాదం చేయండి' },
  lbl_dispute_timer: { en: 'Time remaining to dispute', te: 'వివాదం చేయడానికి మిగిలిన సమయం' },
  lnk_download_pdf: { en: 'Download Issue PDF', te: 'సమస్య PDF డౌన్‌లోడ్ చేయండి' },
  
  // ═══════════════════════════════════════════════════════════
  // RCO SPECIFIC
  // ═══════════════════════════════════════════════════════════
  scr_issue_queue: { en: 'Issue Queue', te: 'సమసయ క్యూ' },
  lbl_queue_count: { en: 'issues', te: 'సమస్యలు' },
  btn_filter_panel: { en: 'Filter Panel', te: 'ఫిల్టర్ ప్యానెల్' },
  chip_active_filter: { en: 'Active Filter', te: 'క్రియాశీల ఫిల్టర్' },
  breadcrumb: { en: 'Breadcrumb', te: 'బ్రెడ్‌క్రంబ్' },
  btn_acknowledge: { en: 'Acknowledge', te: 'అంగీకరించు' },
  btn_update_status: { en: 'Update Status', te: 'స్థితిని నవీకరించు' },
  btn_flag_urgent: { en: 'Flag Urgent', te: 'అత్యవసరంగా ఫ్లాగ్ చేయండి' },
  btn_assign_officer: { en: 'Assign to Officer', te: 'అధికారికి కేటాయించండి' },
  
  // KPIs
  kpi_issues_open: { en: 'Issues Open', te: 'తెరిచి ఉన్న సమస్యలు' },
  kpi_avg_response: { en: 'Avg Response Time', te: 'సగటు స్పందన సమయం' },
  kpi_schools_active: { en: 'Schools Active', te: 'క్రియాశీల పాఠశాలలు' },
  lbl_pagination: { en: 'Showing', te: 'చూపిస్తోంది' },

  // ═══════════════════════════════════════════════════════════
  // AI URGENCY SCORE
  // ═══════════════════════════════════════════════════════════
  lbl_ai_urgency_score: { en: 'AI Urgency Score', te: 'AI అత్యవసరత స్కోర్' },
  lbl_ai_score: { en: 'AI Score', te: 'AI స్కోర్' },

  // ═══════════════════════════════════════════════════════════
  // TIMELINE / AUDIT LOG
  // ═══════════════════════════════════════════════════════════
  lbl_timeline_submitted: { en: 'Issue submitted', te: 'సమస్య సమర్పించబడింది' },
  lbl_timeline_acknowledged: { en: 'Acknowledged by', te: 'ఆమోదించబడింది' },
  lbl_timeline_status_updated: { en: 'Status updated to', te: 'స్థితి నవీకరించబడింది' },
  lbl_timeline_comment_added: { en: 'Comment added', te: 'వ్యాఖ్య జోడించబడింది' },
  lbl_timeline_escalated: { en: 'Escalated to', te: 'పంపబడింది' },
  lbl_timeline_assigned: { en: 'Assigned to', te: 'కేటాయించబడింది' },
  lbl_timeline_resolved: { en: 'Marked as resolved', te: 'పరిష్కరించబడిందిగా గుర్తించబడింది' },
  lbl_timeline_disputed: { en: 'Resolution disputed', te: 'పరిష్కారం వివాదాస్పదం' },
  lbl_timeline_closed: { en: 'Issue closed', te: 'సమస్య మూసివేయబడింది' },

  // ═══════════════════════════════════════════════════════════
  // ESCALATION LEVEL (full text)
  // ═══════════════════════════════════════════════════════════
  lbl_escalation_level: { en: 'Escalation Level', te: 'ఎస్కలేషన్ స్థాయి' },

  // ═══════════════════════════════════════════════════════════
  // ROLES
  // ═══════════════════════════════════════════════════════════
  role_staff: { en: 'Staff', te: 'సిబ్బంది' },
  role_principal: { en: 'Principal', te: 'ప్రధానోపాధ్యాయుడు' },
  role_rco: { en: 'RCO', te: 'RCO' },
  role_officer: { en: 'Officer', te: 'అధికారి' },

  // ═══════════════════════════════════════════════════════════
  // COMMON ACTIONS
  // ═══════════════════════════════════════════════════════════
  btn_submit: { en: 'Submit', te: 'సమర్పించు' },
  btn_close: { en: 'Close', te: 'మూసివేయి' },
  btn_download: { en: 'Download', te: 'డౌన్‌లోడ్' },
  btn_share: { en: 'Share', te: 'షేర్ చేయి' },
  btn_view_details: { en: 'View Details', te: 'వివరాలను చూడండి' },
  
  // ═══════════════════════════════════════════════════════════
  // TIME UNITS
  // ═══════════════════════════════════════════════════════════
  time_just_now: { en: 'Just now', te: 'ఇప్పుడే' },
  time_mins_ago: { en: 'mins ago', te: 'నిమిషాల క్రితం' },
  time_hours_ago: { en: 'hours ago', te: 'గంటల క్రితం' },
  time_days_ago: { en: 'days ago', te: 'రోజుల క్రితం' },
  time_weeks_ago: { en: 'weeks ago', te: 'వారాల క్రితం' },

  // ═══════════════════════════════════════════════════════════
  // PWA (Progressive Web App)
  // ═══════════════════════════════════════════════════════════
  'pwa.install.title': { en: 'Install SETU App', te: 'SETU యాప్ ఇన్‌స్టాల్ చేయండి' },
  'pwa.install.description': { en: 'Access SETU faster and work offline', te: 'SETU ను వేగంగా యాక్సెస్ చేయండి మరియు ఆఫ్‌లైన్‌లో పని చేయండి' },
  'pwa.install.cta': { en: 'Install', te: 'ఇన్‌స్టాల్ చేయండి' },
  'pwa.install.notNow': { en: 'Not now', te: 'ఇప్పుడు కాదు' },
  'pwa.ios.title': { en: 'Install SETU on iPhone', te: 'iPhoneలో SETU ఇన్‌స్టాల్ చేయండి' },
  'pwa.ios.step1': { en: 'Tap the Share button at the bottom of Safari', te: 'Safari దిగువన ఉన్న షేర్ బటన్‌ను నొక్కండి' },
  'pwa.ios.step2': { en: 'Scroll down and tap "Add to Home Screen"', te: 'క్రిందకు స్క్రోల్ చేసి "హోమ్ స్క్రీన్‌కు జోడించండి" నొక్కండి' },
  'pwa.ios.step3': { en: 'Tap "Add" to install SETU', te: 'SETU ఇన్‌స్టాల్ చేయడానికి "జోడించండి" నొక్కండి' },
  'pwa.ios.gotIt': { en: 'Got it', te: 'అర్థమైంది' },
};

/**
 * Helper to get translated text
 * @param key - i18n key
 * @param lang - current language
 * @param fallback - fallback text if key not found
 * @returns translated string
 */
export function t(key: string, lang: AppLanguage, fallback?: string): string {
  const translation = translations[key];
  if (translation) {
    return translation[lang];
  }
  return fallback || key;
}

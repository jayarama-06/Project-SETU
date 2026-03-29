export interface Issue {
  id: string;
  title: string;
  category: string;
  status: 'open' | 'acknowledged' | 'in_progress' | 'resolved' | 'closed';
  escalation_level: 0 | 1 | 2 | 3 | 4;
  urgency: 'low' | 'high' | 'critical';
  created_at: string;
  school_name: string;
}

export const mockIssues: Issue[] = [
  {
    id: 'GRV-4092',
    title: 'Water pump malfunction in girls hostel block',
    category: 'Infrastructure',
    status: 'open',
    escalation_level: 2,
    urgency: 'critical',
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    school_name: 'TGTWREIS Gurukulam, Adilabad',
  },
  {
    id: 'GRV-4088',
    title: 'Delay in mid-day meal supplies',
    category: 'Food & Nutrition',
    status: 'in_progress',
    escalation_level: 1,
    urgency: 'high',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    school_name: 'TGTWREIS Gurukulam, Adilabad',
  },
  {
    id: 'GRV-4075',
    title: 'Textbook shortage for Class 8 students',
    category: 'Academic',
    status: 'acknowledged',
    escalation_level: 0,
    urgency: 'low',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    school_name: 'TGTWREIS Gurukulam, Adilabad',
  },
  {
    id: 'GRV-4050',
    title: 'Broken window panes in classroom 5A',
    category: 'Infrastructure',
    status: 'resolved',
    escalation_level: 0,
    urgency: 'low',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    school_name: 'TGTWREIS Gurukulam, Adilabad',
  },
  {
    id: 'GRV-4045',
    title: 'Medical supplies expired in school clinic',
    category: 'Health & Safety',
    status: 'open',
    escalation_level: 3,
    urgency: 'critical',
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    school_name: 'TGTWREIS Gurukulam, Adilabad',
  },
];

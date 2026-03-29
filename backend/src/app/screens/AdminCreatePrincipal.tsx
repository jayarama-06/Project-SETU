import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { supabase } from '../../lib/supabase';
import { ArrowBack, PersonAdd, Save } from '@mui/icons-material';

interface School {
  id: string;
  name: string;
  udise_code: string;
  district: string;
}

export function AdminCreatePrincipal() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedSchoolId = searchParams.get('schoolId');

  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    school_id: preselectedSchoolId || '',
    full_name: '',
    email: '',
    phone: '',
    designation: 'Principal',
    password: '',
  });

  useEffect(() => {
    loadSchools();
  }, []);

  async function loadSchools() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('schools')
        .select('id, name, udise_code, district')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setSchools(data || []);
    } catch (err) {
      console.error('Error loading schools:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validation
    if (!formData.school_id) {
      alert('Please select a school');
      return;
    }
    if (!formData.full_name.trim()) {
      alert('Principal name is required');
      return;
    }
    if (!formData.email.trim()) {
      alert('Email is required');
      return;
    }
    if (!formData.password || formData.password.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    try {
      setSubmitting(true);

      // Step 1: Create auth user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name.trim(),
            role: 'principal',
          },
        },
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          alert('This email is already registered');
        } else {
          throw authError;
        }
        return;
      }

      if (!authData.user) {
        alert('Failed to create auth user');
        return;
      }

      // Step 2: Create user profile in public.users table
      const { error: profileError } = await supabase.from('users').insert({
        id: authData.user.id,
        school_id: formData.school_id,
        role: 'principal',
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        designation: formData.designation.trim(),
        language_pref: 'en',
      });

      if (profileError) throw profileError;

      // Step 3: Update school with principal name
      const { error: schoolUpdateError } = await supabase
        .from('schools')
        .update({ principal_name: formData.full_name.trim() })
        .eq('id', formData.school_id);

      if (schoolUpdateError) {
        console.error('Warning: Could not update school principal name:', schoolUpdateError);
      }

      alert(`Principal account created successfully!\n\nEmail: ${formData.email}\nPassword: ${formData.password}\n\nPlease save these credentials.`);
      navigate('/admin/schools');
    } catch (err) {
      console.error('Error creating principal:', err);
      alert('Failed to create principal account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const selectedSchool = schools.find((s) => s.id === formData.school_id);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="bg-[#0D1B2A] text-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/schools')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowBack style={{ fontSize: 24 }} />
            </button>
            <div className="flex items-center gap-3">
              <PersonAdd className="text-[#F0A500]" style={{ fontSize: 28 }} />
              <div>
                <h1 className="text-xl font-semibold">Create Principal Account</h1>
                <p className="text-sm text-white/70">Set up new principal login</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading schools...</div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[#0D1B2A] mb-6">Principal Information</h2>

            <div className="space-y-5">
              {/* School Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  School <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.school_id}
                  onChange={(e) => handleChange('school_id', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
                >
                  <option value="">Select School</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name} - {school.district} ({school.udise_code})
                    </option>
                  ))}
                </select>
                {selectedSchool && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm">
                    <div className="font-medium text-blue-900">{selectedSchool.name}</div>
                    <div className="text-blue-700">
                      {selectedSchool.district} • UDISE: {selectedSchool.udise_code}
                    </div>
                  </div>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  placeholder="e.g., Dr. Rajesh Kumar"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="e.g., principal@school.edu"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
                />
                <p className="mt-1 text-xs text-gray-500">This will be used for login</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="e.g., +91 98765 43210"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
                />
              </div>

              {/* Designation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Designation
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => handleChange('designation', e.target.value)}
                  placeholder="e.g., Principal"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Initial Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Principal can change this after first login
                </p>
              </div>

              {/* Warning Box */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <div className="text-yellow-800 text-sm">
                    <strong>Important:</strong> Save the email and password after creating the
                    account. You'll need to share these credentials with the principal.
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/admin/schools')}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 bg-[#F0A500] text-[#0D1B2A] px-4 py-2.5 rounded-lg font-medium hover:bg-[#d89400] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save style={{ fontSize: 20 }} />
                {submitting ? 'Creating Account...' : 'Create Principal Account'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
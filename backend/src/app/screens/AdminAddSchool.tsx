import { useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../../lib/supabase';
import { ArrowBack, School, Save } from '@mui/icons-material';

export function AdminAddSchool() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    udise_code: '',
    district: '',
    region: '',
    principal_name: '',
    contact_phone: '',
    whatsapp_number: '',
    address: '',
    student_count: '',
    latitude: '',
    longitude: '',
  });

  const districts = [
    'Adilabad',
    'Bhadradri Kothagudem',
    'Hyderabad',
    'Jagtial',
    'Jangaon',
    'Jayashankar Bhupalpally',
    'Jogulamba Gadwal',
    'Kamareddy',
    'Karimnagar',
    'Khammam',
    'Komaram Bheem',
    'Mahabubabad',
    'Mahbubnagar',
    'Mancherial',
    'Medak',
    'Medchal-Malkajgiri',
    'Mulugu',
    'Nagarkurnool',
    'Nalgonda',
    'Narayanpet',
    'Nirmal',
    'Nizamabad',
    'Peddapalli',
    'Rajanna Sircilla',
    'Rangareddy',
    'Sangareddy',
    'Siddipet',
    'Suryapet',
    'Vikarabad',
    'Wanaparthy',
    'Warangal Rural',
    'Warangal Urban',
    'Yadadri Bhuvanagiri',
  ];

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert('School name is required');
      return;
    }
    if (!formData.udise_code.trim()) {
      alert('UDISE code is required');
      return;
    }
    if (!formData.district) {
      alert('District is required');
      return;
    }

    try {
      setSubmitting(true);

      const { error } = await supabase.from('schools').insert({
        name: formData.name.trim(),
        udise_code: formData.udise_code.trim(),
        district: formData.district,
        region: formData.region.trim() || null,
        principal_name: formData.principal_name.trim() || null,
        contact_phone: formData.contact_phone.trim() || null,
        whatsapp_number: formData.whatsapp_number.trim() || null,
        address: formData.address.trim() || null,
        student_count: formData.student_count ? parseInt(formData.student_count) : 0,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        is_active: true,
      });

      if (error) {
        if (error.code === '23505') {
          // Unique constraint violation
          alert('A school with this UDISE code already exists');
        } else {
          throw error;
        }
        return;
      }

      alert('School added successfully!');
      navigate('/admin/schools');
    } catch (err) {
      console.error('Error adding school:', err);
      alert('Failed to add school. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

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
              <School className="text-[#F0A500]" style={{ fontSize: 28 }} />
              <div>
                <h1 className="text-xl font-semibold">Add New School</h1>
                <p className="text-sm text-white/70">Enter school details below</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6">
          <h2 className="text-lg font-semibold text-[#0D1B2A] mb-6">School Information</h2>

          <div className="space-y-5">
            {/* School Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                School Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., TTWREIS Bachupally"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
              />
            </div>

            {/* UDISE Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                UDISE Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.udise_code}
                onChange={(e) => handleChange('udise_code', e.target.value)}
                placeholder="e.g., 28230506102"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
              />
              <p className="mt-1 text-xs text-gray-500">Unique government school identifier</p>
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                District <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.district}
                onChange={(e) => handleChange('district', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Region</label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) => handleChange('region', e.target.value)}
                placeholder="e.g., North Zone"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
              />
            </div>

            {/* Principal Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Principal Name
              </label>
              <input
                type="text"
                value={formData.principal_name}
                onChange={(e) => handleChange('principal_name', e.target.value)}
                placeholder="e.g., Dr. Rajesh Kumar"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
              />
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Contact Phone
              </label>
              <input
                type="tel"
                value={formData.contact_phone}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                placeholder="e.g., +91 98765 43210"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
              />
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={formData.whatsapp_number}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                placeholder="e.g., +91 98765 43210"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Enter full address"
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
              />
            </div>

            {/* Student Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Student Count
              </label>
              <input
                type="number"
                min="0"
                value={formData.student_count}
                onChange={(e) => handleChange('student_count', e.target.value)}
                placeholder="e.g., 450"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
              />
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => handleChange('latitude', e.target.value)}
                  placeholder="e.g., 17.4375"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => handleChange('longitude', e.target.value)}
                  placeholder="e.g., 78.4483"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
                />
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
              {submitting ? 'Adding School...' : 'Add School'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

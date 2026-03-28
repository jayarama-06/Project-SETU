import { useState } from 'react';
import { X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useSchoolStaff } from '../hooks/useSchoolStaff';

interface StaffSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (staffId: string) => void;
}

export function StaffSelectorModal({
  isOpen,
  onClose,
  onSelect,
}: StaffSelectorModalProps) {
  const { user } = useCurrentUser();
  const { staff, loading } = useSchoolStaff({ 
    schoolId: user?.school_id || undefined 
  });

  const [searchQuery, setSearchQuery] = useState('');

  const filteredStaff = staff.filter((member) =>
    member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
    (member.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  const handleToggleStaff = (staffId: string) => {
    onSelect(staffId);
  };

  const handleApply = () => {
    onClose();
  };

  const handleClearAll = () => {
    onSelect('');
  };

  const handleSelectAll = () => {
    onSelect(filteredStaff.map((s) => s.id).join(','));
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(13, 27, 42, 0.64)', backdropFilter: 'blur(2px)' }}
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 40, stiffness: 400 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.3 }}
            onDragEnd={handleDragEnd}
            className="fixed bottom-0 left-0 right-0 bg-white z-50 flex flex-col"
            style={{
              maxHeight: '80vh',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              maxWidth: '600px',
              margin: '0 auto',
              boxShadow: '0 -8px 32px rgba(13, 27, 42, 0.12), 0 -2px 8px rgba(13, 27, 42, 0.08)',
              touchAction: 'none',
            }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing">
              <motion.div
                whileHover={{ width: '48px' }}
                transition={{ duration: 0.2 }}
                style={{
                  width: '40px',
                  height: '4px',
                  borderRadius: '2px',
                  backgroundColor: '#D1D5DB',
                }}
              />
            </div>

            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '1px solid #E5E7EB' }}
            >
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: '4px',
                    height: '24px',
                    backgroundColor: '#F0A500',
                    borderRadius: '2px',
                  }}
                />
                <h2
                  className="text-[#0D1B2A]"
                  style={{
                    fontFamily: 'Noto Sans',
                    fontWeight: 700,
                    fontSize: '18px',
                  }}
                  data-i18n="modal_filter_staff_title"
                >
                  Filter by Staff Member
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#F3F4F6' }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center"
                style={{
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
              >
                <X size={20} color="#6B7280" />
              </motion.button>
            </div>

            {/* Search Bar */}
            <div className="px-6 py-4" style={{ borderBottom: '1px solid #E5E7EB' }}>
              <div
                className="flex items-center gap-3"
                style={{
                  backgroundColor: '#F3F4F6',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  minHeight: '48px',
                }}
              >
                <Search size={18} color="#6B7280" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search staff by name, role..."
                  data-i18n="placeholder_search_staff"
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontFamily: 'Noto Sans',
                    fontSize: '15px',
                    color: '#0D1B2A',
                  }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="min-w-[24px] min-h-[24px]">
                    <X size={16} color="#9CA3AF" />
                  </button>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleSelectAll}
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0D1B2A',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px 8px',
                  }}
                  data-i18n="btn_select_all"
                >
                  Select All
                </button>
                <span style={{ color: '#E5E7EB' }}>|</span>
                <button
                  onClick={handleClearAll}
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#6B7280',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px 8px',
                  }}
                  data-i18n="btn_clear_all"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Staff List */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {filteredStaff.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <p
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '15px',
                      color: '#9CA3AF',
                      textAlign: 'center',
                    }}
                    data-i18n="empty_no_staff_found"
                  >
                    No staff members found
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredStaff.map((staff) => {
                    const isSelected = staff.id === onSelect;
                    return (
                      <motion.label
                        key={staff.id}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 cursor-pointer"
                        style={{
                          padding: '12px',
                          borderRadius: '12px',
                          backgroundColor: isSelected ? '#FEF3C7' : 'transparent',
                          border: `1.5px solid ${isSelected ? '#F0A500' : '#E5E7EB'}`,
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      >
                        {/* Checkbox */}
                        <div className="relative flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleStaff(staff.id)}
                            className="w-5 h-5 cursor-pointer"
                            style={{ accentColor: '#F0A500' }}
                          />
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            >
                              <Check size={14} color="#F0A500" strokeWidth={3} />
                            </motion.div>
                          )}
                        </div>

                        {/* Staff Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              style={{
                                fontFamily: 'Noto Sans',
                                fontSize: '15px',
                                fontWeight: 600,
                                color: '#0D1B2A',
                                lineHeight: '20px',
                              }}
                            >
                              {staff.full_name}
                            </span>
                            <span
                              style={{
                                backgroundColor: '#E0E7FF',
                                color: '#4338CA',
                                fontFamily: 'Noto Sans',
                                fontSize: '10px',
                                fontWeight: 600,
                                padding: '2px 6px',
                                borderRadius: '4px',
                                textTransform: 'uppercase',
                              }}
                            >
                              {staff.designation}
                            </span>
                          </div>
                          {staff.subject && (
                            <span
                              style={{
                                fontFamily: 'Noto Sans',
                                fontSize: '12px',
                                color: '#6B7280',
                                lineHeight: '16px',
                              }}
                            >
                              {staff.subject}
                            </span>
                          )}
                        </div>
                      </motion.label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Buttons */}
            <div
              className="flex gap-3 px-6 py-5 bg-white"
              style={{
                borderTop: '1px solid #E5E7EB',
                boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              {/* Selected Count */}
              <div className="flex items-center">
                <span
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#6B7280',
                  }}
                >
                  {tempSelectedIds.length} selected
                </span>
              </div>

              <div className="flex-1" />

              {/* Cancel Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="min-h-[48px] px-6 transition-all"
                style={{
                  backgroundColor: 'white',
                  border: '1.5px solid #E5E7EB',
                  borderRadius: '12px',
                  color: '#6B7280',
                  fontFamily: 'Noto Sans',
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: 'pointer',
                }}
                data-i18n="btn_cancel"
              >
                Cancel
              </motion.button>

              {/* Apply Button */}
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#0A1621' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleApply}
                className="min-h-[48px] px-6 transition-all"
                style={{
                  backgroundColor: '#0D1B2A',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontFamily: 'Noto Sans',
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(13, 27, 42, 0.24)',
                }}
                data-i18n="btn_apply"
              >
                Apply
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

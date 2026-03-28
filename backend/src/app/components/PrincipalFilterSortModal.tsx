import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';

export type SortOption = 'urgency' | 'date' | 'updated';
export type CategoryOption = 'water' | 'electricity' | 'building' | 'safety' | 'finance' | 'other';
export type ReporterFilter = 'all_staff' | 'my_reports' | 'staff_only';

export interface PrincipalFilterSortState {
  sortBy: SortOption;
  categories: CategoryOption[];
  reporterFilter: ReporterFilter;
}

interface PrincipalFilterSortModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: PrincipalFilterSortState;
  onApply: (state: PrincipalFilterSortState) => void;
}

export function PrincipalFilterSortModal({
  isOpen,
  onClose,
  currentState,
  onApply,
}: PrincipalFilterSortModalProps) {
  const [sortBy, setSortBy] = useState<SortOption>(currentState.sortBy);
  const [selectedCategories, setSelectedCategories] = useState<CategoryOption[]>(currentState.categories);
  const [reporterFilter, setReporterFilter] = useState<ReporterFilter>(currentState.reporterFilter);

  // Sync with prop changes
  useEffect(() => {
    if (isOpen) {
      setSortBy(currentState.sortBy);
      setSelectedCategories(currentState.categories);
      setReporterFilter(currentState.reporterFilter);
    }
  }, [isOpen, currentState]);

  const handleReset = () => {
    setSortBy('urgency');
    setSelectedCategories([]);
    setReporterFilter('all_staff');
  };

  const handleApply = () => {
    onApply({
      sortBy,
      categories: selectedCategories,
      reporterFilter,
    });
    onClose();
  };

  const toggleCategory = (category: CategoryOption) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
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
              maxHeight: '85vh',
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
                  data-i18n="modal_filter_title"
                >
                  Filter & Sort
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

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* ── SECTION 1: Reporter Filter (Principal-specific) ── */}
              <div className="mb-8">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      width: '3px',
                      height: '16px',
                      backgroundColor: '#F0A500',
                      borderRadius: '1.5px',
                    }}
                  />
                  <h3
                    className="text-[#0D1B2A]"
                    style={{
                      fontFamily: 'Noto Sans',
                      fontWeight: 600,
                      fontSize: '16px',
                      margin: 0,
                    }}
                    data-i18n="filter_section_reporter"
                  >
                    Reporter
                  </h3>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      value: 'all_staff' as ReporterFilter,
                      label: 'All Staff',
                      i18n: 'filter_all_staff',
                      desc: 'Show all reports',
                    },
                    {
                      value: 'my_reports' as ReporterFilter,
                      label: 'My Reports Only',
                      i18n: 'filter_my_reports',
                      desc: 'Issues reported by you',
                    },
                    {
                      value: 'staff_only' as ReporterFilter,
                      label: 'Staff Reports Only',
                      i18n: 'filter_staff_only',
                      desc: 'Issues reported by other staff',
                    },
                  ].map((option) => (
                    <motion.label
                      key={option.value}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-start gap-3 cursor-pointer"
                      style={{
                        minHeight: '52px',
                        padding: '12px',
                        borderRadius: '12px',
                        backgroundColor: reporterFilter === option.value ? '#FEF3C7' : 'transparent',
                        border: `1.5px solid ${reporterFilter === option.value ? '#F0A500' : '#E5E7EB'}`,
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      <input
                        type="radio"
                        name="reporterFilter"
                        value={option.value}
                        checked={reporterFilter === option.value}
                        onChange={() => setReporterFilter(option.value)}
                        className="w-5 h-5 cursor-pointer mt-[2px]"
                        style={{ accentColor: '#F0A500' }}
                      />
                      <div className="flex-1">
                        <span
                          className="block text-[#0D1B2A]"
                          style={{
                            fontFamily: 'Noto Sans',
                            fontSize: '15px',
                            fontWeight: 600,
                            lineHeight: '20px',
                          }}
                          data-i18n={option.i18n}
                        >
                          {option.label}
                        </span>
                        <span
                          className="block text-[#6B7280]"
                          style={{
                            fontFamily: 'Noto Sans',
                            fontSize: '12px',
                            lineHeight: '16px',
                            marginTop: '2px',
                          }}
                        >
                          {option.desc}
                        </span>
                      </div>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* ── SECTION 2: Sort By ── */}
              <div className="mb-8">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      width: '3px',
                      height: '16px',
                      backgroundColor: '#0D1B2A',
                      borderRadius: '1.5px',
                    }}
                  />
                  <h3
                    className="text-[#0D1B2A]"
                    style={{
                      fontFamily: 'Noto Sans',
                      fontWeight: 600,
                      fontSize: '16px',
                      margin: 0,
                    }}
                    data-i18n="filter_section_sort"
                  >
                    Sort By
                  </h3>
                </div>
                <div className="space-y-2">
                  {[
                    { value: 'urgency' as SortOption, label: 'Urgency', i18n: 'sort_urgency' },
                    { value: 'date' as SortOption, label: 'Date Added', i18n: 'sort_date' },
                    { value: 'updated' as SortOption, label: 'Last Updated', i18n: 'sort_updated' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 cursor-pointer min-h-[48px] px-3 rounded-lg hover:bg-[#F9FAFB] transition-colors"
                    >
                      <input
                        type="radio"
                        name="sortBy"
                        value={option.value}
                        checked={sortBy === option.value}
                        onChange={() => setSortBy(option.value)}
                        className="w-5 h-5 cursor-pointer"
                        style={{ accentColor: '#0D1B2A' }}
                      />
                      <span
                        className="text-[#0D1B2A]"
                        style={{ fontFamily: 'Noto Sans', fontSize: '15px' }}
                        data-i18n={option.i18n}
                      >
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ── SECTION 3: Category ── */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      width: '3px',
                      height: '16px',
                      backgroundColor: '#0D1B2A',
                      borderRadius: '1.5px',
                    }}
                  />
                  <h3
                    className="text-[#0D1B2A]"
                    style={{
                      fontFamily: 'Noto Sans',
                      fontWeight: 600,
                      fontSize: '16px',
                      margin: 0,
                    }}
                    data-i18n="filter_section_category"
                  >
                    Category
                  </h3>
                </div>
                <div className="space-y-2">
                  {[
                    { value: 'water' as CategoryOption, label: 'Water', i18n: 'cat_water' },
                    {
                      value: 'electricity' as CategoryOption,
                      label: 'Electricity',
                      i18n: 'cat_electricity',
                    },
                    { value: 'building' as CategoryOption, label: 'Building', i18n: 'cat_building' },
                    { value: 'safety' as CategoryOption, label: 'Safety', i18n: 'cat_safety' },
                    { value: 'finance' as CategoryOption, label: 'Finance', i18n: 'cat_finance' },
                    { value: 'other' as CategoryOption, label: 'Other', i18n: 'cat_other' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 cursor-pointer min-h-[48px] px-3 rounded-lg hover:bg-[#F9FAFB] transition-colors"
                    >
                      <input
                        type="checkbox"
                        value={option.value}
                        checked={selectedCategories.includes(option.value)}
                        onChange={() => toggleCategory(option.value)}
                        className="w-5 h-5 cursor-pointer"
                        style={{ accentColor: '#0D1B2A' }}
                      />
                      <span
                        className="text-[#0D1B2A]"
                        style={{ fontFamily: 'Noto Sans', fontSize: '15px' }}
                        data-i18n={option.i18n}
                      >
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Buttons */}
            <div
              className="flex gap-3 px-6 py-5 bg-white"
              style={{
                borderTop: '1px solid #E5E7EB',
                boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              {/* Reset Button */}
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#F9FAFB' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                className="flex-1 min-h-[52px] transition-all"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #E5E7EB',
                  borderRadius: '12px',
                  color: '#6B7280',
                  fontFamily: 'Noto Sans',
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: 'pointer',
                }}
                data-i18n="btn_reset"
              >
                Reset
              </motion.button>

              {/* Apply Button */}
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#0A1621' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleApply}
                className="flex-1 min-h-[52px] transition-all"
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
                Apply Filters
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

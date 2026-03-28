import { useState, useEffect } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';

export type SortOption = 'urgency' | 'date' | 'updated';
export type CategoryOption = 'water' | 'electricity' | 'building' | 'safety' | 'finance' | 'other';

export interface FilterSortState {
  sortBy: SortOption;
  categories: CategoryOption[];
}

interface FilterSortModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: FilterSortState;
  onApply: (state: FilterSortState) => void;
}

export function FilterSortModal({ isOpen, onClose, currentState, onApply }: FilterSortModalProps) {
  const [sortBy, setSortBy] = useState<SortOption>(currentState.sortBy);
  const [selectedCategories, setSelectedCategories] = useState<CategoryOption[]>(currentState.categories);

  // Sync with prop changes
  useEffect(() => {
    if (isOpen) {
      setSortBy(currentState.sortBy);
      setSelectedCategories(currentState.categories);
    }
  }, [isOpen, currentState]);

  const handleReset = () => {
    setSortBy('urgency');
    setSelectedCategories([]);
  };

  const handleApply = () => {
    onApply({
      sortBy,
      categories: selectedCategories,
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
            className="fixed bottom-0 left-0 right-0 bg-white z-50 flex flex-col"
            style={{
              height: '80vh',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div
                className="rounded-full"
                style={{
                  width: '32px',
                  height: '4px',
                  backgroundColor: '#9CA3AF',
                }}
              />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
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
              <button
                onClick={onClose}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center"
              >
                <X size={24} color="#6B7280" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* Sort By Section */}
              <div className="mb-8">
                <h3
                  className="mb-4 text-[#0D1B2A]"
                  style={{
                    fontFamily: 'Noto Sans',
                    fontWeight: 600,
                    fontSize: '16px',
                  }}
                >
                  Sort By
                </h3>
                <div className="space-y-3">
                  {[
                    { value: 'urgency' as SortOption, label: 'Urgency', i18n: 'sort_urgency' },
                    { value: 'date' as SortOption, label: 'Date Added', i18n: 'sort_date' },
                    { value: 'updated' as SortOption, label: 'Last Updated', i18n: 'sort_updated' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 cursor-pointer min-h-[48px]"
                    >
                      <input
                        type="radio"
                        name="sortBy"
                        value={option.value}
                        checked={sortBy === option.value}
                        onChange={() => setSortBy(option.value)}
                        className="w-5 h-5 accent-[#0D1B2A] cursor-pointer"
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

              {/* Category Section */}
              <div>
                <h3
                  className="mb-4 text-[#0D1B2A]"
                  style={{
                    fontFamily: 'Noto Sans',
                    fontWeight: 600,
                    fontSize: '16px',
                  }}
                >
                  Category
                </h3>
                <div className="space-y-3">
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
                      className="flex items-center gap-3 cursor-pointer min-h-[48px]"
                    >
                      <input
                        type="checkbox"
                        value={option.value}
                        checked={selectedCategories.includes(option.value)}
                        onChange={() => toggleCategory(option.value)}
                        className="w-5 h-5 accent-[#0D1B2A] cursor-pointer"
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
              className="flex gap-3 px-6 py-4 bg-white border-t border-[#E5E7EB]"
              style={{ boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.05)' }}
            >
              {/* Reset Button - Ghost */}
              <button
                onClick={handleReset}
                className="flex-1 min-h-[48px] transition-colors"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  color: '#0D1B2A',
                  fontFamily: 'Noto Sans',
                  fontWeight: 500,
                  fontSize: '15px',
                }}
                data-i18n="btn_reset"
              >
                Reset
              </button>

              {/* Apply Button - Primary Navy */}
              <button
                onClick={handleApply}
                className="flex-1 min-h-[48px] transition-colors hover:opacity-90"
                style={{
                  backgroundColor: '#0D1B2A',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontFamily: 'Noto Sans',
                  fontWeight: 600,
                  fontSize: '15px',
                }}
                data-i18n="btn_apply"
              >
                Apply
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

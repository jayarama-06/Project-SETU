/**
 * SETU – Filter & Sort Bottom Sheet
 * Mobile filter/sort panel for issue lists
 * 
 * Design Spec: A-04 Staff Dashboard, Modal Section
 */

import { useState, CSSProperties } from 'react';
import { useLanguage } from '../utils/languageContext';
import { t } from '../utils/translations';

export interface FilterOptions {
  sortBy: 'urgency' | 'date' | 'updated';
  categories: string[];
}

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

const DEFAULT_FILTERS: FilterOptions = {
  sortBy: 'urgency',
  categories: [],
};

const CATEGORIES = ['water', 'electricity', 'building', 'safety', 'finance', 'other'];

/**
 * FilterBottomSheet – Mobile filter/sort panel
 * 
 * @example
 * <FilterBottomSheet
 *   isOpen={showFilter}
 *   onClose={() => setShowFilter(false)}
 *   onApply={(filters) => console.log(filters)}
 *   initialFilters={{ sortBy: 'urgency', categories: ['water'] }}
 * />
 */
export function FilterBottomSheet({
  isOpen,
  onClose,
  onApply,
  initialFilters = DEFAULT_FILTERS,
}: FilterBottomSheetProps) {
  const { language } = useLanguage();
  const [sortBy, setSortBy] = useState<'urgency' | 'date' | 'updated'>(initialFilters.sortBy);
  const [categories, setCategories] = useState<string[]>(initialFilters.categories);

  if (!isOpen) return null;

  const handleCategoryToggle = (category: string) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleReset = () => {
    setSortBy('urgency');
    setCategories([]);
  };

  const handleApply = () => {
    onApply({ sortBy, categories });
    onClose();
  };

  const overlayStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'flex-end',
    fontFamily: 'Noto Sans',
  };

  const sheetStyle: CSSProperties = {
    width: '100%',
    maxWidth: '480px',
    margin: '0 auto',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    maxHeight: '80vh',
    overflowY: 'auto',
    paddingBottom: 'calc(16px + env(safe-area-inset-bottom))',
    boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.1)',
  };

  const handleBarStyle: CSSProperties = {
    width: '32px',
    height: '4px',
    backgroundColor: '#9CA3AF',
    borderRadius: '2px',
    margin: '12px auto 8px',
  };

  const sectionStyle: CSSProperties = {
    padding: '16px 24px',
    borderBottom: '1px solid #E5E7EB',
  };

  const sectionTitleStyle: CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#0D1B2A',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  return (
    <div 
      style={overlayStyle} 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-title"
    >
      <div 
        style={sheetStyle} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle Bar */}
        <div style={handleBarStyle} />

        {/* Title */}
        <div style={{ padding: '16px 24px 0' }}>
          <h2
            id="filter-title"
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#0D1B2A',
              margin: 0,
            }}
            data-i18n="modal_filter_title"
          >
            {t('modal_filter_title', language)}
          </h2>
        </div>

        {/* Sort By Section */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>
            Sort By
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(['urgency', 'date', 'updated'] as const).map((option) => (
              <label
                key={option}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <input
                  type="radio"
                  name="sortBy"
                  checked={sortBy === option}
                  onChange={() => setSortBy(option)}
                  style={{
                    width: '20px',
                    height: '20px',
                    accentColor: '#F0A500',
                  }}
                />
                <span style={{ fontSize: '14px', color: '#0D1B2A' }} data-i18n={`sort_${option}`}>
                  {t(`sort_${option}`, language)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Category Section */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>
            Category
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {CATEGORIES.map((category) => (
              <label
                key={category}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <input
                  type="checkbox"
                  checked={categories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                  style={{
                    width: '20px',
                    height: '20px',
                    accentColor: '#F0A500',
                  }}
                />
                <span 
                  className="material-symbols-rounded" 
                  style={{ 
                    fontSize: '20px', 
                    color: categories.includes(category) ? '#F0A500' : '#6B7280',
                  }}
                >
                  {getCategoryIcon(category)}
                </span>
                <span 
                  style={{ 
                    fontSize: '14px', 
                    color: '#0D1B2A',
                    textTransform: 'capitalize',
                  }} 
                  data-i18n={`cat_${category}`}
                >
                  {t(`cat_${category}`, language)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', padding: '16px 24px' }}>
          <button
            onClick={handleReset}
            style={{
              flex: 1,
              height: '48px',
              backgroundColor: 'transparent',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#6B7280',
              cursor: 'pointer',
              fontFamily: 'Noto Sans',
            }}
            data-i18n="btn_reset"
          >
            {t('btn_reset', language)}
          </button>
          <button
            onClick={handleApply}
            style={{
              flex: 2,
              height: '48px',
              backgroundColor: '#0D1B2A',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#FFFFFF',
              cursor: 'pointer',
              fontFamily: 'Noto Sans',
            }}
            data-i18n="btn_apply"
          >
            {t('btn_apply', language)}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Get Material Symbol icon for category
 */
function getCategoryIcon(category: string): string {
  const iconMap: Record<string, string> = {
    water: 'water_drop',
    electricity: 'bolt',
    building: 'domain',
    safety: 'shield',
    finance: 'payments',
    other: 'more_horiz',
  };
  return iconMap[category] || 'circle';
}

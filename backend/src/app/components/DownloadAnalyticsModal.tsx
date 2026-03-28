import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface DownloadAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  districtName: string;
  dateRange: string;
}

export function DownloadAnalyticsModal({
  isOpen,
  onClose,
  districtName,
  dateRange,
}: DownloadAnalyticsModalProps) {
  const [format, setFormat] = useState<'csv' | 'pdf' | 'xlsx'>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate download generation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // In production, this would trigger actual file download
    console.log(`Generating ${format.toUpperCase()} report for ${districtName} - ${dateRange}`);
    
    setIsGenerating(false);
    onClose();
    
    // Show success toast (in production)
    alert(`Analytics report downloaded successfully as ${format.toUpperCase()}`);
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
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg z-50"
            style={{
              width: '480px',
              maxWidth: '90vw',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
              <h2
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#0D1B2A',
                }}
                data-i18n="modal_download_analytics"
              >
                Download Analytics Report
              </h2>
              <button
                onClick={onClose}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg hover:bg-[#F8F9FA] transition-colors"
                disabled={isGenerating}
              >
                <X size={24} color="#6B7280" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Scope Info */}
              <div
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: '#F8F9FA',
                  border: '1px solid #E5E7EB',
                }}
              >
                <p
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#6B7280',
                    marginBottom: '4px',
                  }}
                >
                  Report Scope
                </p>
                <p
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#0D1B2A',
                  }}
                >
                  {districtName} — {dateRange}
                </p>
              </div>

              {/* Format Selection */}
              <div>
                <label
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0D1B2A',
                    display: 'block',
                    marginBottom: '12px',
                  }}
                >
                  Select Format
                </label>
                <div className="space-y-3">
                  {[
                    { id: 'csv', label: 'CSV (Comma-Separated Values)', desc: 'Best for Excel and data processing' },
                    { id: 'pdf', label: 'PDF (Portable Document Format)', desc: 'Best for printing and sharing' },
                    { id: 'xlsx', label: 'XLSX (Excel Workbook)', desc: 'Best for detailed analysis' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setFormat(option.id as typeof format)}
                      className="w-full text-left p-4 rounded-lg border-2 transition-all"
                      style={{
                        borderColor: format === option.id ? '#F0A500' : '#E5E7EB',
                        backgroundColor: format === option.id ? '#FFFBF0' : 'white',
                        cursor: 'pointer',
                      }}
                      disabled={isGenerating}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex-shrink-0 rounded-full border-2 flex items-center justify-center"
                          style={{
                            width: '20px',
                            height: '20px',
                            borderColor: format === option.id ? '#F0A500' : '#D1D5DB',
                          }}
                        >
                          {format === option.id && (
                            <div
                              className="rounded-full"
                              style={{
                                width: '10px',
                                height: '10px',
                                backgroundColor: '#F0A500',
                              }}
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            style={{
                              fontFamily: 'Noto Sans',
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#0D1B2A',
                              marginBottom: '2px',
                            }}
                          >
                            {option.label}
                          </p>
                          <p
                            style={{
                              fontFamily: 'Noto Sans',
                              fontSize: '12px',
                              color: '#6B7280',
                            }}
                          >
                            {option.desc}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E5E7EB]">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-lg border border-[#E5E7EB] hover:bg-[#F8F9FA] transition-colors"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#6B7280',
                  height: '48px',
                }}
                disabled={isGenerating}
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                className="px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'white',
                  backgroundColor: isGenerating ? '#9CA3AF' : '#0D1B2A',
                  height: '48px',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                }}
                disabled={isGenerating}
                data-i18n="btn_generate_download"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <span>Generate & Download</span>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

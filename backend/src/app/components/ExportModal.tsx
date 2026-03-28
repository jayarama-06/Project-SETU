import { useState } from 'react';
import { motion } from 'motion/react';
import { Loader2, CheckCircle } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'csv' | 'pdf' | 'xlsx') => void;
  dateRange: string;
}

export function ExportModal({ isOpen, onClose, onExport, dateRange }: ExportModalProps) {
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf' | 'xlsx'>('csv');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate export process
    setTimeout(() => {
      setIsGenerating(false);
      onClose();
      setShowSuccessToast(true);
      onExport(exportFormat);
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 3000);
    }, 2000);
  };

  if (!isOpen && !showSuccessToast) return null;

  return (
    <>
      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            style={{ maxWidth: '480px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title */}
            <h2
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '20px',
                fontWeight: 700,
                color: '#0D1B2A',
                marginBottom: '16px',
              }}
              data-i18n="modal_export_title"
            >
              Export Issue List
            </h2>

            {/* Format Selection - Radio Buttons */}
            <div className="mb-4">
              <p
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0D1B2A',
                  marginBottom: '8px',
                }}
              >
                Format:
              </p>
              <div className="flex flex-col gap-2">
                {/* CSV Radio */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="export-format"
                    value="csv"
                    checked={exportFormat === 'csv'}
                    onChange={() => setExportFormat('csv')}
                    style={{
                      width: '18px',
                      height: '18px',
                      accentColor: '#F0A500',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '14px',
                      color: '#0D1B2A',
                    }}
                    data-i18n="opt_csv"
                  >
                    CSV
                  </span>
                </label>

                {/* PDF Radio */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="export-format"
                    value="pdf"
                    checked={exportFormat === 'pdf'}
                    onChange={() => setExportFormat('pdf')}
                    style={{
                      width: '18px',
                      height: '18px',
                      accentColor: '#F0A500',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '14px',
                      color: '#0D1B2A',
                    }}
                    data-i18n="opt_pdf"
                  >
                    PDF
                  </span>
                </label>

                {/* XLSX Radio */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="export-format"
                    value="xlsx"
                    checked={exportFormat === 'xlsx'}
                    onChange={() => setExportFormat('xlsx')}
                    style={{
                      width: '18px',
                      height: '18px',
                      accentColor: '#F0A500',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '14px',
                      color: '#0D1B2A',
                    }}
                    data-i18n="opt_xlsx"
                  >
                    XLSX
                  </span>
                </label>
              </div>
            </div>

            {/* Date Range Confirmation */}
            <div className="mb-4 p-3 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB]">
              <p
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '4px',
                }}
              >
                Date Range
              </p>
              <p
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  color: '#0D1B2A',
                  fontWeight: 600,
                }}
              >
                {dateRange}
              </p>
            </div>

            {/* Scope Caption */}
            <p
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '13px',
                color: '#6B7280',
                marginBottom: '16px',
              }}
            >
              Current filters applied
            </p>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg transition-colors"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#6B7280',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  height: '40px',
                }}
                data-i18n="btn_cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'white',
                  backgroundColor: '#F0A500',
                  border: 'none',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  height: '40px',
                }}
                data-i18n="btn_generate_download"
              >
                {isGenerating && <Loader2 size={16} className="animate-spin" />}
                {isGenerating ? 'Generating...' : 'Generate & Download'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-6 right-6 z-[60] bg-white rounded-lg shadow-lg border border-[#E5E7EB] p-4 flex items-center gap-3"
          style={{ minWidth: '300px' }}
        >
          <CheckCircle size={24} color="#059669" />
          <div>
            <p
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '14px',
                fontWeight: 600,
                color: '#0D1B2A',
              }}
            >
              Export Successful!
            </p>
            <p
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '13px',
                color: '#6B7280',
              }}
            >
              Your file has been downloaded.
            </p>
          </div>
        </motion.div>
      )}
    </>
  );
}

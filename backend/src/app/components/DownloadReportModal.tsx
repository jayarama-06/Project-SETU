import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, Download } from 'lucide-react';
import { useState } from 'react';

type ReportFormat = 'pdf' | 'csv';
type DateRange = '7days' | 'month' | 'all';

interface DownloadReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateRange: DateRange;
}

const dateRangeLabels: Record<DateRange, string> = {
  '7days': 'Last 7 Days',
  month: 'This Month',
  all: 'All Time',
};

export function DownloadReportModal({
  isOpen,
  onClose,
  dateRange,
}: DownloadReportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);

    // Simulate report generation delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In production, this would:
    // 1. Call backend API to generate report
    // 2. Get download URL or blob
    // 3. Trigger browser download
    console.log('Generating report:', { format: selectedFormat, dateRange });

    // Simulate download
    const filename = `setu-school-health-${dateRange}-${Date.now()}.${selectedFormat}`;
    alert(`Report "${filename}" would be downloaded here`);

    setIsGenerating(false);
    handleClose();
  };

  const handleClose = () => {
    if (!isGenerating) {
      setSelectedFormat('pdf');
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
            style={{
              backgroundColor: 'rgba(13, 27, 42, 0.64)',
              backdropFilter: 'blur(2px)',
            }}
            onClick={handleClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 right-0 bottom-0 bg-white z-50"
            style={{
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              boxShadow: '0 -4px 24px rgba(13, 27, 42, 0.16)',
              maxHeight: '85vh',
              overflow: 'hidden',
            }}
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div
                style={{
                  width: '40px',
                  height: '4px',
                  backgroundColor: '#E5E7EB',
                  borderRadius: '2px',
                }}
              />
            </div>

            {/* Content */}
            <div style={{ padding: '0 24px 24px 24px' }}>
              {/* Close Button */}
              <button
                onClick={handleClose}
                disabled={isGenerating}
                className="absolute top-4 right-4 min-w-[32px] min-h-[32px] flex items-center justify-center"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  borderRadius: '50%',
                  opacity: isGenerating ? 0.5 : 1,
                }}
                aria-label="Close"
              >
                <X size={20} color="#6B7280" />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: '#E0F2FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Download size={28} color="#0369A1" />
                </div>
              </div>

              {/* Title */}
              <h2
                className="text-center mb-2"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#0D1B2A',
                }}
                data-i18n="modal_download_report_title"
              >
                Download School Report
              </h2>

              {/* Date Range Display */}
              <div
                className="text-center mb-6"
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#F3F4F6',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  margin: '0 auto',
                  width: '100%',
                  justifyContent: 'center',
                }}
              >
                <p
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '13px',
                    color: '#6B7280',
                  }}
                >
                  <span data-i18n="lbl_date_range">Date Range:</span>{' '}
                  <span
                    style={{
                      fontWeight: 600,
                      color: '#0D1B2A',
                    }}
                  >
                    {dateRangeLabels[dateRange]}
                  </span>
                </p>
              </div>

              {/* Format Selection */}
              <div className="mb-6">
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'Noto Sans',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0D1B2A',
                    marginBottom: '12px',
                  }}
                  data-i18n="lbl_format"
                >
                  Select Format
                </label>
                <div className="flex gap-3">
                  {/* PDF Option */}
                  <motion.button
                    whileHover={{ scale: isGenerating ? 1 : 1.02 }}
                    whileTap={{ scale: isGenerating ? 1 : 0.98 }}
                    onClick={() => !isGenerating && setSelectedFormat('pdf')}
                    disabled={isGenerating}
                    style={{
                      flex: 1,
                      minHeight: '72px',
                      padding: '12px',
                      backgroundColor: selectedFormat === 'pdf' ? '#E0F2FE' : 'white',
                      border: selectedFormat === 'pdf' ? '2px solid #0369A1' : '1.5px solid #E5E7EB',
                      borderRadius: '8px',
                      cursor: isGenerating ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.2s',
                      opacity: isGenerating ? 0.6 : 1,
                    }}
                  >
                    <FileText
                      size={24}
                      color={selectedFormat === 'pdf' ? '#0369A1' : '#6B7280'}
                    />
                    <span
                      style={{
                        fontFamily: 'Noto Sans',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: selectedFormat === 'pdf' ? '#0369A1' : '#6B7280',
                      }}
                      data-i18n="opt_pdf"
                    >
                      PDF
                    </span>
                  </motion.button>

                  {/* CSV Option */}
                  <motion.button
                    whileHover={{ scale: isGenerating ? 1 : 1.02 }}
                    whileTap={{ scale: isGenerating ? 1 : 0.98 }}
                    onClick={() => !isGenerating && setSelectedFormat('csv')}
                    disabled={isGenerating}
                    style={{
                      flex: 1,
                      minHeight: '72px',
                      padding: '12px',
                      backgroundColor: selectedFormat === 'csv' ? '#E0F2FE' : 'white',
                      border: selectedFormat === 'csv' ? '2px solid #0369A1' : '1.5px solid #E5E7EB',
                      borderRadius: '8px',
                      cursor: isGenerating ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.2s',
                      opacity: isGenerating ? 0.6 : 1,
                    }}
                  >
                    <FileText
                      size={24}
                      color={selectedFormat === 'csv' ? '#0369A1' : '#6B7280'}
                    />
                    <span
                      style={{
                        fontFamily: 'Noto Sans',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: selectedFormat === 'csv' ? '#0369A1' : '#6B7280',
                      }}
                      data-i18n="opt_csv"
                    >
                      CSV
                    </span>
                  </motion.button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                {/* Generate & Download Button */}
                <motion.button
                  whileHover={isGenerating ? {} : { scale: 1.02 }}
                  whileTap={isGenerating ? {} : { scale: 0.98 }}
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full"
                  style={{
                    minHeight: '48px',
                    backgroundColor: isGenerating ? '#6B7280' : '#0D1B2A',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontFamily: 'Noto Sans',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: isGenerating ? 'none' : '0 2px 8px rgba(13, 27, 42, 0.16)',
                  }}
                  data-i18n="btn_generate_download"
                >
                  {isGenerating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          borderTopColor: 'white',
                        }}
                      />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      <span>Generate & Download</span>
                    </>
                  )}
                </motion.button>

                {/* Cancel Button */}
                <motion.button
                  whileHover={isGenerating ? {} : { scale: 1.02 }}
                  whileTap={isGenerating ? {} : { scale: 0.98 }}
                  onClick={handleClose}
                  disabled={isGenerating}
                  className="w-full"
                  style={{
                    minHeight: '48px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#6B7280',
                    fontFamily: 'Noto Sans',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                    opacity: isGenerating ? 0.5 : 1,
                  }}
                  data-i18n="btn_cancel"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

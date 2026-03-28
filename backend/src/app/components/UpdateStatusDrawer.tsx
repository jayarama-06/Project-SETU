import { motion } from 'motion/react';
import { X, AlertTriangle } from 'lucide-react';

interface UpdateStatusDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  statusNote: string;
  setStatusNote: (note: string) => void;
  onUpdate: () => void;
}

export function UpdateStatusDrawer({
  isOpen,
  onClose,
  selectedStatus,
  setSelectedStatus,
  statusNote,
  setStatusNote,
  onUpdate,
}: UpdateStatusDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: 400 }}
        animate={{ x: 0 }}
        exit={{ x: 400 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed top-0 right-0 bottom-0 bg-white z-50 overflow-y-auto"
        style={{ width: '400px', boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.15)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#E5E7EB] p-6 z-10">
          <div className="flex items-center justify-between mb-2">
            <h2
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '20px',
                fontWeight: 700,
                color: '#0D1B2A',
              }}
              data-i18n="modal_update_status_title"
            >
              Update Issue Status
            </h2>
            <button
              onClick={onClose}
              className="min-w-[32px] min-h-[32px] flex items-center justify-center rounded-lg hover:bg-[#F8F9FA] transition-colors"
            >
              <X size={20} color="#0D1B2A" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Radio Cards */}
          <div className="space-y-3">
            {/* In Progress - Indigo */}
            <label
              className="flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all"
              style={{
                borderColor: selectedStatus === 'In Progress' ? '#6366F1' : '#E5E7EB',
                backgroundColor: selectedStatus === 'In Progress' ? '#EEF2FF' : 'white',
              }}
            >
              <input
                type="radio"
                name="status"
                value="In Progress"
                checked={selectedStatus === 'In Progress'}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{
                  width: '20px',
                  height: '20px',
                  accentColor: '#6366F1',
                  cursor: 'pointer',
                }}
              />
              <div className="flex-1">
                <p
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0D1B2A',
                  }}
                >
                  In Progress
                </p>
                <p
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '12px',
                    color: '#6B7280',
                    marginTop: '2px',
                  }}
                >
                  Issue is being actively worked on
                </p>
              </div>
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: '#6366F1' }}
              />
            </label>

            {/* Awaiting Response - Amber */}
            <label
              className="flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all"
              style={{
                borderColor: selectedStatus === 'Awaiting Response' ? '#F59E0B' : '#E5E7EB',
                backgroundColor: selectedStatus === 'Awaiting Response' ? '#FEF3C7' : 'white',
              }}
            >
              <input
                type="radio"
                name="status"
                value="Awaiting Response"
                checked={selectedStatus === 'Awaiting Response'}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{
                  width: '20px',
                  height: '20px',
                  accentColor: '#F59E0B',
                  cursor: 'pointer',
                }}
              />
              <div className="flex-1">
                <p
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0D1B2A',
                  }}
                >
                  Awaiting Response
                </p>
                <p
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '12px',
                    color: '#6B7280',
                    marginTop: '2px',
                  }}
                >
                  Waiting for feedback or information
                </p>
              </div>
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: '#F59E0B' }}
              />
            </label>

            {/* Resolved - Green */}
            <label
              className="flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all"
              style={{
                borderColor: selectedStatus === 'Resolved' ? '#22C55E' : '#E5E7EB',
                backgroundColor: selectedStatus === 'Resolved' ? '#D1FAE5' : 'white',
              }}
            >
              <input
                type="radio"
                name="status"
                value="Resolved"
                checked={selectedStatus === 'Resolved'}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{
                  width: '20px',
                  height: '20px',
                  accentColor: '#22C55E',
                  cursor: 'pointer',
                }}
              />
              <div className="flex-1">
                <p
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0D1B2A',
                  }}
                >
                  Resolved
                </p>
                <p
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '12px',
                    color: '#6B7280',
                    marginTop: '2px',
                  }}
                >
                  Issue has been successfully resolved
                </p>
              </div>
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: '#22C55E' }}
              />
            </label>
          </div>

          {/* Mandatory Notes Field */}
          <div>
            <label
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '13px',
                fontWeight: 600,
                color: '#0D1B2A',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Action Notes <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <textarea
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="Describe the action taken"
              required
              className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white focus:outline-none focus:border-[#F0A500]"
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '14px',
                color: '#0D1B2A',
                minHeight: '120px',
                resize: 'vertical',
              }}
              data-i18n="placeholder_status_note"
            />
            <p
              className="mt-2"
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '12px',
                color: '#6B7280',
              }}
            >
              {statusNote.trim().length} characters
            </p>
          </div>
        </div>

        {/* Footer - Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-[#E5E7EB] p-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg transition-colors"
              style={{
                height: '48px',
                fontFamily: 'Noto Sans',
                fontSize: '14px',
                fontWeight: 600,
                color: '#6B7280',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              data-i18n="btn_cancel"
            >
              Cancel
            </button>
            <button
              onClick={onUpdate}
              disabled={!selectedStatus || !statusNote.trim()}
              className="flex-1 px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                height: '48px',
                backgroundColor: (!selectedStatus || !statusNote.trim()) ? '#9CA3AF' : '#0D1B2A',
                color: 'white',
                fontFamily: 'Noto Sans',
                fontSize: '14px',
                fontWeight: 600,
                border: 'none',
                cursor: (!selectedStatus || !statusNote.trim()) ? 'not-allowed' : 'pointer',
              }}
              data-i18n="btn_update_confirm"
            >
              Update
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

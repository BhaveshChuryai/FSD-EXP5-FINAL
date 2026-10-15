import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, X } from 'lucide-react'
import './SuccessModal.css'

export default function SuccessModal({
  isOpen,
  onClose,
  title = 'Your request has been submitted successfully!',
  message = 'Thank you for choosing Plottage Hub. Our team will review your property details and contact you regarding the next steps.',
  referenceId,
  doneText = 'Done',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="success-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
          <motion.div
            className="success-modal-container"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close button */}
            <button
              className="success-modal-close"
              onClick={onClose}
              aria-label="Dismiss modal"
            >
              <X size={18} />
            </button>

            {/* Icon */}
            <div className="success-modal-icon-wrap">
              <div className="success-modal-icon-glow" />
              <CheckCircle2 size={36} className="success-modal-icon" />
            </div>

            {/* Content */}
            <h2 className="success-modal-title">{title}</h2>
            <p className="success-modal-message">{message}</p>

            {referenceId && (
              <div className="success-modal-ref">
                <span className="success-modal-ref-label">Reference ID:</span>
                <span className="success-modal-ref-value">{referenceId}</span>
              </div>
            )}

            <div className="success-modal-actions">
              <button
                type="button"
                className="btn btn-gold success-modal-done-btn"
                onClick={onClose}
                autoFocus
              >
                {doneText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

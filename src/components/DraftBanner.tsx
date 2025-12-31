import { FileEdit, X } from "lucide-react";

import "./DraftBanner.css";

interface DraftBannerProps {
  onContinue: () => void;
  onDismiss: () => void;
}

/**
 * Displays a banner when an unsaved template draft exists.
 * Allows users to continue editing the draft or dismiss it with confirmation.
 */
export function DraftBanner({ onContinue, onDismiss }: DraftBannerProps) {
  const handleDismissClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDismiss();
  };

  return (
    <div className="draft-banner" onClick={onContinue}>
      <div className="draft-banner-icon">
        <FileEdit size={20} />
      </div>
      <div className="draft-banner-content">
        <div className="draft-banner-text">You have an unsaved template draft</div>
        <div className="draft-banner-hint">Tap to continue editing</div>
      </div>
      <button
        className="draft-banner-dismiss"
        onClick={handleDismissClick}
        aria-label="Dismiss draft"
      >
        <X size={18} />
      </button>
    </div>
  );
}

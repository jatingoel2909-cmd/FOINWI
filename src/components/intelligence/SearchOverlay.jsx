/**
 * FOINWI Command Center — overlay shell.
 */

function SearchOverlay({ open, onClose, children, dialogRef, onDialogKeyDown }) {
  if (!open) return null;

  return (
    <div className="fi-search-overlay" role="presentation">
      <button
        type="button"
        className="fi-search-overlay__backdrop"
        aria-label="Close search"
        tabIndex={-1}
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        className="fi-search-overlay__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fi-search-command-title"
        onKeyDown={onDialogKeyDown}
      >
        {children}
      </div>
    </div>
  );
}

export default SearchOverlay;

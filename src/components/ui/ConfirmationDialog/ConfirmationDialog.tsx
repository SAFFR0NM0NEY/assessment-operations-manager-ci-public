import { useEffect, useId, useRef, type KeyboardEvent } from 'react';

import { Button } from '../Button';
import styles from './ConfirmationDialog.module.css';

interface ConfirmationDialogProps {
  cancelLabel?: string;
  confirmLabel?: string;
  danger?: boolean;
  description: string;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: string;
}

export function ConfirmationDialog({
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  danger = false,
  description,
  onConfirm,
  onOpenChange,
  open,
  title,
}: ConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);
  const generatedId = useId();
  const titleId = `${generatedId}-title`;
  const descriptionId = `${generatedId}-description`;

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open && !wasOpenRef.current) {
      previousFocusRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
    }

    if (open) {
      if (typeof dialog.showModal === 'function') {
        if (!dialog.open) {
          dialog.showModal();
        }
      } else {
        dialog.setAttribute('open', '');
      }

      const focusTarget = dialog.querySelector<HTMLElement>('[data-dialog-initial-focus]');
      focusTarget?.focus();
    } else if (wasOpenRef.current) {
      if (dialog.open) {
        if (typeof dialog.close === 'function') {
          dialog.close();
        } else {
          dialog.removeAttribute('open');
        }
      } else {
        dialog.removeAttribute('open');
      }

      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    }

    wasOpenRef.current = open;
  }, [open]);

  function closeDialog() {
    onOpenChange(false);
  }

  function confirmDialog() {
    onConfirm();
    onOpenChange(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDialog();
    }
  }

  return (
    <dialog
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      aria-modal="true"
      className={styles.dialog}
      onCancel={(event) => {
        event.preventDefault();
        closeDialog();
      }}
      onKeyDown={handleKeyDown}
      ref={dialogRef}
      role={danger ? 'alertdialog' : 'dialog'}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title} id={titleId}>
            {title}
          </h2>
          <p className={styles.description} id={descriptionId}>
            {description}
          </p>
        </div>
        <div className={styles.actions}>
          <Button data-dialog-initial-focus onClick={closeDialog} variant="ghost">
            {cancelLabel}
          </Button>
          <Button onClick={confirmDialog} variant={danger ? 'danger' : 'primary'}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}

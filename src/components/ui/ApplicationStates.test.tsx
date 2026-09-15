import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithAppProviders } from '../../test/renderWithAppProviders';
import {
  Button,
  ConfirmationDialog,
  EmptyState,
  ErrorState,
  LoadingState,
  SuccessState,
  TextInputField,
} from '.';

function ConfirmationExample({ onConfirm }: { onConfirm: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Open confirmation example
      </Button>
      <ConfirmationDialog
        cancelLabel="Cancel"
        confirmLabel="Clear preview"
        danger
        description="This only changes a temporary preview and does not delete records."
        onConfirm={onConfirm}
        onOpenChange={setIsOpen}
        open={isOpen}
        title="Clear this temporary preview?"
      />
    </>
  );
}

describe('reusable application states', () => {
  it('renders loading text with status and busy semantics', () => {
    renderWithAppProviders(
      <LoadingState
        description="The requested area is being prepared."
        title="Loading preview content"
      />,
    );

    const loadingState = screen.getByRole('status');
    expect(loadingState).toHaveAttribute('aria-busy', 'true');
    expect(within(loadingState).getByText(/loading preview content/i)).toBeVisible();
    expect(within(loadingState).getByText(/requested area is being prepared/i)).toBeVisible();
  });

  it('renders empty-state title, description, and keyboard-accessible action', async () => {
    const user = userEvent.setup();
    const action = vi.fn();

    renderWithAppProviders(
      <EmptyState
        action={
          <Button
            onClick={() => {
              action();
            }}
            variant="secondary"
          >
            Start preview
          </Button>
        }
        description="There is no generic preview content to show."
        title="No preview content"
      />,
    );

    expect(screen.getByText(/no preview content/i)).toBeVisible();
    expect(screen.getByText(/no generic preview content/i)).toBeVisible();

    await user.tab();
    expect(screen.getByRole('button', { name: /start preview/i })).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('renders a safe recoverable error message and runs the retry callback', async () => {
    const user = userEvent.setup();
    const retry = vi.fn();

    renderWithAppProviders(
      <ErrorState
        message="The preview could not continue. Try again or continue with another area."
        onRetry={() => {
          retry();
        }}
        referenceCode="PREVIEW-ONLY"
        title="Preview issue"
      />,
    );

    const errorState = screen.getByRole('alert');
    expect(within(errorState).getByText(/preview could not continue/i)).toBeVisible();
    expect(within(errorState).getByText(/reference: preview-only/i)).toBeVisible();
    expect(screen.queryByText(/stack trace/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/sql/i)).not.toBeInTheDocument();

    await user.click(within(errorState).getByRole('button', { name: /retry/i }));
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it('renders success feedback with polite status semantics', () => {
    renderWithAppProviders(
      <SuccessState
        message="The generic preview completed without changing stored data."
        title="Preview complete"
      />,
    );

    const successState = screen.getByRole('status');
    expect(successState).toHaveAttribute('aria-live', 'polite');
    expect(within(successState).getByText(/^preview complete$/i)).toBeVisible();
    expect(within(successState).getByText(/without changing stored data/i)).toBeVisible();
  });

  it('associates validation and supporting messages with the form control', () => {
    renderWithAppProviders(
      <TextInputField
        errorText="Example value is required."
        helpText="Supporting text remains connected."
        id="example-validation-field"
        label="Example validated field"
      />,
    );

    const control = screen.getByLabelText(/example validated field/i);
    expect(control).toHaveAttribute('aria-invalid', 'true');
    expect(control).toHaveAttribute(
      'aria-describedby',
      'example-validation-field-help example-validation-field-error',
    );
    expect(control).toHaveAccessibleDescription(
      /supporting text remains connected.*example value is required/i,
    );
    expect(screen.getByText(/example value is required/i)).toHaveAttribute(
      'id',
      'example-validation-field-error',
    );
  });

  it('opens, names, cancels, and returns focus from the confirmation dialog', async () => {
    const user = userEvent.setup();
    const confirm = vi.fn();

    renderWithAppProviders(<ConfirmationExample onConfirm={confirm} />);

    const trigger = screen.getByRole('button', { name: /open confirmation example/i });
    await user.click(trigger);

    const dialog = screen.getByRole('alertdialog', {
      name: /clear this temporary preview/i,
    });
    expect(within(dialog).getByText(/does not delete records/i)).toBeVisible();
    expect(within(dialog).getByRole('button', { name: /cancel/i })).toHaveFocus();

    await user.click(within(dialog).getByRole('button', { name: /cancel/i }));

    expect(confirm).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it('confirms once and closes the confirmation dialog', async () => {
    const user = userEvent.setup();
    const confirm = vi.fn();

    renderWithAppProviders(<ConfirmationExample onConfirm={confirm} />);

    await user.click(screen.getByRole('button', { name: /open confirmation example/i }));
    const dialog = screen.getByRole('alertdialog', {
      name: /clear this temporary preview/i,
    });

    await user.click(within(dialog).getByRole('button', { name: /clear preview/i }));

    expect(confirm).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  });

  it('closes the confirmation dialog with Escape where keyboard events are supported', async () => {
    const user = userEvent.setup();

    renderWithAppProviders(<ConfirmationExample onConfirm={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /open confirmation example/i }));
    expect(
      screen.getByRole('alertdialog', { name: /clear this temporary preview/i }),
    ).toBeVisible();

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  });
});

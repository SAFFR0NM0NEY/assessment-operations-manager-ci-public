import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';

import { classNames } from '../../../lib/classNames';
import { ValidationMessage } from '../ValidationMessage';
import styles from './FormField.module.css';

interface BaseFieldProps {
  className?: string;
  errorText?: string;
  helpText?: string;
  id?: string;
  label: string;
}

interface FieldShellProps extends BaseFieldProps {
  children: (controlId: string, describedBy: string | undefined) => ReactNode;
}

function FieldShell({ children, className, errorText, helpText, id, label }: FieldShellProps) {
  const generatedId = useId();
  const controlId = id ?? `${generatedId}-control`;
  const helpId = helpText ? `${controlId}-help` : undefined;
  const errorId = errorText ? `${controlId}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={classNames(styles.field, className)}>
      <label className={styles.label} htmlFor={controlId}>
        {label}
      </label>
      {children(controlId, describedBy)}
      {helpText && helpId ? (
        <ValidationMessage id={helpId} variant="supporting">
          {helpText}
        </ValidationMessage>
      ) : null}
      {errorText && errorId ? (
        <ValidationMessage id={errorId} variant="error">
          {errorText}
        </ValidationMessage>
      ) : null}
    </div>
  );
}

type TextInputFieldProps = BaseFieldProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'aria-describedby' | 'className' | 'id'>;

export function TextInputField({
  className,
  errorText,
  helpText,
  id,
  label,
  ...inputProps
}: TextInputFieldProps) {
  return (
    <FieldShell
      className={className}
      errorText={errorText}
      helpText={helpText}
      id={id}
      label={label}
    >
      {(controlId, describedBy) => (
        <input
          {...inputProps}
          aria-describedby={describedBy}
          aria-invalid={errorText ? true : undefined}
          className={classNames(styles.control, errorText && styles.errorControl)}
          id={controlId}
        />
      )}
    </FieldShell>
  );
}

interface SelectOption {
  disabled?: boolean;
  label: string;
  value: string;
}

type SelectFieldProps = BaseFieldProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, 'aria-describedby' | 'className' | 'id'> & {
    options: SelectOption[];
    placeholder?: string;
  };

export function SelectField({
  className,
  errorText,
  helpText,
  id,
  label,
  options,
  placeholder,
  ...selectProps
}: SelectFieldProps) {
  return (
    <FieldShell
      className={className}
      errorText={errorText}
      helpText={helpText}
      id={id}
      label={label}
    >
      {(controlId, describedBy) => (
        <select
          {...selectProps}
          aria-describedby={describedBy}
          aria-invalid={errorText ? true : undefined}
          className={classNames(styles.control, errorText && styles.errorControl)}
          id={controlId}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option disabled={option.disabled} key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  );
}

type TextareaFieldProps = BaseFieldProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'aria-describedby' | 'className' | 'id'>;

export function TextareaField({
  className,
  errorText,
  helpText,
  id,
  label,
  ...textareaProps
}: TextareaFieldProps) {
  return (
    <FieldShell
      className={className}
      errorText={errorText}
      helpText={helpText}
      id={id}
      label={label}
    >
      {(controlId, describedBy) => (
        <textarea
          {...textareaProps}
          aria-describedby={describedBy}
          aria-invalid={errorText ? true : undefined}
          className={classNames(styles.control, styles.textarea, errorText && styles.errorControl)}
          id={controlId}
        />
      )}
    </FieldShell>
  );
}

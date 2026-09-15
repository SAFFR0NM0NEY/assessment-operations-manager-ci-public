import { useState } from 'react';

import { ProjectIdentity } from '../../components/project-identity';
import {
  Button,
  Card,
  ConfirmationDialog,
  DataTable,
  type DataTableColumn,
  EmptyState,
  ErrorState,
  Inline,
  LoadingState,
  Section,
  SelectField,
  Stack,
  StatusBadge,
  SuccessState,
  TextareaField,
  TextInputField,
} from '../../components/ui';
import styles from './FoundationPage.module.css';

interface PreviewRow {
  area: string;
  purpose: string;
  status: string;
}

const previewRows: PreviewRow[] = [
  {
    area: 'Design-system route',
    purpose: 'Reusable preview at /design-system',
    status: 'Implemented',
  },
  {
    area: 'Provider boundary',
    purpose: 'Browser router and query client wiring',
    status: 'Implemented',
  },
  {
    area: 'Visual primitives',
    purpose: 'Shared buttons, forms, cards, badges, and tables',
    status: 'Shared visual foundation',
  },
];

const previewColumns: DataTableColumn<PreviewRow>[] = [
  {
    header: 'Area',
    key: 'area',
    render: (row) => row.area,
  },
  {
    header: 'Purpose',
    key: 'purpose',
    render: (row) => row.purpose,
  },
  {
    header: 'Status',
    key: 'status',
    render: (row) => row.status,
  },
];

export function FoundationPage() {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isPreviewConfirmed, setIsPreviewConfirmed] = useState(false);

  function openConfirmationPreview() {
    setIsPreviewConfirmed(false);
    setIsConfirmationOpen(true);
  }

  return (
    <main className={styles.page} aria-labelledby="app-title">
      <div className="app-page">
        <header className={styles.hero}>
          <div className={styles.eyebrowRow}>
            <img
              alt="AOM"
              className={styles.brandLogo}
              height="48"
              src="/branding/aom-mark.svg"
              width="163"
            />
            <ProjectIdentity showOnlineNote variant="panel" />
            <StatusBadge variant="info">Reference design system</StatusBadge>
          </div>
          <Stack gap="medium">
            <h1 className={styles.title} id="app-title">
              Assessment Operations Manager
            </h1>
            <p className={styles.summary}>Application visual system preview</p>
          </Stack>
        </header>

        <Section
          description="Reusable visual primitives for the reference build. These examples are generic and do not add operational workflows."
          title="Design System Preview"
        >
          <div className={styles.previewGrid}>
            <Card
              description="Action styles cover common emphasis levels without introducing a UI framework."
              title="Buttons"
            >
              <Inline gap="small">
                <Button>Primary action</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button disabled variant="secondary">
                  Disabled
                </Button>
              </Inline>
            </Card>

            <Card
              description="Status colours always appear with readable text labels."
              title="Status Badges"
            >
              <Inline gap="small">
                <StatusBadge>Reference</StatusBadge>
                <StatusBadge variant="info">Information</StatusBadge>
                <StatusBadge variant="success">Ready</StatusBadge>
                <StatusBadge variant="warning">Needs review</StatusBadge>
                <StatusBadge variant="danger">Restricted</StatusBadge>
              </Inline>
            </Card>

            <Card
              className={styles.fullWidth}
              description="Label, help, disabled, and error states are styled for later form workflows."
              title="Form Controls"
            >
              <div className={styles.controlGrid}>
                <TextInputField
                  helpText="Example helper text for later searchable fields."
                  label="Example search field"
                  placeholder="Search a reference label"
                  type="search"
                />
                <SelectField
                  defaultValue="all"
                  helpText="Example select styling without workflow logic."
                  label="Example filter"
                  options={[
                    { label: 'All examples', value: 'all' },
                    { label: 'Ready examples', value: 'ready' },
                    { label: 'Review examples', value: 'review' },
                  ]}
                />
                <TextInputField
                  defaultValue="Locked until a later workflow step"
                  disabled
                  helpText="Disabled fields remain readable and non-interactive."
                  label="Disabled example field"
                />
                <TextareaField
                  className={styles.spanColumns}
                  errorText="Example validation message styling."
                  label="Example note"
                  placeholder="Short internal note placeholder"
                />
              </div>
            </Card>

            <div className={styles.fullWidth}>
              <Section
                description="Reusable loading, empty, error, success, validation, and confirmation states for future reference workflows. These examples are generic and do not call services or modify stored data."
                id="system-states"
                title="System States"
              >
                <div className={styles.stateGrid}>
                  <LoadingState
                    description="Use this when content is actively being requested by a later real workflow."
                    title="Loading preview content"
                  />
                  <EmptyState
                    action={
                      <Button onClick={openConfirmationPreview} variant="secondary">
                        Open confirmation example
                      </Button>
                    }
                    description="Use this when a valid area has no records or content to show. This preview does not imply data was lost."
                    label="Empty example"
                    title="No preview content to display"
                  />
                  <ErrorState
                    message="A recoverable issue can be explained safely without stack traces, SQL messages, credentials, or internal file paths."
                    onRetry={() => undefined}
                    referenceCode="PREVIEW-ONLY"
                    retryLabel="Retry preview"
                    title="Preview action could not continue"
                  />
                  <SuccessState
                    message="Use success states for real completed operations later. This example confirms only that the visual pattern renders."
                    title="Preview state ready"
                  />
                  <div className={styles.validationPreview}>
                    <TextInputField
                      errorText="Example validation message for a required preview value."
                      helpText="Supporting text remains associated with the same control."
                      id="validation-preview-field"
                      label="Validation example"
                      placeholder="Safe preview value"
                    />
                  </div>
                  {isPreviewConfirmed ? (
                    <SuccessState
                      message="The temporary preview changed only for this page view. No storage, service, or database was touched."
                      title="Preview action confirmed"
                    />
                  ) : null}
                </div>
                <ConfirmationDialog
                  cancelLabel="Cancel"
                  confirmLabel="Clear preview"
                  danger
                  description="This only changes the local design-system preview for the current page view. It does not delete data, call a service, or modify a database."
                  onConfirm={() => {
                    setIsPreviewConfirmed(true);
                  }}
                  onOpenChange={setIsConfirmationOpen}
                  open={isConfirmationOpen}
                  title="Clear this temporary preview?"
                />
              </Section>
            </div>

            <Card
              className={styles.fullWidth}
              description="Semantic table markup and responsive scrolling are ready for future feature pages."
              title="Table Foundation"
            >
              <Stack gap="medium">
                <p className={styles.subtleText}>
                  The table below uses generic implementation areas only.
                </p>
                <DataTable
                  caption="Generic design-system table preview"
                  columns={previewColumns}
                  getRowKey={(row) => row.area}
                  rows={previewRows}
                />
              </Stack>
            </Card>
          </div>
        </Section>
      </div>
    </main>
  );
}

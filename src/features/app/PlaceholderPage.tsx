import { useMemo, useState, type CSSProperties } from 'react';

import { PageHeader } from '../../components/app-shell';
import {
  Button,
  Card,
  DataTable,
  Inline,
  Section,
  SelectField,
  Stack,
  StatusBadge,
  TextInputField,
  type DataTableColumn,
  type StatusBadgeVariant,
} from '../../components/ui';
import { classNames } from '../../lib/classNames';
import type { AppRouteMeta } from '../../types/navigation';
import styles from './PlaceholderPage.module.css';

interface PlaceholderPageProps {
  route: AppRouteMeta;
}

interface MetricPreview {
  helper: string;
  label: string;
  tone: 'amber' | 'blue' | 'green' | 'navy' | 'red';
  value: string;
}

interface ProgressPreview {
  label: string;
  note: string;
  tone: 'amber' | 'blue' | 'green';
  value: number;
}

interface StudentPreviewRow {
  campus: string;
  enrolmentType: string;
  name: string;
  nextReview: string;
  programme: string;
  progress: number;
  status: string;
  studentNumber: string;
}

interface ExamPreviewRow {
  code: string;
  name: string;
  programmeUse: string;
  provider: string;
  status: string;
}

interface SourceLabelPreviewRow {
  confirmation: string;
  label: string;
  treatment: string;
}

interface WorkAreaPreview {
  description: string;
  status: string;
  title: string;
}

const overviewMetrics: MetricPreview[] = [
  {
    helper: 'Synthetic enrolments in this static preview',
    label: 'Total Students',
    tone: 'navy',
    value: '36',
  },
  {
    helper: 'Presentation-only booking queue count',
    label: 'Booked',
    tone: 'blue',
    value: '8',
  },
  {
    helper: 'Waiting for later workflow definition',
    label: 'Pending',
    tone: 'amber',
    value: '5',
  },
  {
    helper: 'Synthetic passed-result total',
    label: 'Passed',
    tone: 'green',
    value: '24',
  },
  {
    helper: 'Synthetic follow-up result count',
    label: 'Failed',
    tone: 'red',
    value: '4',
  },
  {
    helper: 'Derived workflow preview only',
    label: 'Rewrite Required',
    tone: 'amber',
    value: '3',
  },
];

const overviewProgress: ProgressPreview[] = [
  {
    label: 'Passed requirements',
    note: 'Calculated later from attempts and requirements',
    tone: 'green',
    value: 67,
  },
  {
    label: 'Booked exams',
    note: 'Requires booking records in a later phase',
    tone: 'blue',
    value: 22,
  },
  {
    label: 'Pending review',
    note: 'Pending meaning still needs product-owner confirmation',
    tone: 'amber',
    value: 14,
  },
  {
    label: 'Rewrite attention',
    note: 'Derived from failed attempts in future workflows',
    tone: 'amber',
    value: 8,
  },
];

const attentionItems = [
  'Pending remains an unresolved operational meaning until the product owner confirms it.',
  'Rewrite Required is shown as derived workflow information, not a replacement for Failed.',
  'All counts on this page are static synthetic presentation values.',
];

const studentPreviewRows: StudentPreviewRow[] = [
  {
    campus: 'North Campus - Reference Context',
    enrolmentType: 'Standard',
    name: 'Reference Learner 001',
    nextReview: 'Pending result review',
    programme: 'Network Operations',
    progress: 72,
    status: 'Active preview',
    studentNumber: 'REF-1001',
  },
  {
    campus: 'North Campus - Reference Context',
    enrolmentType: 'Specialist',
    name: 'Reference Learner 002',
    nextReview: 'Rewrite follow-up',
    programme: 'Network Operations',
    progress: 48,
    status: 'Follow-up preview',
    studentNumber: 'REF-1002',
  },
  {
    campus: 'South Campus - Reference Context',
    enrolmentType: 'Standard',
    name: 'Reference Learner 003',
    nextReview: 'Booking confirmation',
    programme: 'Application Development',
    progress: 61,
    status: 'Active preview',
    studentNumber: 'REF-1003',
  },
  {
    campus: 'East Campus - Reference Context',
    enrolmentType: 'Standard',
    name: 'Reference Learner 004',
    nextReview: 'No current alert',
    programme: 'Application Development',
    progress: 88,
    status: 'Active preview',
    studentNumber: 'REF-1004',
  },
  {
    campus: 'West Campus - Reference Context',
    enrolmentType: 'Specialist',
    name: 'Reference Learner 005',
    nextReview: 'Requirement applicability review',
    programme: 'Network Operations',
    progress: 35,
    status: 'Review preview',
    studentNumber: 'REF-1005',
  },
];

const programmeFilterOptions = [
  { label: 'All programmes', value: 'all' },
  { label: 'Network Operations', value: 'Network Operations' },
  { label: 'Application Development', value: 'Application Development' },
];

const statusFilterOptions = [
  { label: 'All preview statuses', value: 'all' },
  { label: 'Active preview', value: 'Active preview' },
  { label: 'Follow-up preview', value: 'Follow-up preview' },
  { label: 'Review preview', value: 'Review preview' },
];

const examPreviewRows: ExamPreviewRow[] = [
  {
    code: 'REF-EX-001',
    name: 'Reference Assessment 001',
    programmeUse: 'Network Operations preview requirement',
    provider: 'Provider pending',
    status: 'Preview',
  },
  {
    code: 'REF-EX-002',
    name: 'Reference Assessment 002',
    programmeUse: 'Application Development preview requirement',
    provider: 'Provider pending',
    status: 'Preview',
  },
  {
    code: 'REF-EX-003',
    name: 'Reference Assessment 003',
    programmeUse: 'Shared preview requirement',
    provider: 'Provider pending',
    status: 'Preview',
  },
];

const sourceLabelPreviewRows: SourceLabelPreviewRow[] = [
  {
    confirmation: 'Do not merge with similar labels without authoritative confirmation.',
    label: 'Legacy Label A',
    treatment: 'Exact source label placeholder',
  },
  {
    confirmation: 'Keep separate until catalogue mapping is approved.',
    label: 'Legacy Label B',
    treatment: 'Exact source label placeholder',
  },
  {
    confirmation: 'Do not expand or define without product-owner confirmation.',
    label: 'Short Code C',
    treatment: 'Exact source label placeholder',
  },
];

const reportAreas: WorkAreaPreview[] = [
  {
    description: 'Future live summary once requirements, attempts, and campus access exist.',
    status: 'Later phase',
    title: 'Campus Results',
  },
  {
    description: 'Future programme progress rollups from normalised requirement records.',
    status: 'Later phase',
    title: 'Programme Progress',
  },
  {
    description: 'Future exam performance view after canonical exams and attempts are stored.',
    status: 'Later phase',
    title: 'Exam Performance',
  },
  {
    description: 'Future controlled result exports after permissions and privacy checks exist.',
    status: 'No export action',
    title: 'Export Centre',
  },
];

const administrationAreas: WorkAreaPreview[] = [
  {
    description: 'Future reference records for campuses, programmes, and available offerings.',
    status: 'Modelled later',
    title: 'Campuses & Programmes',
  },
  {
    description: 'Future canonical exams and source-label mapping after approvals exist.',
    status: 'Modelled later',
    title: 'Exam Catalogue',
  },
  {
    description: 'Deferred to scoped user/access work. No permissions are implemented here.',
    status: 'Not yet available',
    title: 'Users & Access',
  },
  {
    description: 'Future reset and data-safety controls for the isolated reference environment.',
    status: 'Later phase',
    title: 'Reference Environment & Data Controls',
  },
];

function getStudentStatusVariant(status: string): StatusBadgeVariant {
  if (status === 'Active preview') {
    return 'success';
  }

  if (status === 'Review preview' || status === 'Follow-up preview') {
    return 'warning';
  }

  return 'neutral';
}

function ProgressBar({
  compact = false,
  label,
  tone = 'blue',
  value,
}: {
  compact?: boolean;
  label: string;
  tone?: ProgressPreview['tone'];
  value: number;
}) {
  const progressValue = `${value.toString()}%`;

  return (
    <div className={styles.progressBar}>
      <div className={classNames(styles.progressHeader, compact && styles.compactProgressHeader)}>
        {compact ? (
          <span className={styles.progressPercent}>{progressValue}</span>
        ) : (
          <>
            <span>{label}</span>
            <span>{progressValue}</span>
          </>
        )}
      </div>
      <div aria-label={`${label}: ${progressValue}`} className={styles.progressTrack} role="img">
        <span
          className={classNames(
            styles.progressFill,
            tone === 'green' && styles.fillGreen,
            tone === 'amber' && styles.fillAmber,
            tone === 'blue' && styles.fillBlue,
          )}
          style={{ '--progress-value': progressValue } as CSSProperties}
        />
      </div>
    </div>
  );
}

const studentColumns: DataTableColumn<StudentPreviewRow>[] = [
  {
    header: 'Student Number',
    key: 'studentNumber',
    render: (row) => <strong>{row.studentNumber}</strong>,
  },
  {
    header: 'Student',
    key: 'name',
    render: (row) => row.name,
  },
  {
    header: 'Programme',
    key: 'programme',
    render: (row) => row.programme,
  },
  {
    header: 'Campus',
    key: 'campus',
    render: (row) => row.campus,
  },
  {
    header: 'Enrolment',
    key: 'enrolmentType',
    render: (row) => row.enrolmentType,
  },
  {
    header: 'Status',
    key: 'status',
    render: (row) => (
      <StatusBadge variant={getStudentStatusVariant(row.status)}>{row.status}</StatusBadge>
    ),
  },
  {
    header: 'Progress',
    key: 'progress',
    render: (row) => <ProgressBar compact label="Student progress" value={row.progress} />,
  },
  {
    header: 'Next Review',
    key: 'nextReview',
    render: (row) => row.nextReview,
  },
];

const examColumns: DataTableColumn<ExamPreviewRow>[] = [
  {
    header: 'Canonical Exam',
    key: 'name',
    render: (row) => <strong>{row.name}</strong>,
  },
  {
    header: 'Internal Code',
    key: 'code',
    render: (row) => row.code,
  },
  {
    header: 'Provider',
    key: 'provider',
    render: (row) => row.provider,
  },
  {
    header: 'Programme Use',
    key: 'programmeUse',
    render: (row) => row.programmeUse,
  },
  {
    header: 'Status',
    key: 'status',
    render: (row) => <StatusBadge variant="info">{row.status}</StatusBadge>,
  },
];

const sourceLabelColumns: DataTableColumn<SourceLabelPreviewRow>[] = [
  {
    header: 'Source Label',
    key: 'label',
    render: (row) => <strong>{row.label}</strong>,
  },
  {
    header: 'Treatment',
    key: 'treatment',
    render: (row) => row.treatment,
  },
  {
    header: 'Confirmation Needed',
    key: 'confirmation',
    render: (row) => row.confirmation,
  },
];

function OverviewPreview({ route }: { route: AppRouteMeta }) {
  return (
    <>
      <PageHeader
        actions={<StatusBadge variant="info">Static synthetic preview</StatusBadge>}
        description={route.description}
        title={route.pageTitle}
      />

      <section aria-labelledby="overview-snapshot-title" className={styles.snapshotBand}>
        <Stack gap="medium">
          <div className={styles.sectionLead}>
            <span className={styles.kicker}>Assessment operations snapshot</span>
            <h2 id="overview-snapshot-title">Reference assessment control view</h2>
            <p>
              A presentation-only dashboard preview for layout, rhythm, and information hierarchy.
              It does not read from the private workbook, a database, or a service.
            </p>
          </div>
          <dl className={styles.metricsGrid}>
            {overviewMetrics.map((metric) => (
              <div
                className={classNames(styles.metricTile, styles[metric.tone])}
                key={metric.label}
              >
                <dt>{metric.label}</dt>
                <dd>{metric.value}</dd>
                <p>{metric.helper}</p>
              </div>
            ))}
          </dl>
        </Stack>
      </section>

      <div className={styles.dashboardGrid}>
        <Card
          description="CSS-only progress preview using synthetic counts. Live calculations arrive in later phases."
          title="Requirement Progress"
        >
          <Stack gap="medium">
            {overviewProgress.map((item) => (
              <div className={styles.progressRow} key={item.label}>
                <ProgressBar label={item.label} tone={item.tone} value={item.value} />
                <p>{item.note}</p>
              </div>
            ))}
          </Stack>
        </Card>

        <Card
          description="Items that must remain visible before operational workflows are implemented."
          title="Attention Area"
        >
          <ul className={styles.attentionList}>
            {attentionItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}

function StudentsPreview({
  filteredStudents,
  programmeFilter,
  search,
  setProgrammeFilter,
  setSearch,
  setStatusFilter,
  statusFilter,
}: {
  filteredStudents: StudentPreviewRow[];
  programmeFilter: string;
  search: string;
  setProgrammeFilter: (value: string) => void;
  setSearch: (value: string) => void;
  setStatusFilter: (value: string) => void;
  statusFilter: string;
}) {
  return (
    <>
      <PageHeader
        actions={
          <Button disabled size="small" variant="secondary">
            Add student unavailable
          </Button>
        }
        description="Presentation-only student management layout with local synthetic rows. No records are created, loaded, or saved."
        title="Students"
      />

      <Section
        description="Filters run only against the synthetic rows rendered in this page view."
        title="Student Management Preview"
      >
        <div className={styles.filterPanel}>
          <TextInputField
            label="Search synthetic students"
            onChange={(event) => {
              setSearch(event.currentTarget.value);
            }}
            placeholder="Search reference name, number, campus, or programme"
            type="search"
            value={search}
          />
          <SelectField
            label="Programme filter"
            onChange={(event) => {
              setProgrammeFilter(event.currentTarget.value);
            }}
            options={programmeFilterOptions}
            value={programmeFilter}
          />
          <SelectField
            label="Preview status filter"
            onChange={(event) => {
              setStatusFilter(event.currentTarget.value);
            }}
            options={statusFilterOptions}
            value={statusFilter}
          />
        </div>
        <Inline className={styles.tableSummary} justify="between">
          <p>{filteredStudents.length} synthetic preview records shown.</p>
          <StatusBadge>Presentation only</StatusBadge>
        </Inline>
        <DataTable
          caption="Synthetic presentation-only student records"
          columns={studentColumns}
          getRowKey={(row) => row.studentNumber}
          rows={filteredStudents}
        />
      </Section>
    </>
  );
}

function ExamsPreview({ route }: { route: AppRouteMeta }) {
  return (
    <>
      <PageHeader
        actions={<StatusBadge variant="info">Catalogue preview only</StatusBadge>}
        description={route.description}
        title={route.pageTitle}
      />

      <div className={styles.splitGrid}>
        <Card
          description="Generic canonical placeholders show the intended management surface without inventing official exam names, providers, or codes."
          title="Canonical Exam Placeholders"
        >
          <DataTable
            caption="Generic synthetic canonical exam preview"
            columns={examColumns}
            getRowKey={(row) => row.code}
            rows={examPreviewRows}
          />
        </Card>

        <Card
          description="Observed workbook labels may be preserved as source metadata, but they are not canonicalised here."
          title="Unresolved Source Label Examples"
        >
          <Stack gap="medium">
            <DataTable
              caption="Source-label examples that are not canonical exams"
              columns={sourceLabelColumns}
              getRowKey={(row) => row.label}
              rows={sourceLabelPreviewRows}
            />
            <p className={styles.subtleText}>
              These labels remain generic source-label placeholders only in this preview. This
              checkpoint does not define providers or merge ambiguous labels.
            </p>
          </Stack>
        </Card>
      </div>
    </>
  );
}

function ReportsPreview({ route }: { route: AppRouteMeta }) {
  return (
    <>
      <PageHeader
        actions={<StatusBadge>Non-functional preview</StatusBadge>}
        description={route.description}
        title={route.pageTitle}
      />

      <Section
        description="Report surfaces are represented intentionally, but no export or download action exists."
        title="Reporting Areas"
      >
        <div className={styles.areaGrid}>
          {reportAreas.map((area) => (
            <Card
              footer={
                <StatusBadge variant={area.status === 'No export action' ? 'warning' : 'neutral'}>
                  {area.status}
                </StatusBadge>
              }
              key={area.title}
              title={area.title}
            >
              <p className={styles.cardCopy}>{area.description}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}

function AdministrationPreview({ route }: { route: AppRouteMeta }) {
  return (
    <>
      <PageHeader
        actions={<StatusBadge variant="warning">Preview only</StatusBadge>}
        description={route.description}
        title={route.pageTitle}
      />

      <Section
        description="Administrative areas are shown as product structure only. They do not create users, permissions, records, or environment controls."
        title="Administration Areas"
      >
        <div className={styles.areaGrid}>
          {administrationAreas.map((area) => (
            <Card
              footer={<StatusBadge>{area.status}</StatusBadge>}
              key={area.title}
              title={area.title}
            >
              <p className={styles.cardCopy}>{area.description}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}

export function PlaceholderPage({ route }: PlaceholderPageProps) {
  const [studentSearch, setStudentSearch] = useState('');
  const [programmeFilter, setProgrammeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredStudents = useMemo(() => {
    const normalizedSearch = studentSearch.trim().toLowerCase();

    return studentPreviewRows.filter((student) => {
      const matchesProgramme = programmeFilter === 'all' || student.programme === programmeFilter;
      const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [
          student.studentNumber,
          student.name,
          student.campus,
          student.programme,
          student.enrolmentType,
          student.status,
        ].some((value) => value.toLowerCase().includes(normalizedSearch));

      return matchesProgramme && matchesStatus && matchesSearch;
    });
  }, [programmeFilter, statusFilter, studentSearch]);

  return (
    <article className={styles.page}>
      {route.id === 'overview' ? <OverviewPreview route={route} /> : null}
      {route.id === 'students' ? (
        <StudentsPreview
          filteredStudents={filteredStudents}
          programmeFilter={programmeFilter}
          search={studentSearch}
          setProgrammeFilter={setProgrammeFilter}
          setSearch={setStudentSearch}
          setStatusFilter={setStatusFilter}
          statusFilter={statusFilter}
        />
      ) : null}
      {route.id === 'exams' ? <ExamsPreview route={route} /> : null}
      {route.id === 'reports' ? <ReportsPreview route={route} /> : null}
      {route.id === 'administration' ? <AdministrationPreview route={route} /> : null}
    </article>
  );
}

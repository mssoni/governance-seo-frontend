import type { GovernanceReport } from '../../types/api'
import ExecutiveSummary from './ExecutiveSummary'
import MetricsCards from './MetricsCards'
import IssuesList from './IssuesList'
import ChecklistSection from './ChecklistSection'
import LimitationsSection from './LimitationsSection'

export default function GovernanceContent({ report }: { report: GovernanceReport }) {
  return (
    <>
      <ExecutiveSummary summary={report.summary} />
      <MetricsCards metrics={report.metrics} />
      <IssuesList issues={report.issues} />
      <ChecklistSection items={report.checklist_30d} />
      <LimitationsSection limitations={report.limitations} />
    </>
  )
}

import type { GovernanceReport } from '../../types/api'
import ExecutiveStory from './ExecutiveStory'
import BusinessImpactCategories from './BusinessImpactCategories'
import TopImprovements from './TopImprovements'

export default function BusinessContent({
  report,
  onSwitchToTechnical,
}: {
  report: GovernanceReport
  onSwitchToTechnical: () => void
}) {
  // CHG-016: Filter for high-confidence observed issues only in Business Overview
  // Technical Details tab still shows all issues
  const highConfidenceIssues = report.issues.filter(
    (issue) => issue.confidence === 'high' && issue.detected_as === 'observed'
  )

  return (
    <>
      <ExecutiveStory
        narrative={report.summary.executive_narrative}
        whatsWorking={report.summary.whats_working}
        needsAttention={report.summary.needs_attention}
        issueInsights={report.issue_insights}
      />
      <BusinessImpactCategories
        issues={highConfidenceIssues}
        categoryInsights={report.category_insights}
      />
      <TopImprovements
        improvements={report.top_improvements}
        onSwitchToTechnical={onSwitchToTechnical}
      />
    </>
  )
}

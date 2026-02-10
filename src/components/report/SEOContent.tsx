import type { SEOReport } from '../../types/api'
import CompetitorTable from './CompetitorTable'
import StrengthsGaps from './StrengthsGaps'
import SEOActionPlan from './SEOActionPlan'

export default function SEOContent({ report }: { report: SEOReport }) {
  const userRow = report.competitor_table[0]
  const competitors = report.competitor_table.slice(1)

  return (
    <>
      <CompetitorTable userRow={userRow} competitors={competitors} />
      <StrengthsGaps
        competitorAdvantages={report.competitor_advantages}
        userStrengths={report.user_strengths}
        gaps={report.gaps}
      />
      <SEOActionPlan plan={report.plan_30d} />
    </>
  )
}

import type { Issue, TopImprovement } from '../../types/api'
import type { TabId } from './ReportTabs'
import BusinessSidePanel from './BusinessSidePanel'
import TechnicalSidePanel from './TechnicalSidePanel'

interface SidePanelProps {
  issues: Issue[]
  topImprovements?: TopImprovement[]
  activeTab?: TabId
}

export default function SidePanel({ issues, topImprovements, activeTab }: SidePanelProps) {
  if (activeTab === 'business' && topImprovements && topImprovements.length > 0) {
    return <BusinessSidePanel topImprovements={topImprovements} />
  }

  return <TechnicalSidePanel issues={issues} />
}

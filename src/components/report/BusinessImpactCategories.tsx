import type { CategoryInsight, Issue } from '../../types/api'
import PersonalizedCategoryCards from './PersonalizedCategoryCards'
import LegacyCategoryCards from './LegacyCategoryCards'

interface BusinessImpactCategoriesProps {
  issues: Issue[]
  categoryInsights?: CategoryInsight[]
}

export default function BusinessImpactCategories({
  issues,
  categoryInsights,
}: BusinessImpactCategoriesProps) {
  if (categoryInsights && categoryInsights.length > 0) {
    return <PersonalizedCategoryCards insights={categoryInsights} />
  }

  return <LegacyCategoryCards issues={issues} />
}

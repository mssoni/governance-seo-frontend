# API Contracts

> **This is the coupling point between backend and frontend.**
> Backend source of truth: `app/models/schemas.py`
> Frontend source of truth: `src/types/api.ts`
> Golden fixtures: `tests/fixtures/reports/` (backend), `src/mocks/golden/` (frontend)

**Contract Version: 1.8.0**

## Rules

1. **Contract-First**: Any schema change must update this file FIRST, then code, then golden fixtures.
2. **Additive-Only**: Never remove or rename fields. Only add new ones.
3. **Breaking Changes**: If unavoidable, flag as `[BREAKING SCHEMA CHANGE]` in PROGRESS.md.
4. **Golden Fixtures**: Every endpoint has a golden fixture that validates against the schema.
5. **Version Bumping**: Additive changes bump MINOR. Breaking changes bump MAJOR. Bug fixes bump PATCH.
6. **Sync Required**: `contract_version` must match between this file and `CHANGE_MANIFEST.json`.

## Version History

| Version | Date | Change | Change ID |
|---------|------|--------|-----------|
| 1.8.0 | 2026-02-10 | Additive: `issue_insights?: string[]` on `GovernanceReport` for batch Gemini issue summaries in Business Overview | CHG-023 |
| 1.7.0 | 2026-02-09 | Additive: `CategoryInsight` model, `customer_segment` and `category_insights` fields on `GovernanceReport` for segment-aware personalized content | CHG-018 |
| 1.6.0 | 2026-02-09 | Additive: 15 Foundation Signals fields on `GovernanceReport` (site_age, partner, complexity, inventory, technical_debt) | CHG-014 |
| 1.5.0 | 2026-02-08 | Additive: optional `governance_job_id` on `SEOReportRequest` for governance data reuse | CHG-013 |
| 1.4.0 | 2026-02-07 | Additive: `user_place` on `SuggestCompetitorsResponse`, two-step search, `websiteUri` extraction | CHG-011 |
| 1.3.0 | 2026-02-07 | Additive: `GET /api/report/suggest-competitors` endpoint, `CompetitorSuggestion` model, `SuggestCompetitorsResponse` model | CHG-008 |
| 1.2.0 | 2026-02-07 | Additive: `executive_narrative` on ExecutiveSummary, `business_category` on Issue, `TopImprovement` model, `top_improvements` on GovernanceReport | CHG-005 |
| 1.1.0 | 2026-02-07 | Additive: `pages_analyzed` field added to GovernanceReport | CHG-001 |
| 1.0.0 | 2026-02-07 | V1 baseline — all endpoints stable | — |

---

## Endpoints

### POST /api/report/governance

**Request Body:**
```json
{
  "website_url": "https://example.com",
  "location": {
    "city": "San Francisco",
    "region": "California",
    "country": "US"
  },
  "business_type": "professional_services",
  "intent": "both"
}
```

**Response:** `202 Accepted`
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "queued"
}
```

### GET /api/report/status/{job_id}

**Response (processing):**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing",
  "progress": 0.45,
  "current_step": "run_detectors",
  "steps_completed": ["url_normalize", "fetch_homepage", "parse_sitemap"],
  "error": null,
  "governance_report": null,
  "seo_report": null
}
```

**Response (complete):** Same shape but `status: "complete"`, `progress: 1.0`, `governance_report` populated.

### POST /api/report/seo

**Request Body:**
```json
{
  "website_url": "https://example.com",
  "location": {
    "city": "San Francisco",
    "region": "California",
    "country": "US"
  },
  "business_type": "professional_services",
  "intent": "seo",
  "competitors": [
    "https://competitor1.com",
    "https://competitor2.com"
  ],
  "governance_job_id": "uuid-of-previous-governance-job"
}
```

> `governance_job_id` is optional (default `null`). When provided and the referenced job
> is complete with cached governance pipeline data, the SEO pipeline skips steps 1-9
> (crawl, detect, PSI) and reuses the cached results. If the referenced job is missing,
> incomplete, or has no cached data, the pipeline falls back to running all steps. (CHG-013)

**Response:** `202 Accepted` — same `{ job_id, status }` shape.

### GET /api/report/suggest-competitors

**Query Parameters:**
| Param | Type | Required |
|-------|------|----------|
| business_type | BusinessType | yes |
| city | string (min 1) | yes |
| region | string | no |
| country | string | no |
| website_url | string | no |

**Response:** `200 OK`
```json
{
  "suggestions": [
    {
      "name": "Smile Dental",
      "address": "123 Main St, Austin, TX",
      "rating": 4.5,
      "review_count": 120,
      "website_url": "https://smiledental.com"
    }
  ],
  "user_place": {
    "name": "SkinSure Clinic",
    "address": "Baner Road, Pune, Maharashtra 411007, India",
    "rating": 4.7,
    "review_count": 250,
    "website_url": "https://skinsureclinic.com/"
  }
}
```

When `website_url` is provided, uses a two-step search: (1) finds user's business on Google Places to get specific types + area, (2) searches for competitors using those specific types. `user_place` contains the user's own Google Business Profile data (null if not found or website_url not provided).

Returns empty `suggestions` list if Places API key is not configured (graceful degradation).

### GET /api/health

**Response:** `200 OK`
```json
{
  "status": "ok"
}
```

---

## Enums

| Enum | Values |
|------|--------|
| BusinessType | clinic, dental, healthcare_services, ngo, education, construction, logistics, manufacturing, professional_services, other |
| Intent | seo, governance, both |
| JobStatus | queued, processing, complete, failed |
| Severity | high, medium, low |
| Confidence | high, medium, low |
| DetectedAs | observed, inferred |
| Effort | S, M, L |
| Owner | business, developer, agency |
| CustomerSegment | revenue_driven, risk_aware, oversight |
| CategoryStatus | at_risk, on_track, good |

---

## Models

### CompetitorSuggestion
| Field | Type | Required |
|-------|------|----------|
| name | string | yes |
| address | string \| null | no |
| rating | number \| null | no |
| review_count | number \| null | no |
| website_url | string \| null | no |

### SuggestCompetitorsResponse
| Field | Type | Required |
|-------|------|----------|
| suggestions | CompetitorSuggestion[] | yes |
| user_place | CompetitorSuggestion \| null | no (default null, added in 1.4.0 CHG-011) |

### Location
| Field | Type | Required |
|-------|------|----------|
| city | string | yes |
| region | string | yes |
| country | string | yes |

### Evidence
| Field | Type | Required |
|-------|------|----------|
| description | string | yes |
| raw_value | string \| null | no |

### Issue
| Field | Type | Required |
|-------|------|----------|
| issue_id | string | yes |
| title | string | yes |
| severity | Severity | yes |
| confidence | Confidence | yes |
| detected_as | DetectedAs | yes |
| business_category | string | no (default "") |
| evidence | Evidence[] | yes |
| why_it_matters | string | yes |
| what_happens_if_ignored | string | yes |
| what_to_do | string[] | yes |
| expected_impact | string | yes |

### MetricCard
| Field | Type | Required |
|-------|------|----------|
| name | string | yes |
| value | string | yes |
| meaning | string | yes |
| evidence | Evidence[] | yes |
| why_it_matters | string | yes |

### SummaryItem
| Field | Type | Required |
|-------|------|----------|
| title | string | yes |
| description | string | yes |
| detected_as | DetectedAs | yes |
| confidence | Confidence | yes |

### ExecutiveSummary
| Field | Type | Required |
|-------|------|----------|
| executive_narrative | string | no (default "") |
| whats_working | SummaryItem[] (min 3) | yes |
| needs_attention | SummaryItem[] (min 3, max 5) | yes |

### ChecklistItem
| Field | Type | Required |
|-------|------|----------|
| action | string | yes |
| category | string | yes |
| frequency | string | yes |
| owner | Owner | yes |
| effort | Effort | yes |
| why_it_matters | string | yes |

### LimitationItem
| Field | Type | Required |
|-------|------|----------|
| title | string | yes |
| description | string | yes |

### TopImprovement
| Field | Type | Required |
|-------|------|----------|
| title | string | yes |
| description | string | yes |
| effort | Effort | yes |
| category | string | yes |

### GovernanceReport
| Field | Type | Required |
|-------|------|----------|
| summary | ExecutiveSummary | yes |
| metrics | MetricCard[] | yes |
| issues | Issue[] | yes |
| checklist_30d | ChecklistItem[] | yes |
| limitations | LimitationItem[] | yes |
| pages_analyzed | number | yes (default 0, added in 1.1.0 CHG-001) |
| top_improvements | TopImprovement[] | no (default [], added in 1.2.0 CHG-005) |
| copyright_year | number \| null | no (default null, added in 1.6.0 CHG-014) |
| blog_last_updated | string \| null | no (default null, added in 1.6.0 CHG-014) |
| sitemap_latest_lastmod | string \| null | no (default null, added in 1.6.0 CHG-014) |
| site_maintenance_status | "active" \| "sporadic" \| "stale" \| "unknown" | no (default "unknown", added in 1.6.0 CHG-014) |
| agency_name | string \| null | no (default null, added in 1.6.0 CHG-014) |
| agency_credit_url | string \| null | no (default null, added in 1.6.0 CHG-014) |
| login_routes_detected | string[] | no (default [], added in 1.6.0 CHG-014) |
| multi_locale_detected | boolean | no (default false, added in 1.6.0 CHG-014) |
| site_complexity | "simple" \| "moderate" \| "complex" \| "enterprise" | no (default "simple", added in 1.6.0 CHG-014) |
| page_count_by_section | Record<string, number> | no (default {}, added in 1.6.0 CHG-014) |
| templates_estimate | number | no (default 0, added in 1.6.0 CHG-014) |
| technical_debt_score | number (0-100) | no (default 50, added in 1.6.0 CHG-014) |
| customer_segment | CustomerSegment \| null | no (default null, added in 1.7.0 CHG-018) |
| category_insights | CategoryInsight[] | no (default [], added in 1.7.0 CHG-018) |
| issue_insights | string[] | no (default [], added in 1.8.0 CHG-023) |

### CategoryInsight (added in 1.7.0 CHG-018)
| Field | Type | Required |
|-------|------|----------|
| category_id | string | yes |
| display_name | string | yes |
| headline | string | yes |
| detail | string | yes |
| icon | string | no (default "shield") |
| status | CategoryStatus | yes |
| issue_count | number | no (default 0) |
| max_severity | Severity \| null | no (default null) |

### CompetitorRow
| Field | Type | Required |
|-------|------|----------|
| name | string | yes |
| url | string | yes |
| speed_band | string | yes |
| content_coverage | string | yes |
| service_breadth | number | yes |
| local_signals | string[] | yes |
| review_count | number \| null | no |
| review_rating | number \| null | no |

### GapItem
| Field | Type | Required |
|-------|------|----------|
| category | string | yes |
| your_value | string | yes |
| competitor_value | string | yes |
| significance | string | yes |

### StrengthItem
| Field | Type | Required |
|-------|------|----------|
| title | string | yes |
| description | string | yes |
| evidence | string[] | yes |

### WeekAction
| Field | Type | Required |
|-------|------|----------|
| action | string | yes |
| why | string | yes |
| signal_strengthened | string | yes |
| estimated_impact | string | yes |
| verification_method | string | yes |

### WeekPlan
| Field | Type | Required |
|-------|------|----------|
| week | number | yes |
| theme | string | yes |
| actions | WeekAction[] | yes |

### SEOReport
| Field | Type | Required |
|-------|------|----------|
| competitor_table | CompetitorRow[] | yes |
| competitor_advantages | StrengthItem[] (min 3) | yes |
| user_strengths | StrengthItem[] (min 2) | yes |
| gaps | GapItem[] | yes |
| plan_30d | WeekPlan[] (exactly 4) | yes |

### JobCreateResponse
| Field | Type | Required |
|-------|------|----------|
| job_id | string | yes |
| status | JobStatus | yes |

### JobStatusResponse
| Field | Type | Required |
|-------|------|----------|
| job_id | string | yes |
| status | JobStatus | yes |
| progress | number (0.0-1.0) | yes |
| current_step | string \| null | no |
| steps_completed | string[] | yes |
| error | string \| null | no |
| governance_report | GovernanceReport \| null | no |
| seo_report | SEOReport \| null | no |

---

## Pipeline Steps (for progress tracking)

Ordered list of steps reported via `current_step` / `steps_completed`:

1. `url_normalize`
2. `fetch_homepage`
3. `parse_sitemap`
4. `sample_pages`
5. `run_detectors`
6. `run_psi`
7. `build_issues`
8. `generate_checklist`
9. `build_report`

For SEO reports, additional steps after governance:

10. `analyze_competitors`
11. `gap_analysis`
12. `generate_plan`

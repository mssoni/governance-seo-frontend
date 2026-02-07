# API Contracts

> **This is the coupling point between backend and frontend.**
> Backend source of truth: `app/models/schemas.py`
> Frontend source of truth: `src/types/api.ts`
> Golden fixtures: `tests/fixtures/reports/` (backend), `src/mocks/golden/` (frontend)

**Contract Version: 1.1.0**

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
| 1.0.0 | 2026-02-07 | V1 baseline — all endpoints stable | — |
| 1.1.0 | 2026-02-07 | Additive: `pages_analyzed` field added to GovernanceReport | CHG-001 |

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
  ]
}
```

**Response:** `202 Accepted` — same `{ job_id, status }` shape.

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

---

## Models

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

### GovernanceReport
| Field | Type | Required |
|-------|------|----------|
| pages_analyzed | number | yes |
| summary | ExecutiveSummary | yes |
| metrics | MetricCard[] | yes |
| issues | Issue[] | yes |
| checklist_30d | ChecklistItem[] | yes |
| limitations | LimitationItem[] | yes |

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

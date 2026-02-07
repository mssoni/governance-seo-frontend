/**
 * Analytics tracker module.
 *
 * Default: logs events via console.info('[analytics]', event, properties).
 * Extensible: call setHandler() to swap in Google Analytics, Mixpanel, etc.
 */

export type EventName =
  | 'report_generation_start'
  | 'report_generation_complete'
  | 'report_generation_failed'
  | 'cta_click'
  | 'tab_switch'
  | 'evidence_expand'
  | 'seo_report_start'
  | 'seo_report_complete'

export interface AnalyticsEvent {
  event: EventName
  properties: Record<string, unknown>
}

type AnalyticsHandler = (analyticsEvent: AnalyticsEvent) => void

let handler: AnalyticsHandler | null = null

function defaultHandler(analyticsEvent: AnalyticsEvent): void {
  // eslint-disable-next-line no-console
  console.info('[analytics]', analyticsEvent.event, analyticsEvent.properties)
}

/**
 * Track an analytics event.
 */
export function track(event: EventName, properties?: Record<string, unknown>): void {
  const enrichedProperties: Record<string, unknown> = {
    ...properties,
    timestamp: Date.now(),
  }

  const analyticsEvent: AnalyticsEvent = {
    event,
    properties: enrichedProperties,
  }

  if (handler) {
    handler(analyticsEvent)
  } else {
    defaultHandler(analyticsEvent)
  }
}

/**
 * Register a custom analytics handler (e.g. for Google Analytics).
 */
export function setHandler(customHandler: AnalyticsHandler): void {
  handler = customHandler
}

/**
 * Reset to the default console.info handler.
 */
export function resetHandler(): void {
  handler = null
}

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { track, setHandler, resetHandler, type AnalyticsEvent } from '../tracker'

describe('Analytics Tracker', () => {
  let consoleInfoSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    resetHandler()
    consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleInfoSpy.mockRestore()
  })

  it('logs event with properties via console.info by default', () => {
    track('report_generation_start', { url: 'https://example.com' })

    expect(consoleInfoSpy).toHaveBeenCalledOnce()
    const [prefix, event, props] = consoleInfoSpy.mock.calls[0]
    expect(prefix).toBe('[analytics]')
    expect(event).toBe('report_generation_start')
    expect(props).toMatchObject({ url: 'https://example.com' })
  })

  it('includes timestamp in event properties', () => {
    const before = Date.now()
    track('tab_switch', { tab: 'seo' })
    const after = Date.now()

    const props = consoleInfoSpy.mock.calls[0][2] as Record<string, unknown>
    expect(props).toHaveProperty('timestamp')
    const ts = props.timestamp as number
    expect(ts).toBeGreaterThanOrEqual(before)
    expect(ts).toBeLessThanOrEqual(after)
  })

  it('custom handler can be registered and receives events', () => {
    const handler = vi.fn()
    setHandler(handler)

    track('cta_click', { cta: 'need_help' })

    expect(handler).toHaveBeenCalledOnce()
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'cta_click',
        properties: expect.objectContaining({ cta: 'need_help' }),
      }),
    )
    // Default console.info should NOT be called when custom handler is set
    expect(consoleInfoSpy).not.toHaveBeenCalled()
  })

  it('handler receives well-formed AnalyticsEvent object', () => {
    const handler = vi.fn()
    setHandler(handler)

    track('report_generation_complete', { duration_ms: 1234 })

    const eventObj = handler.mock.calls[0][0] as AnalyticsEvent
    expect(eventObj).toHaveProperty('event', 'report_generation_complete')
    expect(eventObj).toHaveProperty('properties')
    expect(eventObj.properties).toMatchObject({ duration_ms: 1234 })
    expect(eventObj.properties).toHaveProperty('timestamp')
  })

  it('resetHandler restores default console.info behavior', () => {
    const handler = vi.fn()
    setHandler(handler)
    resetHandler()

    track('evidence_expand', { panel: 'speed' })

    expect(handler).not.toHaveBeenCalled()
    expect(consoleInfoSpy).toHaveBeenCalledOnce()
  })

  it('works with no properties', () => {
    track('report_generation_start')

    expect(consoleInfoSpy).toHaveBeenCalledOnce()
    const props = consoleInfoSpy.mock.calls[0][2] as Record<string, unknown>
    expect(props).toHaveProperty('timestamp')
  })

  it('tracks all expected event types', () => {
    const events = [
      'report_generation_start',
      'report_generation_complete',
      'report_generation_failed',
      'cta_click',
      'tab_switch',
      'evidence_expand',
      'seo_report_start',
      'seo_report_complete',
    ] as const

    events.forEach((event) => {
      track(event)
    })

    expect(consoleInfoSpy).toHaveBeenCalledTimes(events.length)
  })
})

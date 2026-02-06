import { describe, it, expect } from 'vitest'
import { apiClient } from './api-client'

describe('ApiClient', () => {
  it('constructs correct base URL', () => {
    expect(apiClient.getBaseUrl()).toBe('http://localhost:8000')
  })
})

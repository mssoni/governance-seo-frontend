/**
 * API client for communicating with the backend.
 * During development, components use mock data from src/mocks/golden/.
 * In production/integration, this points to the real backend.
 */

import type { SuggestCompetitorsResponse } from '../types/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

interface RequestOptions {
  method?: string
  body?: unknown
  headers?: Record<string, string>
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      throw new ApiError(response.status, await response.text())
    }

    return response.json() as Promise<T>
  }

  async get<T>(path: string): Promise<T> {
    return this.request<T>(path)
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, { method: 'POST', body })
  }

  getBaseUrl(): string {
    return this.baseUrl
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: string,
  ) {
    super(`API Error ${status}: ${body}`)
    this.name = 'ApiError'
  }
}

export const apiClient = new ApiClient(API_BASE_URL)

export interface SuggestCompetitorsParams {
  business_type: string
  city: string
  region: string
  country: string
  website_url?: string
}

export async function fetchCompetitorSuggestions(
  params: SuggestCompetitorsParams,
): Promise<SuggestCompetitorsResponse> {
  const searchParams: Record<string, string> = {
    business_type: params.business_type,
    city: params.city,
    region: params.region,
    country: params.country,
  }
  if (params.website_url) {
    searchParams.website_url = params.website_url
  }
  const query = new URLSearchParams(searchParams).toString()
  return apiClient.get<SuggestCompetitorsResponse>(
    `/api/report/suggest-competitors?${query}`,
  )
}

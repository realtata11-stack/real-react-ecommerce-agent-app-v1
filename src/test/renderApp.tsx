import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, vi } from 'vitest'
import App from '../App.tsx'
import { categoriesResponse, productsResponse } from './fixtures.ts'

type Routes = Record<string, unknown>

const defaultRoutes: Routes = {
  '/products/categories': categoriesResponse,
  '/products': productsResponse,
}

/** Replaces `fetch` with a stub answering DummyJSON-shaped JSON by URL path. */
export function stubFetch(routes: Routes = {}) {
  const table = { ...defaultRoutes, ...routes }
  const stub = vi.fn(async (input: RequestInfo | URL) => {
    const { pathname } = new URL(String(input))
    if (pathname in table) return Response.json(table[pathname])
    return Response.json({ message: 'Not found' }, { status: 404 })
  })
  vi.stubGlobal('fetch', stub)
  return stub
}

// Every test starts with a clean fetch stub and empty storage.
beforeEach(() => {
  localStorage.clear()
  stubFetch()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

/** Renders the whole app at the given URL(s), with a fresh query cache. */
export function renderApp(...initialEntries: string[]) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter
        initialEntries={initialEntries.length ? initialEntries : ['/']}
      >
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

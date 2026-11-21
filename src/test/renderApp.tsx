import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, vi } from 'vitest'
import App from '../App.tsx'
import { categoriesResponse, productsResponse } from './fixtures.ts'

/** A route answers with JSON data, a ready `Response`, or throws (network error). */
type RouteAnswer = unknown
type Route = RouteAnswer | ((url: URL) => RouteAnswer | Promise<RouteAnswer>)
type Routes = Record<string, Route>

const defaultRoutes: Routes = {
  '/products/categories': categoriesResponse,
  '/products': productsResponse,
}

/** Replaces `fetch` with a stub answering DummyJSON-shaped JSON by URL path. */
export function stubFetch(routes: Routes = {}) {
  const table = { ...defaultRoutes, ...routes }
  const stub = vi.fn(async (input: RequestInfo | URL) => {
    const url = new URL(String(input))
    if (!(url.pathname in table)) {
      return Response.json({ message: 'Not found' }, { status: 404 })
    }
    const route = table[url.pathname]
    const answer = typeof route === 'function' ? await route(url) : route
    return answer instanceof Response ? answer : Response.json(answer)
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

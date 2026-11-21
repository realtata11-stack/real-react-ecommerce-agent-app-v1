import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import App from './App.tsx'

test('shows the store name', () => {
  render(<App />)

  expect(screen.getByRole('heading', { name: 'My Store' })).toBeInTheDocument()
})

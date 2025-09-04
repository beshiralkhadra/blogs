import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserProvider, useAuth } from '@/contexts/appContext'

const mockFetch = jest.fn()
global.fetch = mockFetch

function TestComponent() {
  const { authenticated, login, logout } = useAuth()
  
  return (
    <div>
      <div data-testid="auth-status">
        {authenticated ? 'Authenticated' : 'Not Authenticated'}
      </div>
      <button 
        data-testid="login-btn"
        onClick={() => login('test@example.com', 'password123')}
      >
        Login
      </button>
      <button 
        data-testid="logout-btn"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  )
}

function renderWithProvider() {
  return act(() => 
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    )
  )
}

describe('Authentication Context', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401
    })
  })

  test('should start with unauthenticated state', async () => {
    await renderWithProvider()
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-status').textContent).toBe('Not Authenticated')
    })
  })

  test('should authenticate user on successful login', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401
    })

    await renderWithProvider()
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-status').textContent).toBe('Not Authenticated')
    })

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true, success: true })
    })

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        user: { id: 1, email: 'test@example.com', name: 'Test User' } 
      })
    })

    const user = userEvent.setup()
    
    await user.click(screen.getByTestId('login-btn'))
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-status').textContent).toBe('Authenticated')
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
    })
  })

  test('should handle login failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401
    })

    await renderWithProvider()
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-status').textContent).toBe('Not Authenticated')
    })

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Invalid credentials' })
    })

    const user = userEvent.setup()
    
    await user.click(screen.getByTestId('login-btn'))
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-status').textContent).toBe('Not Authenticated')
    })
  })

  test('should logout user successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        user: { id: 1, email: 'test@example.com', name: 'Test User' } 
      })
    })

    await renderWithProvider()
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-status').textContent).toBe('Authenticated')
    })

    const user = userEvent.setup()
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    })
    
    await user.click(screen.getByTestId('logout-btn'))
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-status').textContent).toBe('Not Authenticated')
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/auth/logout', { method: 'POST' })
  })

  test('should handle network errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    renderWithProvider()
    const user = userEvent.setup()
    
    await user.click(screen.getByTestId('login-btn'))
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-status').textContent).toBe('Not Authenticated')
    })
  })
})

import { render, screen, waitFor, act } from '@testing-library/react'
import { BlogsProvider, useBlogs, type Blog } from '@/contexts/BlogsContext'

const mockFetch = jest.fn()
global.fetch = mockFetch

function TestComponent() {
  const { blogs, isLoading, error, fetchBlogs } = useBlogs()
  
  return (
    <div>
      <div data-testid="loading-status">
        {isLoading ? 'Loading' : 'Not Loading'}
      </div>
      <div data-testid="error-status">
        {error || 'No Error'}
      </div>
      <div data-testid="blogs-count">
        Blogs: {blogs.length}
      </div>
      <button 
        data-testid="fetch-btn"
        onClick={fetchBlogs}
      >
        Fetch Blogs
      </button>
      <div data-testid="blogs-list">
        {blogs.map(blog => (
          <div key={blog.id} data-testid={`blog-${blog.id}`}>
            {blog.title}
          </div>
        ))}
      </div>
    </div>
  )
}

function renderWithProvider() {
  return act(() => 
    render(
      <BlogsProvider>
        <TestComponent />
      </BlogsProvider>
    )
  )
}

const mockBlogs: Blog[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: i === 0 ? 'Getting Started with React and Next.js' :
         i === 1 ? 'The Future of Web Development: AI and Machine Learning' :
         i === 2 ? 'Building Scalable APIs with Node.js and Express' :
         `Blog Post ${i + 1}`,
  content: `Content for blog post ${i + 1}`,
  author: `Author ${i + 1}`,
  createdAt: new Date().toISOString()
}))

describe('BlogsContext', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: mockBlogs
      })
    })
  })

  test('should start with loading state initially', async () => {
    mockFetch.mockImplementationOnce(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({
            success: true,
            data: mockBlogs
          })
        }), 100)
      )
    )

    await renderWithProvider()
    
    expect(screen.getByTestId('loading-status').textContent).toBe('Loading')
    expect(screen.getByTestId('error-status').textContent).toBe('No Error')
    expect(screen.getByTestId('blogs-count').textContent).toBe('Blogs: 0')

    await waitFor(() => {
      expect(screen.getByTestId('loading-status').textContent).toBe('Not Loading')
    }, { timeout: 3000 })
  })

  test('should load mock blogs successfully', async () => {
    await renderWithProvider()
    
    await waitFor(() => {
      expect(screen.getByTestId('blogs-count').textContent).toBe('Blogs: 10')
    }, { timeout: 3000 })

    expect(screen.getByTestId('blog-1')).toBeTruthy()
    expect(screen.getByTestId('blog-2')).toBeTruthy()
    expect(screen.getByTestId('blog-3')).toBeTruthy()
  })

  test('should show loading state during fetch', async () => {
    mockFetch.mockImplementationOnce(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({
            success: true,
            data: mockBlogs
          })
        }), 100)
      )
    )

    await renderWithProvider()
    
    expect(screen.getByTestId('loading-status').textContent).toBe('Loading')
    
    await waitFor(() => {
      expect(screen.getByTestId('loading-status').textContent).toBe('Not Loading')
    }, { timeout: 3000 })
  })

  test('should display blog titles correctly', async () => {
    await renderWithProvider()
    
    await waitFor(() => {
      expect(screen.getByTestId('blogs-count').textContent).toBe('Blogs: 10')
    }, { timeout: 3000 })

    expect(screen.getByText('Getting Started with React and Next.js')).toBeTruthy()
    expect(screen.getByText('The Future of Web Development: AI and Machine Learning')).toBeTruthy()
    expect(screen.getByText('Building Scalable APIs with Node.js and Express')).toBeTruthy()
  })
});

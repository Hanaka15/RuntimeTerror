import { vi, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Login from '@/pages/Login.vue'
import { useAuthStore } from '@/store/authStore'

// Mock the auth store so we can control its behavior in tests
vi.mock('@/store/authStore')

// Mock the router and axios to prevent side effects and circular issues
vi.mock('@/router', () => ({ default: {} }))
vi.mock('@/api/axios', () => ({ default: {} }))

describe('Login.vue', () => {
  beforeEach(() => {
    // Reset all mocks before each test to avoid cross-test pollution
    vi.clearAllMocks()
  })

  it('logs in with valid credentials (positive case)', async () => {
    // Mock the login method to resolve successfully
    const loginMock = vi.fn().mockResolvedValue()
    useAuthStore.mockReturnValue({ login: loginMock })

    // Mock the router's push method to check navigation
    const pushMock = vi.fn()
    const wrapper = mount(Login, {
      global: {
        mocks: {
          $router: { push: pushMock }
        }
      }
    })

    // Simulate user entering email and password
    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('Password123!')
    // Simulate form submission
    await wrapper.find('form').trigger('submit.prevent')

    // Assert that the login method was called with the correct credentials
    expect(loginMock).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Password123!'
    })
    // Assert that the user is redirected to the dashboard after login
    expect(pushMock).toHaveBeenCalledWith('/dashboard')
  })

  it('shows alert on failed login (negative case)', async () => {
    //mock the login method to reject (simulate failed login)
    const loginMock = vi.fn().mockRejectedValue(new Error('fail'))
    useAuthStore.mockReturnValue({ login: loginMock })

    //mock window.alert to check if it's called
    window.alert = vi.fn()

    const wrapper = mount(Login, {
      global: {
        mocks: {
          $router: { push: vi.fn() }
        }
      }
    })

    //simulate user entering wrong credentials
    await wrapper.find('input[type="email"]').setValue('wrong@example.com')
    await wrapper.find('input[type="password"]').setValue('wrongpass')
    //simulate form submission
    await wrapper.find('form').trigger('submit.prevent')

    //Assert that the login method was called
    expect(loginMock).toHaveBeenCalled()
    //Assert that an alert is shown on failure
    expect(window.alert).toHaveBeenCalledWith('Login failed')
  })
})

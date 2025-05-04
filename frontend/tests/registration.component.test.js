import { vi, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Register from '@/pages/Register.vue'
import { useAuthStore } from '@/store/authStore'

// Mock the auth store for controlled test behavior
vi.mock('@/store/authStore')

// Mock the router and axios to prevent side effects and circular issues
vi.mock('@/router', () => ({ default: {} }))
vi.mock('@/api/axios', () => ({ default: {} }))

describe('Register.vue', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks()
  })

  it('registers with valid data (positive case)', async () => {
    //mock the register method to resolve successfully
    const registerMock = vi.fn().mockResolvedValue()
    useAuthStore.mockReturnValue({ register: registerMock })

    //Mock the router's push method to check navigation
    const pushMock = vi.fn()
    const wrapper = mount(Register, {
      global: {
        mocks: {
          $router: { push: pushMock }
        }
      }
    })

    //simulate user entering valid registration data
    await wrapper.find('input[type="email"]').setValue('new@example.com')
    await wrapper.find('input[type="text"]').setValue('newuser')
    await wrapper.find('input[type="password"]').setValue('Password123!')
    //The second password input is for confirm password
    await wrapper.findAll('input[type="password"]')[1].setValue('Password123!')

    //Simulate form submission
    await wrapper.find('form').trigger('submit.prevent')

    //Assert that the register method was called with the correct data
    expect(registerMock).toHaveBeenCalledWith({
      email: 'new@example.com',
      username: 'newuser',
      password: 'Password123!'
    })
    //Assert that the user is redirected to the login page after registration
    expect(pushMock).toHaveBeenCalledWith('/login')
  })

  it('shows alert if password requirements are not met (negative case)', async () => {
    //Mock the register method (should not be called in this case)
    useAuthStore.mockReturnValue({ register: vi.fn() })
    //Mock window.alert to check if it's called
    window.alert = vi.fn()

    const wrapper = mount(Register, {
      global: {
        mocks: {
          $router: { push: vi.fn() }
        }
      }
    })

    // Simulate user entering invalid password (too short, doesn't meet requirements)
    await wrapper.find('input[type="email"]').setValue('bad@example.com')
    await wrapper.find('input[type="text"]').setValue('baduser')
    await wrapper.find('input[type="password"]').setValue('short')
    await wrapper.findAll('input[type="password"]')[1].setValue('short')

    // Simulate form submission
    await wrapper.find('form').trigger('submit.prevent')

    // Assert that an alert is shown for unmet password requirements
    expect(window.alert).toHaveBeenCalledWith('Please meet all password requirements')
  })


  it('registers with minimum valid password length (edge case)', async () => {
    // Mock register function to simulate success
    const registerMock = vi.fn().mockResolvedValue()
    useAuthStore.mockReturnValue({ register: registerMock })
  
    // Mock router to capture redirection
    const pushMock = vi.fn()
    const wrapper = mount(Register, {
      global: {
        mocks: {
          $router: { push: pushMock }
        }
      }
    })
  
    // Simulate user entering edge-length valid password (8 chars)
    await wrapper.find('input[type="email"]').setValue('edge@example.com')
    await wrapper.find('input[type="text"]').setValue('edgeuser')
    await wrapper.find('input[type="password"]').setValue('Abc123!!') //exactly 8 chars
    await wrapper.findAll('input[type="password"]')[1].setValue('Abc123!!')
  
    // Submit form
    await wrapper.find('form').trigger('submit.prevent')
  
    // Assert register method was called correctly
    expect(registerMock).toHaveBeenCalledWith({
      email: 'edge@example.com',
      username: 'edgeuser',
      password: 'Abc123!!'
    })
  
    // Assert redirect to login
    expect(pushMock).toHaveBeenCalledWith('/login')
  })
  
})

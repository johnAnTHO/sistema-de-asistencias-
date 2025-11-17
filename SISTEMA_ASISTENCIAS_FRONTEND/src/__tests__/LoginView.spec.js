import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginView from '../views/LoginView.vue'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/dashboard', component: { template: '<div>Dashboard</div>' } }
]

const mockAuthStore = {
  login: vi.fn(),
  user: null,
  token: null,
  loading: false
}

describe('LoginView', () => {
  let router

  beforeEach(() => {
    setActivePinia(createPinia())
    router = createRouter({
      history: createWebHistory(),
      routes: routes,
    })
  })

  it('renderiza el formulario de login', () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [router],
        mocks: {
          useAuthStore: () => mockAuthStore
        }
      }
    })

    expect(wrapper.find('h2').text()).toBe('Sistema de Asistencias')
    expect(wrapper.find('input[type="text"]').exists()).toBe(true) // Cambiado de email a text
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('actualiza los datos del formulario cuando el usuario escribe', async () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [router],
        mocks: {
          useAuthStore: () => mockAuthStore
        }
      }
    })

    const dniInput = wrapper.find('input[type="text"]') // Cambiado
    const passwordInput = wrapper.find('input[type="password"]')

    await dniInput.setValue('99999999')
    await passwordInput.setValue('password123')

    expect(wrapper.vm.form.dni).toBe('99999999') // Cambiado de email a dni
    expect(wrapper.vm.form.password).toBe('password123')
  })

  it('llama a la función de login al enviar el formulario', async () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [router],
        mocks: {
          useAuthStore: () => mockAuthStore
        }
      }
    })

    // Simular entrada de datos
    await wrapper.find('input[type="text"]').setValue('99999999') // Cambiado
    await wrapper.find('input[type="password"]').setValue('password123')

    // Simular envío del formulario
    await wrapper.find('form').trigger('submit.prevent')

    // Verificar que se llamó a la función de login
    expect(mockAuthStore.login).toHaveBeenCalledWith({
      dni: '99999999', // Cambiado de email a dni
      password: 'password123'
    })
  })
})
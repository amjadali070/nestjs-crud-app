import axios from 'axios'

const API_URL = 'http://localhost:3000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface User {
  id?: number
  name: string
  email: string
  phone?: string
  address?: string
  createdAt?: string
  updatedAt?: string
}

export const userService = {
  // Get all users
  async getUsers(): Promise<User[]> {
    const response = await api.get('/users')
    return response.data
  },

  // Get user by ID
  async getUser(id: number): Promise<User> {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  // Create new user
  async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const response = await api.post('/users', user)
    return response.data
  },

  // Update user
  async updateUser(id: number, user: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User> {
    const response = await api.patch(`/users/${id}`, user)
    return response.data
  },

  // Delete user
  async deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`)
  },
}
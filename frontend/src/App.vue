<template>
  <div class="app">
    <header class="header">
      <h1>User Management System</h1>
      <p>Full Stack CRUD Application with NestJS & Vue.js</p>
    </header>

    <main class="main">
      <div class="controls">
        <button 
          v-if="!showForm" 
          @click="showAddForm" 
          class="btn btn-primary btn-large"
        >
          Add New User
        </button>
      </div>

      <!-- User Form -->
      <UserForm
        v-if="showForm"
        :user="selectedUser"
        :is-edit="!!selectedUser"
        @submit="handleSubmit"
        @cancel="hideForm"
      />

      <!-- Users Table -->
      <UserTable
        v-if="!showForm"
        :users="users"
        :loading="loading"
        @edit="handleEdit"
        @delete="handleDelete"
      />

      <!-- Success/Error Messages -->
      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UserForm from './components/UserForm.vue'
import UserTable from './components/UserTable.vue'
import { userService, type User } from './services/api'

const users = ref<User[]>([])
const loading = ref(false)
const showForm = ref(false)
const selectedUser = ref<User | null>(null)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

onMounted(() => {
  loadUsers()
})

const loadUsers = async () => {
  loading.value = true
  try {
    users.value = await userService.getUsers()
  } catch (error) {
    showMessage('Failed to load users', 'error')
    console.error('Error loading users:', error)
  } finally {
    loading.value = false
  }
}

const showAddForm = () => {
  selectedUser.value = null
  showForm.value = true
}

const handleEdit = (user: User) => {
  selectedUser.value = user
  showForm.value = true
}

const hideForm = () => {
  showForm.value = false
  selectedUser.value = null
}

const handleSubmit = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    if (selectedUser.value) {
      // Update existing user
      await userService.updateUser(selectedUser.value.id!, userData)
      showMessage('User updated successfully!', 'success')
    } else {
      // Create new user
      await userService.createUser(userData)
      showMessage('User created successfully!', 'success')
    }
    
    hideForm()
    loadUsers()
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to save user'
    showMessage(errorMessage, 'error')
    console.error('Error saving user:', error)
  }
}

const handleDelete = async (id: number) => {
  if (!confirm('Are you sure you want to delete this user?')) {
    return
  }

  try {
    await userService.deleteUser(id)
    showMessage('User deleted successfully!', 'success')
    loadUsers()
  } catch (error) {
    showMessage('Failed to delete user', 'error')
    console.error('Error deleting user:', error)
  }
}

const showMessage = (text: string, type: 'success' | 'error') => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

.app {
  min-height: 100vh;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 30px 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 300;
}

.header p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

.controls {
  text-align: center;
  margin-bottom: 30px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.btn-large {
  padding: 15px 30px;
  font-size: 16px;
  border-radius: 8px;
}

.message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 6px;
  font-weight: 500;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
  }
  
  .header p {
    font-size: 1rem;
  }
  
  .main {
    padding: 20px 15px;
  }
}
</style>

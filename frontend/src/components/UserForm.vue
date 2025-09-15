<template>
  <div class="user-form">
    <h2>{{ isEdit ? 'Edit User' : 'Add New User' }}</h2>
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="name">Name *</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          placeholder="Enter full name"
        />
      </div>

      <div class="form-group">
        <label for="email">Email *</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          placeholder="Enter email address"
        />
      </div>

      <div class="form-group">
        <label for="phone">Phone</label>
        <input
          id="phone"
          v-model="form.phone"
          type="tel"
          placeholder="Enter phone number"
        />
      </div>

      <div class="form-group">
        <label for="address">Address</label>
        <textarea
          id="address"
          v-model="form.address"
          placeholder="Enter address"
          rows="3"
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Saving...' : (isEdit ? 'Update User' : 'Add User') }}
        </button>
        <button type="button" @click="$emit('cancel')" class="btn btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { User } from '../services/api'

interface Props {
  user?: User | null
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  user: null,
  isEdit: false
})

const emit = defineEmits<{
  submit: [user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>]
  cancel: []
}>()

const loading = ref(false)
const form = ref({
  name: '',
  email: '',
  phone: '',
  address: ''
})

onMounted(() => {
  if (props.user) {
    form.value = {
      name: props.user.name || '',
      email: props.user.email || '',
      phone: props.user.phone || '',
      address: props.user.address || ''
    }
  }
})

const handleSubmit = async () => {
  loading.value = true
  try {
    emit('submit', form.value)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.user-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4CAF50;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #45a049;
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f1f1f1;
  color: #333;
}

.btn-secondary:hover {
  background-color: #e1e1e1;
}

h2 {
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}
</style>
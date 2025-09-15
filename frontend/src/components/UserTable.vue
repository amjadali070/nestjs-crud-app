<template>
  <div class="user-table">
    <h2>Users List</h2>
    <div v-if="loading" class="loading">Loading users...</div>
    <div v-else-if="users.length === 0" class="no-users">
      No users found. Add your first user!
    </div>
    <table v-else class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Address</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone || '-' }}</td>
          <td>{{ user.address || '-' }}</td>
          <td>{{ formatDate(user.createdAt) }}</td>
          <td class="actions">
            <button 
              @click="$emit('edit', user)" 
              class="btn btn-edit"
              title="Edit user"
            >
              Edit
            </button>
            <button 
              @click="$emit('delete', user.id!)" 
              class="btn btn-delete"
              title="Delete user"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { User } from '../services/api'

interface Props {
  users: User[]
  loading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  edit: [user: User]
  delete: [id: number]
}>()

const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped>
.user-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

h2 {
  margin: 0;
  padding: 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  color: #333;
}

.loading, .no-users {
  padding: 40px;
  text-align: center;
  color: #666;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  background-color: #f8f9fa;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #dee2e6;
}

.table td {
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
  color: #555;
}

.table tr:hover {
  background-color: #f8f9fa;
}

.actions {
  white-space: nowrap;
}

.btn {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-right: 5px;
  transition: background-color 0.3s;
}

.btn-edit {
  background-color: #007bff;
  color: white;
}

.btn-edit:hover {
  background-color: #0056b3;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

.btn-delete:hover {
  background-color: #c82333;
}
</style>
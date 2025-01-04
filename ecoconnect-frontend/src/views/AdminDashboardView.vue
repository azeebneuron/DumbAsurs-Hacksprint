// src/views/AdminDashboardView.vue
<template>
  <div class="admin-dashboard">
    <h2>Admin Dashboard</h2>
    <button @click="logout">Logout</button>
    <div class="admin-sections">
      <div>
        <h3>User Management</h3>
        <!-- Add user management features here -->
      </div>
      <div>
        <h3>Business Verification</h3>
        <!-- Add business verification features here -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboardView',
  methods: {
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
}
.admin-sections {
  margin-top: 20px;
}
</style>
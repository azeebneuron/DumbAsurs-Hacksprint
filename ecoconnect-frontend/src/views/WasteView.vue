<template>
  <div class="waste-management">
    <div class="page-header">
      <h2>Waste Management</h2>
      <p class="subtitle">Track and manage your waste reduction journey</p>
    </div>

    <!-- Main Content Grid -->
    <div class="content-grid">
      <!-- Left Column -->
      <div class="left-column">
        <!-- Add New Waste Log Form -->
        <div class="form-card">
          <h3>Add New Waste Log</h3>
          <form @submit.prevent="submitLog" class="waste-form">
            <div class="form-row">
              <div class="form-group">
                <label>Category</label>
                <select v-model="newLog.category" required>
                  <option value="">Select Category</option>
                  <option v-for="category in categories" 
                          :key="category" 
                          :value="category">
                    {{ formatCategory(category) }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label>Amount</label>
                <input 
                  type="number" 
                  v-model="newLog.amount" 
                  step="0.01" 
                  min="0.01" 
                  required
                  placeholder="Enter amount"
                >
              </div>

              <div class="form-group">
                <label>Unit</label>
                <select v-model="newLog.unit" required>
                  <option value="">Select Unit</option>
                  <option v-for="unit in units" 
                          :key="unit" 
                          :value="unit">
                    {{ unit }}
                  </option>
                </select>
              </div>
            </div>

            <button type="submit" class="submit-btn" :disabled="isSubmitting">
              {{ isSubmitting ? 'Adding...' : 'Add Log' }}
            </button>
          </form>
        </div>

        <!-- Statistics Section -->
        <div class="stats-card">
          <h3>Recent Statistics</h3>
          <div v-if="stats" class="stats-grid">
            <div v-for="(amount, category) in stats.category_totals" 
                 :key="category" 
                 class="stat-item">
              <div class="stat-icon">♻️</div>
              <div class="stat-label">{{ formatCategory(category) }}</div>
              <div class="stat-value">{{ amount.toFixed(2) }} kg</div>
            </div>
          </div>
          <div v-else class="empty-state">
            Start logging waste to see your statistics
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="right-column">
        <!-- Filters -->
        <div class="filters-card">
          <div class="filter-group">
            <label>Filter by Category:</label>
            <select v-model="filters.category" @change="fetchLogs">
              <option value="">All Categories</option>
              <option v-for="category in categories" 
                      :key="category" 
                      :value="category">
                {{ formatCategory(category) }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label>Time Period:</label>
            <select v-model="filters.days" @change="fetchLogs">
              <option :value="7">Last 7 Days</option>
              <option :value="30">Last 30 Days</option>
              <option :value="90">Last 90 Days</option>
            </select>
          </div>
        </div>

        <!-- Waste Logs Table -->
        <div class="logs-card">
          <h3>Waste Logs</h3>
          <div v-if="loading" class="loading-state">
            <div class="loader"></div>
            <p>Loading your waste logs...</p>
          </div>
          <div v-else-if="wasteLogs.length === 0" class="empty-state">
            <p>No waste logs found</p>
            <button @click="resetFilters" class="reset-btn">Reset Filters</button>
          </div>
          <div v-else class="table-container">
            <table class="logs-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Unit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in wasteLogs" :key="log.id">
                  <td>{{ formatDate(log.date) }}</td>
                  <td>{{ formatCategory(log.category) }}</td>
                  <td>{{ log.amount }}</td>
                  <td>{{ log.unit }}</td>
                  <td>
                    <button 
                      @click="deleteLog(log.id)" 
                      class="delete-btn"
                      :disabled="isDeleting === log.id"
                    >
                      {{ isDeleting === log.id ? '...' : '×' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'WasteView',
  
  data() {
    return {
      categories: ['plastic', 'paper', 'glass', 'metal', 'organic'],
      units: ['kg', 'g'],
      wasteLogs: [],
      stats: null,
      loading: true,
      isSubmitting: false,
      isDeleting: null,
      newLog: {
        category: '',
        amount: '',
        unit: 'kg'
      },
      filters: {
        category: '',
        days: 30
      }
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    formatCategory(category) {
      return category
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    },

    async fetchData() {
      await Promise.all([
        this.fetchLogs(),
        this.fetchStats()
      ])
    },

    async fetchLogs() {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('No authentication token')

        let url = `http://localhost:5000/api/waste/logs?days=${this.filters.days}`
        if (this.filters.category) {
          url += `&category=${this.filters.category}`
        }
        
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        this.wasteLogs = response.data.logs
      } catch (error) {
        console.error('Error fetching logs:', error)
        if (error.response?.status === 401) {
          this.$router.push('/login')
        }
      } finally {
        this.loading = false
      }
    },

    async fetchStats() {
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('No authentication token')

        const response = await axios.get(
          `http://localhost:5000/api/waste/stats?days=${this.filters.days}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        this.stats = response.data
      } catch (error) {
        console.error('Error fetching stats:', error)
        if (error.response?.status === 401) {
          this.$router.push('/login')
        }
      }
    },

    async submitLog() {
      this.isSubmitting = true
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('No authentication token')

        await axios.post(
          'http://localhost:5000/api/waste/log', 
          this.newLog,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        
        // Reset form and refresh data
        this.newLog = { 
          category: '', 
          amount: '', 
          unit: 'kg' 
        }
        await this.fetchData()
      } catch (error) {
        console.error('Error creating log:', error)
        if (error.response?.status === 401) {
          this.$router.push('/login')
        } else {
          alert('Failed to add waste log: ' + (error.response?.data?.error || 'Unknown error'))
        }
      } finally {
        this.isSubmitting = false
      }
    },

    async deleteLog(id) {
      if (!confirm('Are you sure you want to delete this log?')) return

      this.isDeleting = id
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('No authentication token')

        await axios.delete(
          `http://localhost:5000/api/waste/log/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        await this.fetchData()
      } catch (error) {
        console.error('Error deleting log:', error)
        if (error.response?.status === 401) {
          this.$router.push('/login')
        } else {
          alert('Failed to delete log: ' + (error.response?.data?.error || 'Unknown error'))
        }
      } finally {
        this.isDeleting = null
      }
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    resetFilters() {
      this.filters = {
        category: '',
        days: 30
      }
      this.fetchData()
    }
  }
}
</script>

<style scoped>
.waste-management {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  color: #fff;
}

/* Header Styles */
.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h2 {
  font-size: 2.5em;
  background: linear-gradient(45deg, #ff357a, #fff172);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1em;
}

/* Grid Layout */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 2rem;
}

/* Card Base Styles */
.form-card, .stats-card, .filters-card, .logs-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  margin-bottom: 2rem;
}

.form-card:hover, .stats-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

/* Card Headers */
h3 {
  color: #ff357a;
  margin-bottom: 1.5rem;
  font-size: 1.2em;
  font-weight: 500;
}

/* Form Styles */
.form-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
}

input, select {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: white;
  font-family: "Quicksand", sans-serif;
  transition: all 0.3s ease;
}

input:focus, select:focus {
  outline: none;
  border-color: #ff357a;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

select option {
  background: #111;
  color: white;
}

/* Button Styles */
.submit-btn {
  width: 100%;
  background: linear-gradient(45deg, #ff357a, #fff172);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 40px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 53, 122, 0.3);
}

.reset-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Statistics Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-item {
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 15px;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.08);
}

.stat-icon {
  font-size: 1.5em;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9em;
  margin-bottom: 0.5rem;
  text-transform: capitalize;
}

.stat-value {
  font-size: 1.5em;
  color: #fff172;
  font-weight: 500;
}

/* Filters Section */
.filters-card {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.filter-group {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Table Styles */
.table-container {
  overflow-x: auto;
  margin: -1.5rem;
}

.logs-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.logs-table th,
.logs-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logs-table th {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  position: sticky;
  top: 0;
}

.logs-table tr:hover td {
  background: rgba(255, 255, 255, 0.02);
}

.delete-btn {
  background: rgba(255, 53, 122, 0.1);
  color: #ff357a;
  border: 1px solid #ff357a;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2em;
  transition: all 0.3s ease;
}

.delete-btn:hover:not(:disabled) {
  background: #ff357a;
  color: white;
}

/* States */
.loading-state {
  text-align: center;
  padding: 3rem;
  color: rgba(255, 255, 255, 0.7);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: rgba(255, 255, 255, 0.7);
}

.loader {
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #ff357a;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Disabled States */
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header {
    margin-bottom: 2rem;
  }
}

@media (max-width: 768px) {
  .waste-management {
    padding: 1rem;
  }
  
  .form-row {
    flex-direction: column;
  }
  
  .filters-card {
    flex-direction: column;
    gap: 1rem;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .page-header h2 {
    font-size: 2em;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .page-header h2 {
    font-size: 1.8em;
  }
  
  .table-container {
    margin: -1rem;
  }
  
  .logs-table th,
  .logs-table td {
    padding: 0.75rem;
    font-size: 0.9em;
  }
}
</style>
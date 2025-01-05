// src/views/DashboardView.vue
<template>
  <div class="dashboard">
    <!-- Navigation -->
    <nav class="top-nav">
      <div class="nav-content">
        <div class="brand">
          <span class="eco">Eco</span><span class="connect">Connect</span>
        </div>
        <div class="nav-links">
          <router-link to="/waste">Waste Management</router-link>
          <router-link to="/businesses">Sustainable Businesses</router-link>
          <router-link to="/initiatives">Initiatives</router-link>
          <router-link to="/leaderboard">Leaderboard</router-link>
          <router-link to="/profile">Profile</router-link>
        </div>
        <button @click="logout" class="logout-btn">Logout</button>
      </div>
    </nav>

    <!-- Main Dashboard Content -->
    <div class="dashboard-content">
      <div class="welcome-section">
        <h2>Welcome, {{ user?.username }}!</h2>
        <p class="subtitle">Here's your impact summary</p>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <!-- Waste Tracking Stats -->
        <div class="stat-card">
          <h3>Waste Tracking</h3>
          <div v-if="wasteStats" class="stat-content">
            <div v-for="(amount, category) in wasteStats.category_totals" 
                 :key="category" 
                 class="waste-stat">
              <span class="category">{{ category }}</span>
              <span class="amount">{{ amount.toFixed(2) }} kg</span>
            </div>
          </div>
          <div v-else class="placeholder-text">
            Start tracking your waste to see statistics
          </div>
          <router-link to="/waste" class="card-link">Track Waste →</router-link>
        </div>

        <!-- Leaderboard Position -->
        <div class="stat-card">
          <h3>Your Ranking</h3>
          <div v-if="leaderboardStats" class="stat-content">
            <p class="ranking">
              #{{ leaderboardStats.rank }} this week
            </p>
            <p class="ranking-details">
              Total Contributions: {{ leaderboardStats.total_logs || 0 }}
            </p>
          </div>
          <div v-else class="placeholder-text">
            #- on the leaderboard
          </div>
          <router-link to="/leaderboard" class="card-link">View Leaderboard →</router-link>
        </div>

        <!-- Recent Activity -->
        <div class="stat-card">
          <h3>Recent Activity</h3>
          <div v-if="activities.length > 0" class="activities-list stat-content">
            <div v-for="activity in activities.slice(0, 3)" 
                 :key="activity.id" 
                 class="activity-item">
              <span class="activity-content">{{ activity.content }}</span>
              <span class="activity-date">{{ formatDate(activity.created_at) }}</span>
            </div>
          </div>
          <div v-else class="placeholder-text">
            No recent activities
          </div>
          <router-link to="/feed" class="card-link">View All Activities →</router-link>
        </div>

        <!-- Joined Initiatives -->
        <div class="stat-card">
          <h3>Your Initiatives</h3>
          <div v-if="initiatives.length > 0" class="initiatives-list stat-content">
            <div v-for="initiative in initiatives.slice(0, 2)" 
                 :key="initiative.id" 
                 class="initiative-item">
              <h4>{{ initiative.title }}</h4>
              <p>{{ formatDate(initiative.event_date) }}</p>
            </div>
          </div>
          <div v-else class="placeholder-text">
            No initiatives joined yet
          </div>
          <router-link to="/initiatives" class="card-link">Browse Initiatives →</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'DashboardView',
  data() {
    return {
      user: null,
      wasteStats: null,
      leaderboardStats: null,
      activities: [],
      initiatives: []
    }
  },
  async created() {
    this.user = JSON.parse(localStorage.getItem('user'))
    await this.fetchDashboardData()
  },
  methods: {
    async fetchDashboardData() {
      try {
        const [wasteResponse, leaderboardResponse, activitiesResponse, initiativesResponse] = 
          await Promise.all([
            axios.get('http://localhost:5050/api/waste/stats'),
            axios.get('http://localhost:5050/api/social/leaderboard?timeframe=week'),
            axios.get('http://localhost:5050/api/social/feed'),
            axios.get('http://localhost:5050/api/initiatives')
          ])

        this.wasteStats = wasteResponse.data
        
        // Find user's position in leaderboard
        const userRank = leaderboardResponse.data.leaders.findIndex(
          leader => leader.username === this.user.username
        )
        this.leaderboardStats = {
          rank: userRank !== -1 ? userRank + 1 : null,
          ...leaderboardResponse.data.leaders[userRank]
        }

        this.activities = activitiesResponse.data.activities
        this.initiatives = initiativesResponse.data.initiatives?.filter(
          i => i.participants?.includes(this.user.id)
        ) || []

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500&display=swap");

.dashboard {
  min-height: 100vh;
  background: #111;
  color: #fff;
}

/* Navigation Styles */
.top-nav {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  font-size: 1.5em;
  font-weight: 500;
}

.eco {
  background: linear-gradient(45deg, #ff357a, #fff172);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.connect {
  color: #fff;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.9em;
  transition: all 0.3s ease;
}

.nav-links a:hover {
  color: #fff;
}

.nav-links a.router-link-active {
  color: #ff357a;
}

.logout-btn {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 0.5rem 1.5rem;
  border-radius: 40px;
  cursor: pointer;
  font-family: "Quicksand", sans-serif;
  font-size: 0.9em;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  border-color: #ff357a;
  color: #ff357a;
}

/* Dashboard Content Styles */
.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.welcome-section {
  text-align: center;
  margin-bottom: 3rem;
}

.welcome-section h2 {
  font-size: 2em;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.subtitle {
  color: rgba(255, 255, 255, 0.7);
}

/* Stats Grid Styles */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.stat-card h3 {
  color: #ff357a;
  margin-bottom: 1.5rem;
  font-size: 1.2em;
}

.stat-content {
  flex: 1;
  margin-bottom: 1rem;
}

.waste-stat {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
}

.ranking {
  font-size: 2em;
  color: #fff;
  margin-bottom: 0.5rem;
}

.ranking-details {
  color: rgba(255, 255, 255, 0.7);
}

.activity-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-content {
  display: block;
  margin-bottom: 0.25rem;
  color: rgba(255, 255, 255, 0.8);
}

.activity-date {
  font-size: 0.8em;
  color: rgba(255, 255, 255, 0.5);
}

.initiative-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.initiative-item:last-child {
  border-bottom: none;
}

.initiative-item h4 {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.25rem;
}

.initiative-item p {
  font-size: 0.8em;
  color: rgba(255, 255, 255, 0.5);
}

.placeholder-text {
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
  margin-bottom: 1rem;
}

.card-link {
  color: #ff357a;
  text-decoration: none;
  font-size: 0.9em;
  transition: color 0.3s ease;
  margin-top: auto;
}

.card-link:hover {
  color: #fff172;
}

@media (max-width: 768px) {
  .nav-content {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }

  .dashboard-content {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
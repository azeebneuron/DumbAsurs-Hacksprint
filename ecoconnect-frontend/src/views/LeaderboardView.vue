<template>
  <div class="page-container">
    <div class="leaderboard-container">
      <div class="leaderboard-content">
        <h2 class="brand-title">Community Impact</h2>

        <!-- Time Period Selector -->
        <div class="time-selector">
          <button 
            v-for="period in timePeriods" 
            :key="period.value"
            @click="selectedPeriod = period.value"
            :class="{ active: selectedPeriod === period.value }"
          >
            {{ period.label }}
          </button>
        </div>

        <!-- Leaderboard Section -->
        <div class="card-section">
          <h3>Top Contributors</h3>
          
          <div v-if="loading" class="loading">
            Loading leaderboard...
          </div>
          
          <div v-else-if="leaderboard.length === 0" class="no-data">
            No data available for this time period
          </div>
          
          <div v-else class="leaderboard">
            <div v-for="(user, index) in leaderboard" 
                :key="user.username"
                class="leaderboard-item"
                :class="{ 
                  'top-1': index === 0,
                  'top-2': index === 1,
                  'top-3': index === 2
                }"
            >
              <div class="rank">
                <span class="rank-number">{{ index + 1 }}</span>
                <span v-if="index < 3" class="rank-crown">👑</span>
              </div>
              <div class="user-info">
                <div class="username">
                  {{ user.username }}
                  <span v-if="isCurrentUser(user)" class="user-badge">You</span>
                </div>
                <div class="stats">
                  <span class="stat">
                    <span class="icon">📊</span>
                    {{ user.total_logs }} contributions
                  </span>
                  <span class="stat">
                    <span class="icon">⚖️</span>
                    {{ user.total_amount?.toFixed(2) || 0 }} kg tracked
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Your Achievements Section -->
        <div class="card-section">
          <h3>Your Achievements</h3>
          
          <div v-if="loadingAchievements" class="loading">
            Loading achievements...
          </div>
          
          <div v-else-if="achievements.length === 0" class="no-data">
            No achievements yet. Start contributing to earn badges!
          </div>
          
          <div v-else class="achievements-grid">
            <div v-for="achievement in achievements" 
                :key="achievement.id"
                class="achievement-card"
            >
              <div class="achievement-icon">🏆</div>
              <div class="achievement-details">
                <h4>{{ achievement.title }}</h4>
                <p>{{ achievement.description }}</p>
                <span class="achievement-date">
                  Earned on {{ formatDate(achievement.created_at) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Activity Feed -->
        <div class="card-section">
          <h3>Recent Activities</h3>
          
          <div v-if="loadingFeed" class="loading">
            Loading activities...
          </div>
          
          <div v-else-if="feed.length === 0" class="no-data">
            No recent activities
          </div>
          
          <div v-else class="feed-list">
            <div v-for="activity in feed" 
                :key="activity.id"
                class="activity-item"
            >
              <div class="activity-content">
                {{ activity.content }}
              </div>
              <div class="activity-meta">
                {{ formatDate(activity.created_at) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LeaderboardView',
  data() {
    return {
      selectedPeriod: 'week',
      timePeriods: [
        { label: 'This Week', value: 'week' },
        { label: 'This Month', value: 'month' },
        { label: 'All Time', value: 'all-time' }
      ],
      currentUser: JSON.parse(localStorage.getItem('user')),
      leaderboard: [],
      achievements: [],
      feed: [],
      loading: false,
      loadingAchievements: false,
      loadingFeed: false
    }
  },
  watch: {
    selectedPeriod() {
      this.fetchLeaderboard()
    }
  },
  created() {
    this.fetchAllData()
  },
  methods: {
    async fetchAllData() {
      Promise.all([
        this.fetchLeaderboard(),
        this.fetchAchievements(),
        this.fetchActivityFeed()
      ])
    },

    async fetchLeaderboard() {
      this.loading = true
      try {
        const response = await axios.get(
          `http://localhost:5050/api/social/leaderboard?timeframe=${this.selectedPeriod}`
        )
        this.leaderboard = response.data.leaders
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchAchievements() {
      this.loadingAchievements = true
      try {
        const response = await axios.get('http://localhost:5050/api/social/achievements')
        this.achievements = response.data.achievements
      } catch (error) {
        console.error('Error fetching achievements:', error)
      } finally {
        this.loadingAchievements = false
      }
    },

    async fetchActivityFeed() {
      this.loadingFeed = true
      try {
        const response = await axios.get('http://localhost:5050/api/social/feed')
        this.feed = response.data.activities
      } catch (error) {
        console.error('Error fetching activity feed:', error)
      } finally {
        this.loadingFeed = false
      }
    },

    isCurrentUser(user) {
      return user.username === this.currentUser.username
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600&display=swap");

.page-container {
  min-height: 100vh;
  background: #111;
  padding: 2rem;
}

.leaderboard-container {
  max-width: 1000px;
  margin: 0 auto;
}

.leaderboard-content {
  width: 100%;
}

.brand-title {
  font-size: 2em;
  background: linear-gradient(45deg, #ff357a, #fff172);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 2rem;
  text-align: center;
}

/* Time Period Selector */
.time-selector {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.time-selector button {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.time-selector button:hover {
  border-color: rgba(255, 255, 255, 0.4);
  color: rgba(255, 255, 255, 0.9);
}

.time-selector button.active {
  background: linear-gradient(45deg, #ff357a, #fff172);
  border: none;
  color: #111;
  font-weight: 500;
}

/* Card Sections */
.card-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.card-section h3 {
  color: #fff;
  margin-bottom: 1.5rem;
  font-size: 1.5em;
}

/* Leaderboard Items */
.leaderboard-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
}

.leaderboard-item:hover {
  transform: translateY(-2px);
}

.rank {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 1.5rem;
  min-width: 40px;
}

.rank-number {
  font-size: 1.5em;
  font-weight: 600;
  color: #fff;
}

.rank-crown {
  font-size: 1.2em;
  margin-top: 0.2rem;
}

.top-1 {
  background: linear-gradient(45deg, rgba(255, 53, 122, 0.2), rgba(255, 241, 114, 0.2));
  border: 2px solid transparent;
  background-clip: padding-box;
}

.top-2 {
  background: rgba(255, 255, 255, 0.1);
}

.top-3 {
  background: rgba(255, 255, 255, 0.07);
}

.user-info {
  flex-grow: 1;
}

.username {
  color: #fff;
  font-size: 1.1em;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-badge {
  background: linear-gradient(45deg, #ff357a, #fff172);
  color: #111;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.8em;
}

.stats {
  margin-top: 0.5rem;
  display: flex;
  gap: 1.5rem;
}

.stat {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9em;
  display: flex;
  align-items: center;
}

.icon {
  margin-right: 0.5rem;
}

/* Achievements Grid */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.achievement-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: transform 0.3s ease;
}

.achievement-card:hover {
  transform: translateY(-2px);
}

.achievement-icon {
  font-size: 2em;
}

.achievement-details h4 {
  color: #fff;
  margin-bottom: 0.5rem;
}

.achievement-details p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9em;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.achievement-date {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8em;
}

/* Activity Feed */
.feed-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1rem;
}

.activity-content {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
}

.activity-meta {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8em;
}

/* Loading and No Data States */
.loading, .no-data {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  padding: 2rem;
  font-size: 1.1em;
}

@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }

  .time-selector {
    flex-wrap: wrap;
    justify-content: center;
  }

  .stats {
    flex-direction: column;
    gap: 0.5rem;
  }

  .achievements-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .brand-title {
    font-size: 1.5em;
  }

  .time-selector button {
    padding: 0.6rem 1rem;
    font-size: 0.9em;
  }

  .card-section {
    padding: 1rem;
  }

  .leaderboard-item {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .rank {
    margin-right: 0;
  }
}
</style>
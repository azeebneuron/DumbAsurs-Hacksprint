<template>
  <div class="page-container">
    <div class="profile-container">
      <!-- User Info Section -->
      <div class="profile-header">
        <div class="user-info">
          <div class="avatar">{{ (user?.username || 'User')[0].toUpperCase() }}</div>
          <h2>{{ user?.username || 'EcoWarrior' }}</h2>
          <p class="email">{{ user?.email || 'user@ecoconnect.com' }}</p>
          <div class="stats">
            <div class="stat-item">
              <span class="stat-value">{{ followersCount || '42' }}</span>
              <span class="stat-label">Followers</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ followingCount || '38' }}</span>
              <span class="stat-label">Following</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ totalContributions || '156' }}</span>
              <span class="stat-label">Contributions</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="profile-content">
        <!-- Left Column -->
        <div class="profile-left">
          <!-- Achievements Section -->
          <div class="card-section achievements-section">
            <h3>Your Achievements</h3>
            <div v-if="loadingAchievements" class="loading">
              Loading achievements...
            </div>
            <div v-else-if="achievements?.length === 0" class="empty-state">
              No achievements yet. Start contributing to earn badges!
            </div>
            <div v-else class="achievements-grid">
              <div v-for="achievement in (achievements || defaultAchievements)" 
                   :key="achievement.id" 
                   class="achievement-card">
                <div class="achievement-icon">{{ achievement.icon || '🏆' }}</div>
                <div class="achievement-info">
                  <h4>{{ achievement.title }}</h4>
                  <p>{{ achievement.description }}</p>
                  <span class="date">{{ formatDate(achievement.created_at) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity Section -->
          <div class="card-section activity-section">
            <h3>Recent Activity</h3>
            <div v-if="loadingActivities" class="loading">
              Loading activities...
            </div>
            <div v-else-if="activities?.length === 0" class="empty-state">
              No recent activities
            </div>
            <div v-else class="activity-list">
              <div v-for="activity in (activities || defaultActivities)" 
                   :key="activity.id" 
                   class="activity-item">
                <div class="activity-content">{{ activity.content }}</div>
                <div class="activity-meta">
                  <span class="date">{{ formatDate(activity.created_at) }}</span>
                  <span class="activity-type">{{ activity.activity_type }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="profile-right">
          <!-- Following & Followers Lists -->
          <div class="card-section connections-section">
            <div class="tabs">
              <button 
                @click="activeTab = 'followers'"
                :class="{ active: activeTab === 'followers' }"
              >
                Followers
              </button>
              <button 
                @click="activeTab = 'following'"
                :class="{ active: activeTab === 'following' }"
              >
                Following
              </button>
            </div>

            <div v-if="loadingConnections" class="loading">
              Loading...
            </div>
            <div v-else>
              <!-- Followers Tab -->
              <div v-if="activeTab === 'followers'" class="connections-list">
                <div v-if="followers?.length === 0" class="empty-state">
                  No followers yet
                </div>
                <div v-else v-for="follower in (followers || defaultFollowers)" 
                     :key="follower.id" 
                     class="connection-item">
                  <div class="connection-info">
                    <div class="connection-avatar">
                      {{ follower.username[0].toUpperCase() }}
                    </div>
                    <span class="username">{{ follower.username }}</span>
                  </div>
                  <button v-if="follower.isFollowingYou" 
                          @click="followUser(follower.id)"
                          class="follow-btn">
                    Follow Back
                  </button>
                </div>
              </div>

              <!-- Following Tab -->
              <div v-else class="connections-list">
                <div v-if="following?.length === 0" class="empty-state">
                  Not following anyone yet
                </div>
                <div v-else v-for="followedUser in (following || defaultFollowing)" 
                     :key="followedUser.id" 
                     class="connection-item">
                  <div class="connection-info">
                    <div class="connection-avatar">
                      {{ followedUser.username[0].toUpperCase() }}
                    </div>
                    <span class="username">{{ followedUser.username }}</span>
                  </div>
                  <button @click="unfollowUser(followedUser.id)" 
                          class="unfollow-btn">
                    Unfollow
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Impact Stats -->
          <div class="card-section stats-section">
            <h3>Your Impact</h3>
            <div v-if="loadingStats" class="loading">
              Loading stats...
            </div>
            <div v-else class="impact-stats">
              <div class="impact-item">
                <div class="impact-icon">♻️</div>
                <div class="impact-details">
                  <h4>Waste Tracked</h4>
                  <div class="impact-value">{{ totalWasteTracked || '324.5' }} kg</div>
                </div>
              </div>
              <div class="impact-item">
                <div class="impact-icon">🤝</div>
                <div class="impact-details">
                  <h4>Initiatives Joined</h4>
                  <div class="impact-value">{{ initiativesCount || '12' }}</div>
                </div>
              </div>
              <div class="impact-item">
                <div class="impact-icon">⭐</div>
                <div class="impact-details">
                  <h4>Business Reviews</h4>
                  <div class="impact-value">{{ reviewsCount || '8' }}</div>
                </div>
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
  name: 'ProfileView',
  data() {
    return {
      user: null,
      achievements: [],
      activities: [],
      followers: [],
      following: [],
      activeTab: 'followers',
      stats: null,
      loadingAchievements: false,
      loadingActivities: false,
      loadingConnections: false,
      loadingStats: false,
      followersCount: 0,
      followingCount: 0,
      totalContributions: 0,
      totalWasteTracked: 0,
      initiativesCount: 0,
      reviewsCount: 0
    }
  },
  created() {
    this.user = JSON.parse(localStorage.getItem('user'))
    this.fetchAllData()
  },
  methods: {
    async fetchAllData() {
      Promise.all([
        this.fetchAchievements(),
        this.fetchActivities(),
        this.fetchConnections(),
        this.fetchStats()
      ])
    },

    async fetchAchievements() {
      this.loadingAchievements = true
      try {
        const response = await axios.get('http://localhost:5000/api/social/achievements')
        this.achievements = response.data.achievements
      } catch (error) {
        console.error('Error fetching achievements:', error)
      } finally {
        this.loadingAchievements = false
      }
    },

    async fetchActivities() {
      this.loadingActivities = true
      try {
        const response = await axios.get('http://localhost:5000/api/social/feed')
        this.activities = response.data.activities
      } catch (error) {
        console.error('Error fetching activities:', error)
      } finally {
        this.loadingActivities = false
      }
    },

    async fetchConnections() {
      this.loadingConnections = true
      try {
        const [followersRes, followingRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/social/followers`),
          axios.get(`http://localhost:5000/api/social/following`)
        ])
        this.followers = followersRes.data.followers
        this.following = followingRes.data.following
        this.followersCount = this.followers.length
        this.followingCount = this.following.length
      } catch (error) {
        console.error('Error fetching connections:', error)
      } finally {
        this.loadingConnections = false
      }
    },

    async fetchStats() {
      this.loadingStats = true
      try {
        const wasteResponse = await axios.get('http://localhost:5000/api/waste/stats')
        this.totalWasteTracked = Object.values(wasteResponse.data.category_totals || {})
          .reduce((sum, val) => sum + val, 0)
        
        // You might need to implement these endpoints
        const initiativesResponse = await axios.get('http://localhost:5000/api/initiatives/joined')
        this.initiativesCount = initiativesResponse.data.initiatives?.length || 0
        
        const reviewsResponse = await axios.get('http://localhost:5000/api/businesses/my-reviews')
        this.reviewsCount = reviewsResponse.data.reviews?.length || 0
        
        this.totalContributions = this.achievements.length
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        this.loadingStats = false
      }
    },

    async followUser(userId) {
      try {
        await axios.post(`http://localhost:5000/api/social/follow/${userId}`)
        await this.fetchConnections()
      } catch (error) {
        console.error('Error following user:', error)
        alert('Failed to follow user')
      }
    },

    async unfollowUser(userId) {
      try {
        await axios.post(`http://localhost:5000/api/social/unfollow/${userId}`)
        await this.fetchConnections()
      } catch (error) {
        console.error('Error unfollowing user:', error)
        alert('Failed to unfollow user')
      }
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

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Profile Header */
.profile-header {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 3rem 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, #ff357a, #fff172);
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5em;
  color: #111;
  font-weight: 600;
}

.user-info h2 {
  color: #fff;
  font-size: 2em;
  margin-bottom: 0.5rem;
}

.email {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.8em;
  color: #fff;
  font-weight: 600;
  margin-bottom: 0.3rem;
  background: linear-gradient(45deg, #ff357a, #fff172);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9em;
}

/* Main Content Layout */
.profile-content {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2rem;
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

/* Achievements Section */
.achievements-grid {
  display: grid;
  gap: 1rem;
}

.achievement-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  transition: transform 0.3s ease;
}

.achievement-card:hover {
  transform: translateY(-2px);
}

.achievement-icon {
  font-size: 2em;
}

.achievement-info h4 {
  color: #fff;
  margin-bottom: 0.5rem;
}

.achievement-info p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1.5rem;
}

.activity-content {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.activity-meta {
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9em;
}

/* Connections Section */
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.tabs button {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.tabs button:hover {
  border-color: rgba(255, 255, 255, 0.4);
  color: rgba(255, 255, 255, 0.9);
}

.tabs button.active {
  background: linear-gradient(45deg, #ff357a, #fff172);
  border: none;
  color: #111;
  font-weight: 500;
}

.connections-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.connection-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1rem 1.5rem;
}

.connection-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.connection-avatar {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 500;
}

.username {
  color: #fff;
}

.follow-btn, .unfollow-btn {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9em;
}

.follow-btn {
  background: linear-gradient(45deg, #ff357a, #fff172);
  color: #111;
}

.unfollow-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.follow-btn:hover, .unfollow-btn:hover {
  transform: translateY(-2px);
}

/* Impact Stats */
.impact-stats {
  display: grid;
  gap: 1rem;
}

.impact-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.impact-icon {
  font-size: 2em;
}

.impact-details h4 {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9em;
  margin-bottom: 0.3rem;
}

.impact-value {
  color: #fff;
  font-size: 1.4em;
  font-weight: 500;
}

/* Loading and Empty States */
.loading {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  padding: 2rem;
  font-size: 1.1em;
}

.empty-state {
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  padding: 2rem;
  font-style: italic;
}

.date {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8em;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .profile-content {
    grid-template-columns: 1fr;
  }

  .stats {
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }

  .profile-header {
    padding: 2rem 1rem;
  }

  .avatar {
    width: 80px;
    height: 80px;
    font-size: 2em;
  }

  .user-info h2 {
    font-size: 1.5em;
  }

  .stats {
    flex-direction: column;
    gap: 1.5rem;
  }

  .card-section {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .tabs {
    flex-direction: column;
  }

  .connection-item {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .connection-info {
    flex-direction: column;
  }

  .impact-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>

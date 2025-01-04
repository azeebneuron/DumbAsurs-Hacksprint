<template>
  <div class="page-container">
    <div class="initiatives-container">
      <div class="initiatives-content">
        <div class="header">
          <h2 class="brand-title">Community Initiatives</h2>
          <button @click="showCreateForm = !showCreateForm" class="action-button">
            {{ showCreateForm ? '✕ Cancel' : '+ Create New Initiative' }}
          </button>
        </div>

        <!-- Create Initiative Form -->
        <div v-if="showCreateForm" class="form-card">
          <h3>Create New Initiative</h3>
          <form @submit.prevent="createInitiative">
            <div class="form-group">
              <label>Title *</label>
              <div class="inputBx">
                <input 
                  type="text" 
                  v-model="newInitiative.title" 
                  required
                  placeholder="Enter initiative title"
                >
              </div>
            </div>

            <div class="form-group">
              <label>Description *</label>
              <div class="inputBx">
                <textarea 
                  v-model="newInitiative.description" 
                  required
                  rows="3"
                  placeholder="Describe your initiative"
                ></textarea>
              </div>
            </div>

            <div class="form-group">
              <label>Location *</label>
              <div class="inputBx">
                <input 
                  type="text" 
                  v-model="newInitiative.location" 
                  required
                  placeholder="Event location"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Event Date *</label>
                <div class="inputBx">
                  <input 
                    type="datetime-local" 
                    v-model="newInitiative.event_date" 
                    required
                  >
                </div>
              </div>

              <div class="form-group">
                <label>Duration (hours) *</label>
                <div class="inputBx">
                  <input 
                    type="number" 
                    v-model="newInitiative.duration_hours" 
                    required
                    min="1"
                  >
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Maximum Participants</label>
              <div class="inputBx">
                <input 
                  type="number" 
                  v-model="newInitiative.max_participants" 
                  min="1"
                  placeholder="Default: 50"
                >
              </div>
            </div>

            <div class="form-group">
              <label>Requirements</label>
              <div class="inputBx">
                <textarea 
                  v-model="newInitiative.requirements" 
                  rows="2"
                  placeholder="What should participants bring?"
                ></textarea>
              </div>
            </div>

            <div class="form-group">
              <label>Contact Info</label>
              <div class="inputBx">
                <input 
                  type="text" 
                  v-model="newInitiative.contact_info" 
                  placeholder="How can participants reach you?"
                >
              </div>
            </div>

            <div class="inputBx">
              <input 
                type="submit" 
                :value="isSubmitting ? 'Creating...' : 'Create Initiative'"
                :disabled="isSubmitting"
              >
            </div>
          </form>
        </div>

        <!-- Filters -->
        <div class="filters">
          <div class="inputBx search">
            <input 
              type="text" 
              v-model="filters.location" 
              placeholder="Filter by location..."
              @input="filterInitiatives"
            >
          </div>
          <div class="inputBx select">
            <select v-model="filters.status" @change="filterInitiatives">
              <option value="upcoming">Upcoming</option>
              <option value="all">All Initiatives</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <!-- Initiatives Grid -->
        <div v-if="!loading" class="initiatives-grid">
          <div v-for="initiative in initiatives" 
               :key="initiative.id" 
               class="initiative-card"
               :class="initiative.status"
          >
            <div class="initiative-status">{{ initiative.status }}</div>
            
            <div class="initiative-content">
              <h3>{{ initiative.title }}</h3>
              <p class="description">{{ initiative.description }}</p>
              
              <div class="initiative-details">
                <p><span class="icon">📍</span> {{ initiative.location }}</p>
                <p><span class="icon">📅</span> {{ formatDate(initiative.event_date) }}</p>
                <p><span class="icon">⏱️</span> Duration: {{ initiative.duration_hours }} hours</p>
                
                <div class="participants-info">
                  <p>
                    <span class="icon">👥</span> Participants: {{ getParticipantCount(initiative) }}/
                    {{ initiative.max_participants || 50 }}
                  </p>
                  <button 
                    @click="showParticipants[initiative.id] ? hideParticipants(initiative.id) : showParticipantsList(initiative.id)"
                    class="toggle-btn"
                  >
                    {{ showParticipants[initiative.id] ? 'Hide' : 'Show' }} Participants
                  </button>
                </div>

                <div v-if="showParticipants[initiative.id]" class="participants-list">
                  <template v-if="initiative.participantsList?.length">
                    <div 
                      v-for="participant in initiative.participantsList" 
                      :key="participant.id"
                      class="participant-item"
                    >
                      {{ participant.username }}
                    </div>
                  </template>
                  <div v-else class="no-participants">No participants yet</div>
                </div>
              </div>

              <div v-if="initiative.requirements" class="requirements">
                <strong>Requirements:</strong>
                <p>{{ initiative.requirements }}</p>
              </div>

              <div v-if="initiative.contact_info" class="contact-info">
                <strong>Contact:</strong>
                <p>{{ initiative.contact_info }}</p>
              </div>

              <div class="initiative-actions">
                <div v-if="isCreator(initiative)">
                  <span class="creator-badge">Creator</span>
                  <div v-if="initiative.status === 'upcoming'" class="creator-actions">
                    <button @click="initiative.showEditForm = !initiative.showEditForm" class="edit-btn">
                      Edit
                    </button>
                    <button @click="updateStatus(initiative.id, 'completed')" class="complete-btn">
                      Mark Complete
                    </button>
                  </div>
                </div>
                <div v-else-if="initiative.status === 'upcoming'" class="join-section">
                  <button 
                    v-if="!hasJoined(initiative)"
                    @click="joinInitiative(initiative.id)"
                    :disabled="isJoining"
                    class="join-btn"
                  >
                    Join Initiative
                  </button>
                  <div v-else class="joined-status">
                    ✓ Joined
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="loading" class="loading">
          Loading initiatives...
        </div>
        <div v-else class="no-initiatives">
          No initiatives found
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'InitiativesView',
  data() {
    return {
      initiatives: [],
      loading: true,
      showCreateForm: false,
      isSubmitting: false,
      isJoining: false,
      currentUser: JSON.parse(localStorage.getItem('user')),
      showParticipants: {},
      filters: {
        location: '',
        status: 'upcoming'
      },
      newInitiative: {
        title: '',
        description: '',
        location: '',
        event_date: '',
        duration_hours: 1,
        max_participants: 50,
        requirements: '',
        contact_info: ''
      }
    }
  },
  async created() {
    await this.fetchInitiatives()
  },
  methods: {
    async fetchInitiatives() {
      this.loading = true
      try {
        let url = 'http://localhost:5000/api/initiatives'
        const params = new URLSearchParams()
        
        if (this.filters.location) {
          params.append('location', this.filters.location)
        }
        if (this.filters.status !== 'all') {
          params.append('status', this.filters.status)
        }

        if (params.toString()) {
          url += `?${params.toString()}`
        }

        const response = await axios.get(url)
        this.initiatives = response.data.initiatives.map(initiative => ({
          ...initiative,
          showEditForm: false,
          participantsList: []
        }))

      } catch (error) {
        console.error('Error fetching initiatives:', error)
      } finally {
        this.loading = false
      }
    },

    async showParticipantsList(initiativeId) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/initiatives/${initiativeId}/participants`
        )
        const initiative = this.initiatives.find(i => i.id === initiativeId)
        if (initiative) {
          initiative.participantsList = response.data.participants
        }
        this.$set(this.showParticipants, initiativeId, true)
      } catch (error) {
        console.error('Error fetching participants:', error)
      }
    },

    hideParticipants(initiativeId) {
      this.$set(this.showParticipants, initiativeId, false)
    },

    async createInitiative() {
      this.isSubmitting = true
      try {
        await axios.post('http://localhost:5000/api/initiatives', this.newInitiative)
        this.showCreateForm = false
        this.resetForm()
        await this.fetchInitiatives()
        alert('Initiative created successfully!')
      } catch (error) {
        console.error('Error creating initiative:', error)
        alert(error.response?.data?.error || 'Failed to create initiative')
      } finally {
        this.isSubmitting = false
      }
    },

    async joinInitiative(id) {
      this.isJoining = true
      try {
        await axios.post(`http://localhost:5000/api/initiatives/${id}/join`)
        await this.fetchInitiatives()
        alert('Successfully joined the initiative!')
      } catch (error) {
        console.error('Error joining initiative:', error)
        alert(error.response?.data?.error || 'Failed to join initiative')
      } finally {
        this.isJoining = false
      }
    },

    async updateStatus(id, status) {
      try {
        await axios.put(`http://localhost:5000/api/initiatives/${id}`, {
          status: status
        })
        await this.fetchInitiatives()
      } catch (error) {
        console.error('Error updating initiative:', error)
        alert('Failed to update initiative status')
      }
    },

    isCreator(initiative) {
      return initiative.created_by === this.currentUser.id
    },

    hasJoined(initiative) {
      return initiative.participants?.includes(this.currentUser.id)
    },

    getParticipantCount(initiative) {
      return initiative.participants?.length || 0
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    resetForm() {
      this.newInitiative = {
        title: '',
        description: '',
        location: '',
        event_date: '',
        duration_hours: 1,
        max_participants: 50,
        requirements: '',
        contact_info: ''
      }
    },

    filterInitiatives() {
      this.fetchInitiatives()
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

.initiatives-container {
  max-width: 1200px;
  margin: 0 auto;
}

.initiatives-content {
  width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.brand-title {
  font-size: 2em;
  background: linear-gradient(45deg, #ff357a, #fff172);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0;
}

.action-button {
  background: linear-gradient(45deg, #ff357a, #fff172);
  border: none;
  border-radius: 40px;
  padding: 12px 24px;
  color: #111;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.action-button:hover {
  transform: translateY(-2px);
}

/* Form Styles */
.form-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.form-card h3 {
  color: #fff;
  margin-bottom: 1.5rem;
  font-size: 1.5em;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  display: block;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
  font-size: 0.9em;
}

.inputBx {
  position: relative;
  width: 100%;
}

.inputBx input,
.inputBx textarea,
.inputBx select {
  width: 100%;
  padding: 12px 20px;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 40px;
  font-size: 1em;
  color: #fff;
  outline: none;
  transition: all 0.3s ease;
}

.inputBx textarea {
  border-radius: 20px;
  resize: vertical;
  min-height: 100px;
}

.inputBx input:focus,
.inputBx textarea:focus,
.inputBx select:focus {
  border-color: rgba(255, 255, 255, 0.8);
}

.inputBx input::placeholder,
.inputBx textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.inputBx input[type="submit"] {
  background: linear-gradient(45deg, #ff357a, #fff172);
  border: none;
  color: #111;
  cursor: pointer;
  font-weight: 500;
  margin-top: 1rem;
}

.inputBx input[type="submit"]:hover {
  transform: translateY(-2px);
}

.inputBx input[type="submit"]:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* Filters */
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filters .inputBx {
  flex: 1;
}

.filters .search input {
  padding-left: 40px;
}

.filters .select select {
  padding-right: 40px;
  cursor: pointer;
}

/* Initiatives Grid */
.initiatives-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.initiative-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 1.5rem;
  position: relative;
  transition: transform 0.3s ease;
}

.initiative-card:hover {
  transform: translateY(-5px);
}

.initiative-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8em;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.initiative-card.completed .initiative-status {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.initiative-content h3 {
  color: #fff;
  margin-bottom: 1rem;
  padding-right: 100px;
}

.description {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.initiative-details {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1.5rem;
}

.initiative-details p {
  margin-bottom: 0.5rem;
}

.icon {
  margin-right: 0.5rem;
}

.participants-info {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.participants-list {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
}

.participant-item {
  color: rgba(255, 255, 255, 0.8);
  padding: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.participant-item:last-child {
  border-bottom: none;
}

.no-participants {
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  padding: 1rem;
}

.requirements, .contact-info {
  margin-top: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
}

.requirements strong, .contact-info strong {
  color: #fff;
  display: block;
  margin-bottom: 0.5rem;
}

.initiative-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.creator-badge {
  background: linear-gradient(45deg, #ff357a, #fff172);
  color: #111;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8em;
  font-weight: 500;
}

.creator-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.edit-btn, .complete-btn {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.3s ease;
}

.edit-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.complete-btn {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.edit-btn:hover, .complete-btn:hover {
  transform: translateY(-2px);
}

.join-btn {
  background: linear-gradient(45deg, #ff357a, #fff172);
  color: #111;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.join-btn:hover {
  transform: translateY(-2px);
}

.join-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.joined-status {
  color: #4CAF50;
  font-weight: 500;
}

.loading, .no-initiatives {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  padding: 3rem;
  font-size: 1.2em;
}

@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }
  
  .header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .initiatives-grid {
    grid-template-columns: 1fr;
  }
  
  .participants-info {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .brand-title {
    font-size: 1.5em;
  }
  
  .initiative-card {
    padding: 1rem;
  }
  
  .creator-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
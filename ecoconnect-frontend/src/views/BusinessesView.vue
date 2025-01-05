<template>
  <div class="page-container">
    <!-- Top Bar with Search and Filters -->
    <div class="top-bar">
      <div class="left-section">
        <h2>Sustainable Businesses</h2>
        <div class="quick-filters">
          <div class="filter-pills">
            <button 
              v-for="category in categories" 
              :key="category.value"
              :class="['filter-pill', { active: filters.category === category.value }]"
              @click="selectCategory(category.value)"
            >
              {{ category.label }}
            </button>
          </div>
        </div>
      </div>
      <div class="right-section">
        <button @click="showAddForm = !showAddForm" class="add-btn">
          {{ showAddForm ? 'Cancel' : '+ Add Business' }}
        </button>
      </div>
    </div>

    <!-- Advanced Filters Panel -->
    <div class="advanced-filters">
      <div class="filter-group">
        <label>Min Rating:</label>
        <select v-model="filters.minRating" @change="fetchBusinesses">
          <option :value="null">Any Rating</option>
          <option v-for="n in 5" :key="n" :value="n">{{ n }}+ Stars</option>
        </select>
      </div>

      <div class="filter-group verified-filter">
        <label>
          <input 
            type="checkbox" 
            v-model="filters.verified"
            @change="fetchBusinesses"
          >
          Show Verified Only
        </label>
      </div>
    </div>

    <!-- Add Business Form Modal -->
    <div v-if="showAddForm" class="modal-overlay" @click.self="showAddForm = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Add New Business</h3>
          <button class="close-btn" @click="showAddForm = false">×</button>
        </div>
        <form @submit.prevent="addBusiness" class="business-form">
          <div class="form-group">
            <label>Business Name *</label>
            <input 
              type="text" 
              v-model="newBusiness.name" 
              required
              placeholder="Enter business name"
            >
          </div>

          <div class="form-group">
            <label>Category *</label>
            <select v-model="newBusiness.category" required>
              <option value="">Select Category</option>
              <option 
                v-for="category in categories" 
                :key="category.value" 
                :value="category.value"
              >
                {{ category.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea 
              v-model="newBusiness.description" 
              rows="3"
              placeholder="Describe the business"
            ></textarea>
          </div>

          <div class="form-group">
            <label>Address *</label>
            <input 
              type="text" 
              v-model="newBusiness.address" 
              required
              placeholder="Enter business address"
            >
          </div>

          <button type="submit" class="submit-btn" :disabled="isSubmitting">
            {{ isSubmitting ? 'Adding...' : 'Add Business' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loader"></div>
        <p>Discovering eco-friendly businesses...</p>
      </div>

      <!-- No Results State -->
      <div v-else-if="businesses.length === 0" class="empty-state">
        <p>No businesses found matching your criteria</p>
        <button @click="resetFilters" class="reset-btn">Reset Filters</button>
      </div>

      <!-- Businesses Grid -->
      <div v-else class="businesses-grid">
        <div v-for="business in businesses" 
             :key="business.id" 
             class="business-card"
        >
          <div class="card-header">
            <h3>{{ business.name }}</h3>
            <div v-if="business.verified" class="verified-badge">
              <span class="verified-icon">✓</span> Verified
            </div>
          </div>

          <div class="card-meta">
            <span class="business-category">{{ formatCategory(business.category) }}</span>
            <div class="business-rating">
              <div class="stars">
                <span v-for="n in 5" :key="n" 
                      :class="['star', { filled: n <= Math.round(business.rating || 0) }]">
                  ★
                </span>
              </div>
              <span class="rating-text">{{ business.rating?.toFixed(1) || 'Not Rated' }}</span>
            </div>
          </div>

          <p class="business-description">{{ business.description }}</p>
          <p class="business-address">📍 {{ business.address }}</p>

          <!-- Reviews Section -->
          <div class="reviews-section">
            <div class="reviews-header">
              <h4>Recent Reviews</h4>
              <button 
                @click="business.showReviewForm = !business.showReviewForm"
                class="review-btn"
              >
                Write Review
              </button>
            </div>

            <!-- Review Form -->
            <div v-if="business.showReviewForm" class="review-form">
              <form @submit.prevent="submitReview(business.id)">
                <div class="rating-select">
                  <label>Your Rating</label>
                  <div class="star-rating">
                    <span 
                      v-for="n in 5" 
                      :key="n"
                      :class="['star', { selected: newReview.rating >= n }]"
                      @click="newReview.rating = n"
                    >★</span>
                  </div>
                </div>

                <div class="form-group">
                  <label>Your Review</label>
                  <textarea 
                    v-model="newReview.comment"
                    rows="2"
                    required
                    placeholder="Share your experience..."
                  ></textarea>
                </div>

                <button type="submit" :disabled="isSubmittingReview">
                  {{ isSubmittingReview ? 'Submitting...' : 'Post Review' }}
                </button>
              </form>
            </div>

            <div v-if="business.reviews?.length" class="reviews-list">
              <div v-for="review in business.reviews.slice(0, 3)" 
                   :key="review.id" 
                   class="review-item">
                <div class="review-stars">
                  <span v-for="n in 5" :key="n" 
                        :class="['star', { filled: n <= review.rating }]">★</span>
                </div>
                <p class="review-comment">{{ review.comment }}</p>
                <span class="review-date">{{ formatDate(review.created_at) }}</span>
              </div>
            </div>
            <div v-else class="no-reviews">
              Be the first to review
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
  name: 'BusinessesView',
  
  data() {
    return {
      businesses: [],
      loading: true,
      showAddForm: false,
      isSubmitting: false,
      isSubmittingReview: false,
      filters: {
        category: '',
        minRating: null,
        verified: false
      },
      newBusiness: {
        name: '',
        category: '',
        description: '',
        address: ''
      },
      newReview: {
        rating: '',
        comment: ''
      },
      categories: [
        { value: '', label: 'All' },
        { value: 'zero_waste_store', label: 'Zero Waste' },
        { value: 'eco_friendly_cafe', label: 'Eco Café' },
        { value: 'sustainable_fashion', label: 'Fashion' },
        { value: 'recycling_center', label: 'Recycling' },
        { value: 'repair_shop', label: 'Repair' }
      ]
    }
  },

  created() {
    this.fetchBusinesses()
  },

  methods: {
    async fetchBusinesses() {
      this.loading = true
      try {
        let url = 'http://localhost:5050/api/businesses'
        const params = new URLSearchParams()

        if (this.filters.category) {
          params.append('category', this.filters.category)
        }
        if (this.filters.minRating) {
          params.append('min_rating', this.filters.minRating)
        }
        if (this.filters.verified) {
          params.append('verified', true)
        }

        if (params.toString()) {
          url += `?${params.toString()}`
        }

        const response = await axios.get(url)
        this.businesses = response.data.businesses.map(business => ({
          ...business,
          showReviewForm: false
        }))

        // Fetch reviews for each business in parallel
        await Promise.all(
          this.businesses.map(async (business) => {
            try {
              const reviewsResponse = await axios.get(
                `http://localhost:5050/api/businesses/${business.id}/reviews`
              )
              business.reviews = reviewsResponse.data.reviews
            } catch (error) {
              console.error(`Error fetching reviews for business ${business.id}:`, error)
              business.reviews = []
            }
          })
        )
      } catch (error) {
        console.error('Error fetching businesses:', error)
      } finally {
        this.loading = false
      }
    },

    async addBusiness() {
      this.isSubmitting = true
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('Authentication required')

        await axios.post(
          'http://localhost:5050/api/businesses', 
          this.newBusiness,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        this.showAddForm = false
        this.resetNewBusiness()
        await this.fetchBusinesses()
      } catch (error) {
        console.error('Error adding business:', error)
        alert(error.response?.data?.error || 'Failed to add business')
      } finally {
        this.isSubmitting = false
      }
    },

    async submitReview(businessId) {
      this.isSubmittingReview = true
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('Authentication required')

        await axios.post(
          `http://localhost:5050/api/businesses/${businessId}/review`,
          this.newReview,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        const business = this.businesses.find(b => b.id === businessId)
        if (business) {
          business.showReviewForm = false
        }
        this.resetNewReview()
        await this.fetchBusinesses()
      } catch (error) {
        console.error('Error submitting review:', error)
        alert(error.response?.data?.error || 'Failed to submit review')
      } finally {
        this.isSubmittingReview = false
      }
    },

    formatCategory(category) {
      return this.categories.find(c => c.value === category)?.label || 
             category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },

    resetNewBusiness() {
      this.newBusiness = {
        name: '',
        category: '',
        description: '',
        address: ''
      }
    },

    resetNewReview() {
      this.newReview = {
        rating: '',
        comment: ''
      }
    },

    resetFilters() {
      this.filters = {
        category: '',
        minRating: null,
        verified: false
      }
      this.fetchBusinesses()
    },

    selectCategory(category) {
      this.filters.category = category
      this.fetchBusinesses()
    }
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600&display=swap");

.page-container {
  min-height: 100vh;
  background: #111;
  color: #fff;
  padding: 2rem;
}

/* Top Bar Styles */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.left-section h2 {
  font-size: 2em;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #ff357a, #fff172);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.quick-filters {
  margin-top: 1rem;
}

.filter-pills {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-pill {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-pill:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.filter-pill.active {
  background: #ff357a;
  border-color: #ff357a;
  color: white;
}

/* Advanced Filters */
.advanced-filters {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-group select {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  outline: none;
}

.filter-group option {
  background: #111;
  color: white;
}

/* Add Button */
.add-btn {
  background: linear-gradient(45deg, #ff357a, #fff172);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  color: #111;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.add-btn:hover {
  transform: translateY(-2px);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #1a1a1a;
  border-radius: 20px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

/* Form Styles */
.business-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: rgba(255, 255, 255, 0.9);
}

.form-group input,
.form-group select,
.form-group textarea {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  color: white;
  font-family: "Quicksand", sans-serif;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ff357a;
}

/* Businesses Grid */
.businesses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.business-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.business-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.verified-badge {
  background: rgba(66, 185, 131, 0.2);
  color: #42b983;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8em;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.business-category {
  color: #ff357a;
  font-size: 0.9em;
}

.stars {
  color: #fff172;
  letter-spacing: 2px;
}

.star {
  color: rgba(255, 255, 255, 0.2);
}

.star.filled {
  color: #fff172;
}

.business-description {
  color: rgba(255, 255, 255, 0.8);
  margin: 1rem 0;
  line-height: 1.5;
}

.business-address {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9em;
  margin-bottom: 1rem;
}

/* Reviews Section */
.reviews-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.review-btn {
  background: transparent;
  border: 1px solid #ff357a;
  color: #ff357a;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.review-btn:hover {
  background: #ff357a;
  color: white;
}

.review-form {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  margin: 1rem 0;
}

.star-rating {
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.star-rating .star {
  cursor: pointer;
  font-size: 1.5em;
  transition: color 0.3s ease;
}

.star-rating .star.selected {
  color: #fff172;
}

.review-item {
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.review-item:last-child {
  border-bottom: none;
}

.review-comment {
  color: rgba(255, 255, 255, 0.8);
  margin: 0.5rem 0;
}

.review-date {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8em;
}

/* Loading & Empty States */
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

.reset-btn {
  margin-top: 1rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }
  
  .top-bar {
    flex-direction: column;
    gap: 1rem;
  }
  
  .right-section {
    width: 100%;
  }
  
  .add-btn {
    width: 100%;
  }
  
  .advanced-filters {
    flex-direction: column;
    gap: 1rem;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .filter-group select {
    flex: 1;
  }
}
</style>
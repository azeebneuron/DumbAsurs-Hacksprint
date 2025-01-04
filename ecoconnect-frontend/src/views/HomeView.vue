<template>
  <div class="home">
    <div class="hero-section">
      <h1 class="title">Welcome to <span class="highlight">EcoConnect</span></h1>
      <p class="subtitle">Connect with your local community to create a sustainable future</p>
      
      <div class="features-container">
        <div class="features-track">
          <!-- First set of cards -->
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <span class="feature-icon">♻️</span>
            </div>
            <h3>Find Recycling Centers</h3>
            <p>Locate nearby recycling facilities and learn proper waste management</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <span class="feature-icon">🌿</span>
            </div>
            <h3>Community Gardens</h3>
            <p>Discover and join local community gardens and farming initiatives</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <span class="feature-icon">🏪</span>
            </div>
            <h3>Eco-Friendly Stores</h3>
            <p>Support local businesses that prioritize sustainable practices</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <span class="feature-icon">👥</span>
            </div>
            <h3>Connect & Share</h3>
            <p>Join discussions and share eco-friendly tips with your community</p>
          </div>

          <!-- Duplicate set for seamless scrolling -->
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <span class="feature-icon">♻️</span>
            </div>
            <h3>Find Recycling Centers</h3>
            <p>Locate nearby recycling facilities and learn proper waste management</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <span class="feature-icon">🌿</span>
            </div>
            <h3>Community Gardens</h3>
            <p>Discover and join local community gardens and farming initiatives</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <span class="feature-icon">🏪</span>
            </div>
            <h3>Eco-Friendly Stores</h3>
            <p>Support local businesses that prioritize sustainable practices</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <span class="feature-icon">👥</span>
            </div>
            <h3>Connect & Share</h3>
            <p>Join discussions and share eco-friendly tips with your community</p>
          </div>
        </div>
      </div>

      <div class="cta-section" v-if="!isLoggedIn">
        <router-link to="/signup" class="cta-button primary">Join Our Community</router-link>
        <router-link to="/login" class="cta-button secondary">Already a Member?</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('token')
    }
  }
}
</script>

<style scoped>
.home {
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background: #111;
  overflow: hidden;
}

.hero-section {
  text-align: center;
  padding: 2rem 0;
  position: relative;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(0, 255, 10, 0.1) 0%, rgba(17, 17, 17, 0) 50%);
  z-index: -1;
  pointer-events: none;
}

.title {
  font-size: 3.5rem;
  font-weight: 300;
  color: #fff;
  margin-bottom: 1rem;
  letter-spacing: 2px;
}

.highlight {
  background: linear-gradient(45deg, #00ff0a, #fff172);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 500;
}

.subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 600px;
  margin: 0 auto 4rem;
  font-weight: 300;
  letter-spacing: 0.5px;
}

.features-container {
  width: 100%;
  overflow: hidden;
  padding: 2rem 0;
  position: relative;
  -ms-overflow-style: none;  /* Hide scrollbar for IE and Edge */
  scrollbar-width: none;  /* Hide scrollbar for Firefox */
}

/* Hide scrollbar for Chrome, Safari and Opera */
.features-container::-webkit-scrollbar {
  display: none;
}

/* Global scrollbar hiding */
body {
  overflow: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

body::-webkit-scrollbar {
  display: none;
}

.features-container::before,
.features-container::after {
  content: '';
  position: absolute;
  top: 0;
  width: 150px;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.features-container::before {
  left: 0;
  background: linear-gradient(to right, #111, transparent);
}

.features-container::after {
  right: 0;
  background: linear-gradient(to left, #111, transparent);
}

.features-track {
  display: flex;
  gap: 2rem;
  animation: scroll 40s linear infinite;
  width: max-content;
  padding: 0 1rem;
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow: hidden;
}

.features-track::-webkit-scrollbar {
  display: none;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-100% / 2));
  }
}

.features-track:hover {
  animation-play-state: paused;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  width: 300px;
  flex-shrink: 0;
}

.feature-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.08);
}

.feature-icon-wrapper {
  background: rgba(255, 255, 255, 0.1);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.feature-icon {
  font-size: 2rem;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
}

.feature-card h3 {
  color: #fff;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  font-weight: 400;
  letter-spacing: 0.5px;
}

.feature-card p {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  font-weight: 300;
}

.cta-section {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  align-items: center;
  margin-top: 3rem;
}

.cta-button {
  text-decoration: none;
  padding: 0.75rem 2rem;
  border-radius: 40px;
  font-weight: 400;
  font-size: 1rem;
  transition: all 0.3s ease;
  letter-spacing: 1px;
}

.cta-button.primary {
  background: linear-gradient(45deg, #ff357a, #fff172);
  color: white;
  text-transform: uppercase;
  font-size: 0.9rem;
}

.cta-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 53, 122, 0.3);
}

.cta-button.secondary {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.cta-button.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1.1rem;
    padding: 0 1rem;
  }
  
  .feature-icon-wrapper {
    width: 60px;
    height: 60px;
  }

  .feature-icon {
    font-size: 1.75rem;
  }

  .feature-card {
    width: 250px;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 2rem;
  }
  
  .cta-section {
    flex-direction: column;
    width: 100%;
  }
  
  .cta-button {
    width: 100%;
    text-align: center;
  }
}
</style>
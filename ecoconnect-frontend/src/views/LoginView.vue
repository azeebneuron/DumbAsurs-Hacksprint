<template>
  <div class="page-container">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h2 class="brand-title">
            <span class="eco">Eco</span><span class="connect">Connect</span>
          </h2>
          <p class="welcome-text">Welcome back to your eco journey</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <div class="inputBx">
              <input
                type="email"
                v-model="email"
                placeholder="Email"
                required
              >
            </div>
          </div>
          
          <div class="form-group">
            <div class="inputBx">
              <input
                type="password"
                v-model="password"
                placeholder="Password"
                required
              >
            </div>
          </div>
          
          <p v-if="error" class="error-message">{{ error }}</p>
          
          <div class="inputBx">
            <input type="submit" value="Login">
          </div>
          
          <div class="links">
            <router-link to="/signup">Need an account?</router-link>
            <router-link to="/forgot-password">Forgot Password?</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@300&display=swap");

.page-container {
  min-height: 100vh;
  background: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
  width: 100%;
  max-width: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  width: 100%;
  padding: 2.5rem;
}

.login-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.brand-title {
  font-size: 2em;
  color: #fff;
  margin-bottom: 1rem;
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

.welcome-text {
  color: rgba(255, 255, 255, 0.75);
  font-size: 1.1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.inputBx {
  position: relative;
  width: 100%;
}

.inputBx input {
  position: relative;
  width: 100%;
  padding: 12px 20px;
  background: transparent;
  border: 2px solid #fff;
  border-radius: 40px;
  font-size: 1.2em;
  color: #fff;
  box-shadow: none;
  outline: none;
  transition: all 0.3s ease;
}

.inputBx input:focus {
  border-color: rgba(255, 255, 255, 0.8);
}

.inputBx input::placeholder {
  color: rgba(255, 255, 255, 0.75);
}

.inputBx input[type="submit"] {
  background: linear-gradient(45deg, #ff357a, #fff172);
  border: none;
  cursor: pointer;
  font-weight: 500;
  margin-top: 1rem;
  transition: transform 0.3s ease;
}

.inputBx input[type="submit"]:hover {
  transform: translateY(-2px);
}

.error-message {
  color: #ff357a;
  text-align: center;
  margin: 1rem 0;
  font-size: 0.9rem;
}

.links {
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}

.links a {
  color: #fff;
  text-decoration: none;
  font-size: 0.9em;
  transition: color 0.3s ease;
}

.links a:hover {
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
  }
  
  .brand-title {
    font-size: 1.8em;
  }
  
  .inputBx input {
    font-size: 1em;
  }
  
  .links {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>

<script>
import axios from 'axios'

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      error: null
    }
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email: this.email,
          password: this.password
        })

        localStorage.setItem('token', response.data.access_token)
        localStorage.setItem('refreshToken', response.data.refresh_token)
        localStorage.setItem('user', JSON.stringify(response.data.user))

        // Check if user is admin and redirect accordingly
        if (response.data.user.email === 'admin@ecoconnect.com') {
          this.$router.push('/admin-dashboard')
        } else {
          this.$router.push('/dashboard')
        }
      } catch (err) {
        this.error = err.response?.data?.error || 'Login failed'
      }
    }
  }
}
</script>
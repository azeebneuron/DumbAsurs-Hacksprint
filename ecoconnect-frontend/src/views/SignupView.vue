<template>
  <div class="page-container">
    <div class="signup-container">
      <div class="signup-card">
        <div class="signup-header">
          <h2 class="brand-title">
            <span class="eco">Eco</span><span class="connect">Connect</span>
          </h2>
          <p class="welcome-text">Start your sustainable journey with us</p>
        </div>
        
        <form @submit.prevent="handleSignup" class="signup-form">
          <div class="form-group">
            <div class="inputBx">
              <input
                type="text"
                v-model="username"
                placeholder="Username"
                required
              >
            </div>
          </div>
          
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
            <input type="submit" value="Create Account">
          </div>
          
          <div class="links">
            <router-link to="/login">Already have an account?</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

  <script>
  import axios from 'axios'

  export default {
    name: 'SignupView',
    data() {
      return {
        username: '',
        email: '',
        password: '',
        error: null
      }
    },
    methods: {
      async handleSignup() {
        try {
          await axios.post('http://localhost:5000/api/auth/signup', {
            username: this.username,
            email: this.email,
            password: this.password
          })

          this.error = null
          alert('Signup successful! Please login with your credentials.')
          this.$router.push('/login')
        } catch (err) {
          this.error = err.response?.data?.error || 'Signup failed'
        }
      }
    }
  }
  </script>
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

.signup-container {
  width: 100%;
  max-width: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.signup-card {
  width: 100%;
  padding: 2.5rem;
}

.signup-header {
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
  text-align: center;
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
  .signup-card {
    padding: 1.5rem;
  }
  
  .brand-title {
    font-size: 1.8em;
  }
  
  .inputBx input {
    font-size: 1em;
  }
}
</style>
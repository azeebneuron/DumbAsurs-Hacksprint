<template>   
  <div id="app">     
    <nav class="navbar">       
      <div class="nav-logo">         
        <router-link to="/" class="logo">           
          <span class="logo-icon">🌱</span>
          <span class="logo-text">EcoConnect</span>
        </router-link>       
      </div>              
      
      <div class="nav-links">         
        <router-link to="/" class="nav-item">           
          <i class="nav-icon">🏠</i>         
        </router-link>                  
        
        <template v-if="isLoggedIn">           
          <router-link to="/login" class="nav-item">             
            <i class="nav-icon">🔑</i>           
          </router-link>                      
          
          <router-link to="/signup" class="nav-item signup-btn">             
            Join Now          
          </router-link>         
        </template>       
      </div>     
    </nav>      
    
    <main class="main-content">       
      <router-view/>     
    </main>   
  </div> 
</template> 

<script>
export default {
  name: 'App',
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('token')
    }
  }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Quicksand", sans-serif;
}

#app {
  min-height: 100vh;
  background: #111;
  color: #fff;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(17, 17, 17, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  transition: 0.3s ease;
}

.logo-icon {
  font-size: 1.5em;
  filter: drop-shadow(0 0 10px rgba(0, 255, 10, 0.5));
}

.logo-text {
  font-size: 1.3em;
  font-weight: 300;
  color: #fff;
  letter-spacing: 2px;
  text-transform: lowercase;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-item {
  text-decoration: none;
  color: #fff;
  font-size: 1.1em;
  padding: 0.6rem;
  border-radius: 50%;
  transition: 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
}

.nav-item:not(.signup-btn):hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.nav-icon {
  font-style: normal;
  font-size: 1.2em;
}
.nav-logo {
  background: #000
}
.signup-btn {
  background: linear-gradient(45deg, #ff357a, #fff172);
  padding: 0.5rem 1.5rem;
  font-weight: 400;
  border-radius: 40px;
  letter-spacing: 1px;
  font-size: 0.9em;
  text-transform: uppercase;
}

.signup-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 53, 122, 0.3);
}

.main-content {
  padding-top: 5rem;
  min-height: 100vh;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 2rem 2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .navbar {
    padding: 0.8rem 1rem;
  }

  .nav-links {
    gap: 1rem;
  }

  .logo-text {
    font-size: 1.1em;
  }

  .signup-btn {
    padding: 0.4rem 1rem;
    font-size: 0.8em;
  }
}

/* Animation for active route */
.router-link-active:not(.signup-btn) {
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
}
</style>
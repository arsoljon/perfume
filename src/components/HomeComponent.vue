<template>
    <div class="home">
      <div class="input-container">
        <label for="moodInput">Mood</label>
        <input
          type="text"
          id="moodInput"
          v-model="mood"
          placeholder="How are you feeling?"
        />
        <button @click="searchMood">Search</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HomeComponent',
    data() {
      return {
        mood: '',
      };
    },
    methods: {
      searchMood() {
        console.log(`Searching for mood: ${this.mood}`);
      },
    },
  };
  </script>
  
  <style scoped>
  .home {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #f0f2f5;
  }
  
  .input-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 33%;
    padding: 20px;
    background-color: #ffffff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }
  
  label {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
  }
  
  input[type="text"] {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 20px;
    font-size: 1rem;
    text-align: center;
    outline: none;
    transition: border-color 0.3s;
  }
  
  input[type="text"]:focus {
    border-color: #007bff;
  }
  
  button {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
    color: #ffffff;
    background-color: #007bff;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  
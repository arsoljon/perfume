// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeComponent from '../components/HomeComponent.vue';
import AboutComponent from '../components/AboutComponent.vue';
import ContactComponent from '../components/ContactComponent.vue';

const routes = [
  { path: '/', component: HomeComponent, name: 'Home' },
  { path: '/about', component: AboutComponent, name: 'About' },
  { path: '/contact', component: ContactComponent, name: 'Contact' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

<template>
    <!-- Header Section -->
    <header class="header">
      <nav class="navbar">
        <div class="row ms-2">
          <!--Cliente Links-->
          <nuxt-link v-if="authStore.isCliente" class="nav-link col nav-item" :to="`/clientes/${authStore.user.username}`">HomePage</nuxt-link>
          <nuxt-link v-if="authStore.isCliente || authStore.isOperador" class="nav-link col" :to="`/encomendas/${authStore.user.username}`">Encomendas</nuxt-link>
          <!--Fornecedor Links
          <nuxt-link class="nav-link col-sm" to="/fornecedores/_username">Home Page</nuxt-link>-->
          <nuxt-link v-if="authStore.isFornecedor" class="nav-link col" to="/produtos">Produtos</nuxt-link>
          <nuxt-link v-if="authStore.isFornecedor" class="nav-link col" to="/embalagemTransporte">Embalagem Transporte</nuxt-link>
          <!--Operador Links
          <nuxt-link class="nav-link col-sm" to="/operadores/_username">Home Page</nuxt-link>
          <nuxt-link class="nav-link col-sm" to="/auth-test">Minhas Encomendas</nuxt-link>-->
        </div>
        <div class="row me-2">
          <nuxt-link v-if="!authStore.isAuthenticated" class="nav-link col-sm" to="/auth/login">Login</nuxt-link>
          <nuxt-link v-if="authStore.isAuthenticated " class="nav-link col-sm" href="#" @click.prevent="logout">Logout</nuxt-link>
        </div>
      </nav>
    </header>

    <!-- Main Content Slot where page components will be injected -->
    <main class="main-content">
      <slot />
    </main>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/store/auth-store.js';

const router = useRouter();
const authStore = useAuthStore();

function logout() {
  authStore.logout();
  router.push('/');
}
</script>

<style scoped>

.header {
  text-align: center;
  margin: 0;
  background-color: seagreen;
  margin-bottom: 1rem;
}

.navbar {
  display: flex;
  list-style-type: none;
  padding-bottom: 0.5rem;
}

.nav-link {
  padding: 0 1rem;
  text-decoration: none;
  color: white;
  font-weight: bold;
}

.nav-link:hover {
  color: rgba(72, 70, 67, 0.98);
}
.main-content {
  padding: 2rem;
}

</style>

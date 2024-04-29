import { useAuthStore } from "../store/auth-store.js";

export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();
    if (authStore.token == null && to.path != '/auth/login' && to.path != '/' && to.path != '/sensores') {
        return navigateTo('/auth/login')
    }

    if(!authStore.isFornecedor && (to.path == '/embalagemTransporte' || to.path == '/produtos/create'|| to.path == '/produtos')){
        return navigateTo('/')
    }

    if(!authStore.isCliente && (to.path == '/clientes/_username')){
        return navigateTo('/')
    }

    if(authStore.isFornecedor && (to.path == '/encomendas/_username' || to.path == '/encomendas/_id')){
        return navigateTo('/')
    }

    if(authStore.isOperador && (to.path == '/produtos/_id')){
        return navigateTo('/')
    }
})


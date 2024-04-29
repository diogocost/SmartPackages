import {defineStore} from "pinia";
import {computed} from "vue";

export const useAuthStore = defineStore("authStore", () => {
    const token = ref(null);
    const user = ref(null)
    const isFornecedor = computed(() => user.value?.tipo === "Administrador");
    const isOperador = computed(() => user.value?.tipo === "Operador");
    const isCliente = computed(() => user.value?.tipo === "Cliente");
    const isAuthenticated = computed(() => !!token.value);

    const username = computed(() => user.value?.username);



    function logout() {
        localStorage.removeItem('token');
        token.value = null
        user.value = null
    }

    async function fetchWithAuth(url, options = {}) {
        if (token.value) {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${token.value}`
            };
        }
        try {
            return await $fetch(url, options);
        } catch (error) {
            // Tratamento de erros
            throw error;
        }
    }

    return { token, user, logout, isCliente, isFornecedor, isOperador, fetchWithAuth, username , isAuthenticated}
})

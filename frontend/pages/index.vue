<template>
  <div>
    <nav class="navbar navbar-expand-md navbar-dark">
      <h1 class="mx-auto" style="text-align: center">Welcome to SmartPackage </h1>
    </nav>
    <b-container class="mx-auto" style="text-align: center; margin-top: 50px;">
      <h3>To to manage your Packages, please Login.</h3>
    </b-container>
  </div>

</template>
<script>
export default {
  methods: {
    redirectToLogin() {
      this.$router.push("/auth/login");
    }
  }
};
</script>
<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="screen">
    <div class="content">
      <p class="code">404</p>
      <h1 class="title">Page not found</h1>
      <p class="body">This page doesn't exist or may have moved.</p>
      <RouterLink to="/" class="home-link">Go to homepage</RouterLink>
    </div>
  </main>
</template>

<style scoped>
.screen {
  min-height: 100vh;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.code {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-soft);
  margin: 0;
}

.title {
  font-family: var(--font-display, var(--font-body));
  font-size: clamp(40px, 10vw, 72px);
  font-weight: 800;
  line-height: 1;
  margin: 0;
}

.body {
  font-size: 16px;
  color: var(--ink-soft);
  margin: 0;
}

.home-link {
  margin-top: 8px;
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.home-link:hover {
  color: var(--accent);
}

.home-link:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  border-radius: 2px;
}
</style>

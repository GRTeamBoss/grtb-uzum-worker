<template>
  <div class="footer">
    <div class="footer__desktop">
      <div>
        <ul>
          <h3>Pages</h3>
          <li><NuxtLink to="/">Dashboard</NuxtLink></li>
          <li><NuxtLink to="/settings">Settings</NuxtLink></li>
          <li><NuxtLink to="/account">Account</NuxtLink></li>
        </ul>
      </div>
    </div>
    <div class="footer__mobile"></div>
  </div>
</template>

<script setup></script>

<style scoped>
.footer {
  display: block;
  width: 100%;
  height: initial;
  height: auto;

  & .footer__desktop {
    display: grid;
    grid-template-columns: repeat(auto, max-content);
    width: 100%;
    height: auto;
    gap: 0.25rem;
    padding: 0.5rem;

    & h3 {
      line-height: 1.8rem;
      letter-spacing: 2%;
    }

    & > * {
      display: block;
      border-radius: 1rem;
      width: max-content;
      padding: 0.5rem;
      background-color: var(--secondary-500);
    }
  }
}
</style>

<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light"
        style="padding: 0.5rem 1.2rem; border-bottom: 1px solid #ddd;">

    <div class="container">
      <a class="navbar-brand fw-semibold"
        style="font-size: 1.55rem; font-weight: 600;">
        After School Lessons
      </a>

      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li
          v-for="(page, index) in pages"
          :key="index"
          class="nav-item"
        >
          <a
            href="#"
            class="nav-link"
            :class="{ active: activePage === index }"
            @click.prevent="navLinkClick(index)"
            style="font-size: 1.15rem;
            font-weight: 500;"
          >
            {{ page.link.text }}
          </a>
        </li>
      </ul>

      <!-- Cart icon -->
      <button
        class="btn btn-light position-relative d-flex flex-column align-items-center justify-content-center"
        :disabled="cartCount === 0"
        @click="$emit('open-cart')"
        style="width: 80px; height: 80px; border-radius: 9999px; padding: 6px;"
      >
        <!-- Cart Icon -->
        <i class="bi bi-cart2" style="font-size: 2.1rem;"></i>

        <!-- Text under icon -->
        <span style="font-size: 0.95rem; margin-top: 3px;">Cart</span>

        <!-- Red badge with item count -->
        <span
            v-if="cartCount > 0"
            class="badge rounded-pill bg-danger"
            style="position: absolute; top: 2px; right: 4px; font-size: 0.85rem; min-width: 18px;"
        >
            {{ cartCount }}
        </span>
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  props: ['pages', 'activePage', 'navLinkClick', 'cart'],

  computed: {
    cartCount() {
      if (!Array.isArray(this.cart)) return 0;

      // sum all quantities in the cart
      return this.cart.reduce((sum, item) => {
        return sum + (item.quantity || 0);
      }, 0);
    },
  },
};
</script>

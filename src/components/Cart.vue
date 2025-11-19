<template>
  <div class="container mt-4">
    <h2 class="mb-3">Cart</h2>

    <!-- If cart is empty -->
    <p v-if="cart.length === 0" class="text-muted">
      Your cart is empty.
    </p>
    
    <!-- If cart has items -->
    <ul v-else class="list-group">
      <li
        v-for="(item, index) in cart"
        :key="item.lesson._id || index"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <strong>{{ item.lesson.subject }}</strong>
          <div class="small text-muted">{{ item.lesson.location }}</div>
        </div>

        <div class="d-flex align-items-center">
          <button
            class="btn btn-sm btn-outline-secondary"
            @click="$emit('decrease-qty', index)"
          >
            −
          </button>
          <span class="mx-2">{{ item.quantity }}</span>
          <button
            class="btn btn-sm btn-outline-secondary"
            @click="$emit('increase-qty', index)"
          >
            +
          </button>

          <button
            class="btn btn-sm btn-outline-danger ms-2"
            @click="$emit('remove-item', index)"
          >
            Remove
          </button>
        </div>
      </li>

      <!-- Total row -->
      <li class="list-group-item d-flex justify-content-between">
        <strong>Total</strong>
        <span>£{{ totalPrice.toFixed(2) }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Cart',
  props: ['cart'],
  emits: ['remove-item','increase-qty', 'decrease-qty'],

  computed: {
    totalPrice() {
      // add up all prices in the cart
      if (!Array.isArray(this.cart)) return 0;

      return this.cart.reduce((sum, item) => {
        const price = Number(item.lesson.price) || 0;
        const qty   = Number(item.quantity) || 0;
        return sum + price * qty;
      }, 0);
    },
  },
};
</script>

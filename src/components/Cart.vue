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
        :key="index"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <strong>{{ item.subject }}</strong>
          <div class="small text-muted">
            {{ item.location }} 
          </div>
        </div>

        <div class="d-flex align-items-center gap-2">
            <span>£{{ item.price }}</span>
            <button 
                class="btn btn-sm btn-outline-danger"
                @click="$emit('remove-item', index)"
            >
                Remove
            </button>
        </div>
      </li>

      <!-- Total row -->
      <li class="list-group-item d-flex justify-content-between">
        <strong>Total</strong>
        <strong>£{{ cartTotal }}</strong>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Cart',
  props: ['cart'],
  emits: ['remove-item'],

  computed: {
    cartTotal() {
      // add up all prices in the cart
      return this.cart.reduce((sum, item) => sum + item.price, 0);
    },
  },
};
</script>

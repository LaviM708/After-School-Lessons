<template>
  <div class="mt-4">
    <h3 class="mb-3">Checkout</h3>

    <!-- Checkout form -->
    <form @submit.prevent="handleCheckout">
      <!-- Name input -->
      <div class="mb-3">
        <label class="form-label">Full Name</label>
        <input
          v-model="name"
          type="text"
          class="form-control"
          placeholder="Enter your full name"
          required
        />
        <small v-if="name && !isNameValid" class="text-danger">
          Name must contain letters only.
        </small>
      </div>

      <!-- Phone input -->
      <div class="mb-3">
        <label class="form-label">Phone Number</label>
        <input
          v-model="phone"
          type="text"
          class="form-control"
          placeholder="Enter your phone number"
          required
        />
        <small v-if="phone && !isPhoneValid" class="text-danger">
          Phone must contain numbers only.
        </small>
      </div>

      <!-- Checkout button -->
      <button
        type="submit"
        class="btn btn-primary w-100"
        :disabled="!isNameValid || !isPhoneValid || cart.length ===0"
      >
        Checkout
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: "Checkout",
  props: ["cart"],
  emits: ['checkout'],
  data() {
    return {
      name: "",
      phone: "",
    };
  },
  computed: {
    // Check if name contains only letters (A-Z or a-z)
    isNameValid() {
      return /^[A-Za-z\s]+$/.test(this.name);
    },
    // Check if phone contains only numbers (0-9)
    isPhoneValid() {
      return /^[0-9]+$/.test(this.phone);
    },
  },
  methods: {
    handleCheckout() {
        const order = {
            name: this.name,
            phone: this.phone,
            items: this.cart.map(l => ({ lessonId: l._id ?? l.id, spaces: 1 }))
        };

        // 🔔 Tell the parent “checkout done”
        this.$emit('checkout', order);
        
        this.name = '';
        this.phone = '';
    }
  },
};
</script>

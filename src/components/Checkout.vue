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
        :disabled="!isNameValid || !isPhoneValid"
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
      // When button is clicked and both fields valid
      alert(
        `✅ Thank you, ${this.name}! Your order for ${this.cart.length} lesson(s) has been submitted.`
      );

      // Optional: clear form after submission
      this.name = "";
      this.phone = "";
    },
  },
};
</script>

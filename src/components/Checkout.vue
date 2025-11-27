<template>
  <div class="mt-4">
    <h2 class="mb-3">Your Details</h2>

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
    // name contains only letters
    isNameValid() {
      return /^[A-Za-z\s]+$/.test(this.name);
    },
    //phone contains only numbers
    isPhoneValid() {
      return /^[0-9]+$/.test(this.phone);
    },
  },
  methods: {
    async handleCheckout() {
      const backendBaseUrl = "https://backend-afterschoollessons.onrender.com";

        const order = {
            name: this.name,
            phone: this.phone,
            items: this.cart.map(cartItem => ({
                lessonId: cartItem.lesson._id,
                subject: cartItem.lesson.subject,
                location: cartItem.lesson.location,
                price: cartItem.lesson.price,
                spaces: cartItem.quantity,
            })),
        };

        // send order to backend
        const response = await fetch(`${backendBaseUrl}/api/order`, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(order),
        });

        const result = await response.json();

        const orderNumber = result.orderNumber;
        
        for (const item of this.cart) {
          const { lesson, quantity } = item;

          for (let i = 0; i < quantity; i++) {
            await fetch(`${backendBaseUrl}/api/lesson/${lesson._id}/decrease`, {
              method: "PUT",
            });
          }
        }

        // tell app.vue that checkout is done
        this.$emit("checkout", {
          name: this.name,
          phone: this.phone,
          orderNumber: orderNumber,
        });
    }
  },
};
</script>

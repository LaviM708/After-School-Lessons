<template>
  <div>
    <navbar
      :pages="pages"
      :active-page="activePage"
      :nav-link-click="handleNavClick"
      :cart="cart"
      @open-cart="openCartFromIcon" 
    ></navbar>

    <!-- POPUP -->
    <div
      v-if="showAddedModal.visible"
      class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style="background: rgba(0,0,0,0.4); z-index: 1050;"
    >
      <div class="bg-white rounded shadow p-4" style="min-width: 360px; max-width: 480px;">
        <!-- header row -->
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5 class="mb-0">
            <!-- different title depending on how we opened it -->
            <span v-if="showAddedModal.fromCartIcon">Your cart</span>
            <span v-else>Item added to cart</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="closeModal"
          ></button>
        </div>

        <!-- “ x has been added” line only for first subject -->
        <p v-if="!showAddedModal.fromCartIcon && showAddedModal.lessonName">
          <strong>{{ showAddedModal.lessonName }}</strong>
          has been added to your cart.
        </p>

        <!-- CART LIST -->
        <div v-if="cart.length === 0" class="text-muted">
          Your cart is empty.
        </div>
        <ul
          v-else
          class="list-group mb-3"
          style="max-height: 260px; overflow-y: auto;"
        >
          <li
          v-for="(item, index) in cart"
          :key="item.lesson._id || index"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <div class="flex-grow-1 me-3">
            <strong>{{ item.lesson.subject }}</strong>
            <div class="small text-muted">{{ item.lesson.location }}</div>
          </div>

          <!-- quantity + remove controls -->
          <div class="d-flex align-items-center">
            <button
              class="btn btn-sm btn-outline-secondary"
              @click="decreaseQuantity(index)"
            >-</button>
            <span class="mx-2">{{ item.quantity }}</span>
            <button
              class="btn btn-sm btn-outline-secondary"
              @click="increaseQuantity(index)"
            >+</button>
            <button
              class="btn btn-sm btn-outline-danger ms-2"
              @click="removeFromCart(index)"
            >
              Remove
            </button>
          </div>
        </li>

        </ul>

        <!-- BUTTONS -->
        <div class="d-flex justify-content-center gap-2">
          <button
            class="btn btn-outline-secondary"
            @click="continueShoppingFromModal"
          >
            Continue shopping
          </button>

          <button
            class="btn btn-primary"
            :disabled="cart.length === 0"
            @click="goToCheckoutFromModal"
          >
            Go to checkout
          </button>
        </div>
      </div>
    </div>

    <div class="container mt-3">
      <!-- PAGE 0: Lessons -->
      <div v-if="activePage === 0">
        <LessonList
          :page="pages[0]"
          :add-to-cart="addToCart"
        />
      </div>

      <!-- PAGE 1: About  -->
      <div v-else-if="activePage === 1">
        <h1 class="mb-3">{{ pages[1].pageTitle }}</h1>
        <p>{{ pages[1].content }}</p>
      </div>

      <!-- PAGE 2: Checkout -->
      <div v-else-if="activePage === 2">
        <h1 class="mb-3">Checkout</h1>

        <div class="row">
          <div class="col-md-6">
            <!-- Cart List -->
            <Cart
              :cart="cart"
              @remove-item="removeFromCart"
              @increase-qty="increaseQuantity"
              @decrease-qty="decreaseQuantity"
            />
        </div>
        <!-- checkout form -->
          <div class="col-md-6" v-if="showCheckoutForm && cart.length > 0">
            <h2 class="h4 mb-3">Checkout</h2>
            <Checkout
              :cart="cart"
              @checkout="completeCheckout"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import LessonList from './components/LessonList.vue';
import Cart from './components/Cart.vue';
import Checkout from './components/Checkout.vue';

export default {
  components: {
    Navbar,
    LessonList,
    Cart,
    Checkout
  },
  data() {
    return {
      activePage: 0, // 0: Lessons, 1: About, 2: Checkout
      cart: [],
      showCheckoutForm: false,
      showAddedModal: {
        visible: false,
        lessonName: "",
        fromCartIcon: false,   // <— true when opened via cart icon
      },
      pages: [
        {
          link: { text: 'Lessons', url: 'LessonList.vue' },
          pageTitle: 'Lessons List',
          content: 'This is the list of lessons'
        },
        {
          link: { text: 'About', url: 'about.html' },
          pageTitle: 'About',
          content: 'This is the about content'
        }
      ],
    };
  },
  methods: {
    // Navbar link click
    handleNavClick(index) {
      this.activePage = index;
      this.showCheckoutForm = false;
    },

    async addToCart(lesson) {
      // if cart was empty before adding
      const wasEmptyBefore = this.cart.length === 0;

      // if this lesson is already in the cart
      const existing = this.cart.find(
        (item) => item.lesson._id === lesson._id
      );

      // only add if there are spaces left
      if (lesson.spaces > 0) {
        if (existing) {
          existing.quantity += 1;  // increase quantity
        } else {
          this.cart.push({
            lesson,                
            quantity: 1,
          });
        }

        lesson.spaces--;
      }
      
      // only show popup when first item is added
      if (wasEmptyBefore && this.cart.length > 0) {
        // show popup only for the very first item added
        this.showAddedModal.visible = true;
        this.showAddedModal.lessonName = lesson.subject;
        this.showAddedModal.fromCartIcon = false;
      }
    },

    async removeFromCart(index) {
      const item = this.cart[index];
      const lesson = item.lesson;

      // give all quantity back to spaces
      lesson.spaces += item.quantity;

      this.cart.splice(index, 1);

      // if cart becomes empty while on checkout page, send user back to lessons
      if (this.cart.length === 0 && this.activePage === 2) {
        this.activePage = 0;
        this.showCheckoutForm = false;
      }
    },

    increaseQuantity(index) {
      const item = this.cart[index];
      const lesson = item.lesson;

      if (lesson.spaces > 0) {
        item.quantity += 1;
        lesson.spaces--;
      }
    },

    decreaseQuantity(index) {
      const item = this.cart[index];
      const lesson = item.lesson;

      // if more than 1, just decrease quantity
      if (item.quantity > 1) {
        item.quantity -= 1;
        lesson.spaces++;
      } else {
        // if quantity would go to 0, use removeFromCart
        this.removeFromCart(index);
      }
    },

    completeCheckout() {
      alert('Order complete!');
      this.cart = [];
      this.activePage = 0; // go back to lesson list after checkout
      this.showCheckoutForm = false;
    },

    closeModal() {
      this.showAddedModal.visible = false;
    },

    continueShoppingFromModal() {
      this.showAddedModal.visible = false;
      this.activePage = 0;        // back to Lessons
      this.showCheckoutForm = false;
    },

    goToCheckoutFromModal() {
      if (!this.cart.length) return;
        this.showAddedModal.visible = false;
        this.activePage = 2;
        this.showCheckoutForm = true;
    },

    openCartFromIcon() {
      if (!this.cart.length) return;  // nothing to show
      
      this.showAddedModal.visible = true;
      this.showAddedModal.fromCartIcon = true;  // means "cart view", not "just added"
    },
  },
};
</script>

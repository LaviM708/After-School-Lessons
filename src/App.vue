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
            <!-- different title depending on how we open it -->
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

          <!-- quantity and remove controls -->
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
        <div class="mt-3">
          <h1 class="mb-3">{{ pages[1].pageTitle }}</h1>

          <p>
            This website is a small demo for after school lessons.
            It is part of my Full Stack Development coursework.  
            The idea is that parents and students can browse different subjects,
            check how many spaces are left, and book a place online.
          </p>

          <p>
            All the lesson information is loaded from a MongoDB database
            through an Express.js REST API, and the front-end is built with Vue.js
            and Bootstrap.
          </p>

          <h4 class="mt-4">How it works</h4>
          <ul>
            <li>Use the <strong>Lessons</strong> page to see all available subjects.</li>
            <li>Sort by subject, location, price, or spaces, and search as you type.</li>
            <li>Add lessons to your cart – spaces are reduced while they are in the cart.</li>
            <li>Go to <strong>Checkout</strong>, enter your name and phone number, and submit your order.</li>
            <li>Your order is saved in MongoDB with an auto-generated order number.</li>
          </ul>

          <h4 class="mt-4">Technologies used</h4>
          <ul>
            <li>Vue.js for the front-end</li>
            <li>Bootstrap for basic styling and layout</li>
            <li>Node.js and Express.js for the back-end API</li>
            <li>MongoDB for lesson and order data</li>
            <li>Fetch API for all front-end requests</li>
          </ul>

          <p class="mt-4 text-muted">
            This project is for learning purposes only.  
            The lessons, locations and prices are example data, not a real business.
          </p>
        </div>
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

      <!-- PAGE 3: Order complete -->
      <div v-else-if="activePage === 3 && orderSummary" class="mt-4">
        <div class="text-center">
          <h1 class="mb-3">Thank you, {{ orderSummary.name }}!</h1>
          <p class="lead">
            Your order is complete.
          </p>
          <p>
            Your order number is
            <strong>#{{ orderSummary.orderNumber }}</strong>.
          </p>
          <p class="text-muted">
            A confirmation receipt will be sent to your email as well.
          </p>

          <button class="btn btn-primary mt-3" @click="handleNavClick(0)">
            Back to Lessons
          </button>
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
        fromCartIcon: false,   //true when opened via cart icon
      },
      orderSummary: null,
      pages: [
        {
          link: { text: 'Lessons', url: 'LessonList.vue' },
          pageTitle: 'Lessons List'
        },
        {
          link: { text: 'About', url: 'about.html' },
          pageTitle: 'About'
        }
      ],
    };
  },
  methods: {
    handleNavClick(index) {
      this.activePage = index;
      this.showCheckoutForm = false;
    },

    async addToCart(lesson) {
      const wasEmptyBefore = this.cart.length === 0;

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

      if (item.quantity > 1) {
        item.quantity -= 1;
        lesson.spaces++;
      } else {
        this.removeFromCart(index);
      }
    },

    completeCheckout(orderInfo) {
      this.orderSummary = orderInfo; // orderInfo will come from Checkout.vue

      this.cart = [];
      this.showCheckoutForm = false;
      this.activePage = 3; // show Order complete page
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
      if (!this.cart.length) return;

      this.showAddedModal.visible = true;
      this.showAddedModal.fromCartIcon = true;
    },
  },
};
</script>

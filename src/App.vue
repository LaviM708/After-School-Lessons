<template>
  <div>
    <navbar
      :pages="pages"
      :active-page="activePage"
      :nav-link-click="changePage"
      :cart="cart"
      @toggle-checkout="goToCheckout" 
    ></navbar>

    <div class="container mt-3">
      <!-- PAGE 0: Lessons -->
      <div v-if="activePage === 0">
        <LessonList
          :page="pages[0]"
          :add-to-cart="addToCart"
        />
      </div>

      <!-- PAGE 1: About (simple text page for now) -->
      <div v-else-if="activePage === 1">
        <h1 class="mb-3">{{ pages[1].pageTitle }}</h1>
        <p>{{ pages[1].content }}</p>
      </div>

      <!-- PAGE 2: Checkout PAGE -->
      <div v-else-if="activePage === 2">
        <h1 class="mb-3">{{ pages[2].pageTitle }}</h1>

        <div class="row">
          <!-- Cart on the left -->
          <div class="col-md-7">
            <Cart
              :cart="cart"
              @remove-item="removeFromCart"
            />
          </div>

          <!-- Checkout form on the right -->
          <div class="col-md-5">
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
        },
        {
          link: { text: 'Checkout', url: 'Checkout.vue' },
          pageTitle: 'Checkout',
          content: 'This is the Checkout'
        }
      ]
    };
  },
  methods: {
    changePage(index) {
      this.activePage = index;
    },

    async addToCart(lesson) {
      this.cart.push(lesson);

      // update database
      await fetch(`https://backend-afterschoollessons.onrender.com/api/lesson/${lesson._id}/decrease`, {
        method: 'PUT',
      });

      lesson.spaces--;
    },

    goToCheckout() {
      // only go to checkout page if there are items in the cart
      if (this.cart.length > 0) {
        this.activePage = 2;  // show Checkout page
      }
    },

    async removeFromCart(index) {
      const lesson = this.cart[index];

      await fetch(`https://backend-afterschoollessons.onrender.com/api/lesson/${lesson._id}/increase`, {
        method: 'PUT',
      });

      lesson.spaces++;
      this.cart.splice(index, 1);

      // if cart becomes empty while on checkout page, send user back to lessons
      if (this.cart.length === 0 && this.activePage === 2) {
        this.activePage = 0;
      }
    },

    completeCheckout() {
      alert('Order complete!');
      this.cart = [];
      this.activePage = 0; // go back to lesson list after checkout
    },
  },
};
</script>

<template>
  <div>
    <!-- Navbar stays on top -->
    <navbar
      :pages="pages"
      :active-page="activePage"
      :nav-link-click="(index) => activePage = index"
      :cart="cart"
      @toggle-checkout="toggleCheckout" 
    ></navbar>
      
    <div class="container mt-4">
      <div class="row">
        <!-- Lessons always visible -->
        <div :class="showCartPage ? 'col-md-8' : 'col-12'">
          <LessonList
            :page="pages[activePage]"
            :add-to-cart="addToCart"
          />
        </div>
        <!-- Show cart page when showCartPage is true -->
        <div v-if="showCartPage" class="col-md-4">
            <Cart 
              :cart="cart"
              @remove-item="removeFromCart"
            />

            <!-- Checkout Form -->
            <Checkout :cart="cart"
              @checkout="completeCheckout"
            />
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
          activePage: 0, //index 0 which is Lessons List 
          showCartPage: false,
          cart: [], //cart array 
          pages: [
             {
                link: {text: 'Lessons', url: 'LessonList.vue'},
                pageTitle: 'Lessons List',
                content: 'This is the list of lessons'
              },
              {
                link: {text: 'About', url: 'about.html'},
                pageTitle: 'About',
                content: 'This is the about content'
              },
              {
                link: {text: 'Checkout', url: 'Checkout.vue'},
                pageTitle: 'Checkout',
                content: 'This is the Checkout'
              }
          ]
      };
    },
    methods: {
      async addToCart(lesson) {
        this.cart.push(lesson);

        // update dataBase
        await fetch(`https://backend-afterschoollessons.onrender.com/api/lesson/${lesson._id}/decrease`, {
          method: "PUT",
        });

        lesson.spaces--;
      },

      toggleCheckout() {
        this.showCartPage = !this.showCartPage;
      },

      async removeFromCart(index) {
        const lesson = this.cart[index];

        await fetch(`https://backend-afterschoollessons.onrender.com/api/lesson/${lesson._id}/increase`, {
          method: "PUT",
        });

        lesson.spaces++;
        this.cart.splice(index,1);
      },

      completeCheckout() {
        alert("Order complete!");
        this.cart = [];
        this.showCartPage = false;
      },
    },   
};

</script>

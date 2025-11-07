<template>
  <div>
    <!-- Navbar stays on top -->
    <navbar
      :pages="pages"
      :active-page="activePage"
      :nav-link-click="(index) => activePage = index"
      :cart="cart"
    ></navbar>

    <!-- Layout row -->
    <div class="container mt-4">
      <div class="row">
        <!-- 📚 Left side: Lessons -->
        <div class="col-md-8">
          <LessonList
            :page="pages[activePage]"
            :add-to-cart="addToCart"
          />
        </div>

        <!-- 🛒 Right side: Cart -->
        <div class="col-md-4">
          <div class="card shadow-sm">
            <div class="card-body">
              <Cart :cart="cart" />
            </div>
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


export default {
  components: {
    Navbar,
    LessonList,
    Cart
  },
    data() {
      return { //inside is reactive data
          activePage: 0, //index 0 which is Lessons List 
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
      addToCart(lesson) {
        if(lesson.spaces > 0) {
          this.cart.push(lesson);
          lesson.spaces = lesson.spaces - 1;
          console.log(`Added ${lesson.subject}. Spaces left: ${lesson.spaces}`);
        } else {
          alert("Sorry, this lesson is full");
        }
      }
    }    
}

</script>

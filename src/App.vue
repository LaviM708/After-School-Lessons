<template>
  <navbar
        :pages="pages"
        :active-page="activePage"
        :nav-link-click="(index) => activePage = index"
        ></navbar>

    <LessonList 
        :page="pages[activePage]"
        ></LessonList>
</template>

<script>
import Navbar from './components/Navbar.vue';
import LessonList from './components/LessonList.vue';


export default {
  components: {
    Navbar,
    LessonList
  },
    data() {
      return { //inside is reactive data
          activePage: 0, //index 0 which is Lessons List 
          pages: [
             {
                link: {text: 'Lessons', url: 'LessonList.html'},
                pageTitle: 'Lessons List',
                content: 'This is the list of lessons'
              },
              {
                link: {text: 'About', url: 'about.html'},
                pageTitle: 'About',
                content: 'This is the about content'
              },
              {
                link: {text: 'Checkout', url: 'checkout.html'},
                pageTitle: 'Checkout',
                content: 'This is the Checkout'
              }
          ]
      };
    }    
}

</script>

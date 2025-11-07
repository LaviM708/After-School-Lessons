<template>
    <div class="container mt-4">
    <h1 class="mb-4">{{ page.pageTitle }}</h1>


    <!-- Sort Section -->
    <div class="row mb-3">
      <div class="col-md-4">
        <label class="form-label">Sort by</label>
        <select v-model="sortKey" class="form-select">
          <option value="subject">Subject</option>
          <option value="location">Location</option>
          <option value="price">Price</option>
          <option value="spaces">Spaces</option>
        </select>
      </div>

      <div class="col-md-4">
        <label class="form-label">Order</label>
        <select v-model="sortDir" class="form-select">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div class="col" v-for="lesson in sortedLessons" :key="lesson.id">
        <div class="card h-100 shadow-sm">
          <img
            :src="lesson.image"
            class="card-img-top"
            :alt="lesson.subject"
            style="height: 180px; object-fit: cover;"
          />
          <div class="card-body">
            <h5 class="card-title">{{ lesson.subject }}</h5>
            <p class="card-text text-muted mb-2">
              {{ lesson.location }}
            </p>
            <p class="mb-2">
              <strong>£{{ lesson.price }}</strong><br />
              <small>Spaces: {{ lesson.spaces }}</small>
            </p>
            <button 
                class="btn btn-primary w-100"
                @click="addToCart(lesson)"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LessonList',
  props: ['page', 'addToCart'],
  data() {
    return {
        sortKey: 'subject', //default
        sortDir: 'asc',
      lessons: [
        {
          id: 1,
          subject: 'Math',
          location: 'Hendon',
          price: 35,
          spaces: 5,
          image: 'https://picsum.photos/300/200?random=1'
        },
        {
          id: 2,
          subject: 'English',
          location: 'Colindale',
          price: 30,
          spaces: 5,
          image: 'https://picsum.photos/300/200?random=2'
        },
        {
          id: 3,
          subject: 'Science',
          location: 'Brent Cross',
          price: 40,
          spaces: 5,
          image: 'https://picsum.photos/300/200?random=3'
        },
        {
          id: 4,
          subject: 'Additional Maths',
          location: 'Colindale',
          price: 30,
          spaces: 5,
          image: 'https://picsum.photos/300/200?random=4'
        },
        {
          id: 5,
          subject: 'Physics',
          location: 'Colindale',
          price: 30,
          spaces: 5,
          image: 'https://picsum.photos/300/200?random=5'
        },
        {
          id: 6,
          subject: 'Chemistry',
          location: 'Colindale',
          price: 30,
          spaces: 5,
          image: 'https://picsum.photos/300/200?random=6'
        },
        {
          id: 7,
          subject: 'Biology',
          location: 'Colindale',
          price: 30,
          spaces: 5,
          image: 'https://picsum.photos/300/200?random=7'
        },
        {
          id: 8,
          subject: 'Ethics',
          location: 'Colindale',
          price: 30,
          spaces: 5,
          image: 'https://picsum.photos/300/200?random=8'
        },
        {
          id: 9,
          subject: 'Computer Science',
          location: 'Colindale',
          price: 30,
          spaces: 5,
          image: 'https://picsum.photos/300/200?random=9'
        },
        {
          id: 10,
          subject: 'Economics',
          location: 'Colindale',
          price: 30,
          spaces: 5,
          image: 'https://picsum.photos/300/200?random=10'
        }
      ]
    }
  },
  computed: {
    sortedLessons() {
        const key = this.sortKey
        const dir = this.sortDir === 'asc' ? 1 : -1
        return this.lessons.slice().sort((a,b) => {
            const A = a[key]
            const B = b[key]
            if (A < B) return -1 * dir
            if (A > B) return 1 * dir
            return 0
        } )
    }
  }

}
</script>
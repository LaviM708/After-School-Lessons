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
      <div class="col" v-for="lesson in sortedLessons" :key="lesson._id">
        <div class="card h-100 shadow-sm">
          <img
            :src="lesson.image"
            class="card-img-top"
            :alt="lesson.subject"
            style="height: 180px; width: 100%; object-fit: contain; background-color: #f8f9fa;"
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
                :disabled="lesson.spaces === 0"
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
const API_BASE_URL = "https://backend-afterschoollessons.onrender.com";
export default {
  name: 'LessonList',
  props: ['page', 'addToCart'],
  data() {
    return {
        lessons: [],
        sortKey: 'subject', //default
        sortDir: 'asc',
        };
    },

    async mounted() {
        const response = await fetch(`${API_BASE_URL}/api/lessons`);
        const data = await response.json();

        // ✅ make sure it's an array before using map
        if (!Array.isArray(data)) {
          console.error("Expected an array of lessons, got:", data);
          this.lessons = [];
          return;
        }

        //connver backend field to frontend fields
        this.lessons = data.map(item => ({
            _id: item._id,
            subject: item.topic,
            location: item.location,
            price: item.price,
            spaces: item.space,
            // will use local images based on subject name
            image: `${API_BASE_URL}/images/${item.topic.toLowerCase().replace(/\s+/g, '-')}.png`,
        }));
  },
  computed: {
    sortedLessons() {
        const key = this.sortKey;
        const dir = this.sortDir === 'asc' ? 1 : -1;
        return this.lessons.slice().sort((a,b) => {
            const A = a[key];
            const B = b[key];
            if (A < B) return -1 * dir;
            if (A > B) return 1 * dir;
            return 0;
        });
    },
  },
};
</script>
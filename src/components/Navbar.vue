<template>
    <nav 
                    class="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div class="container-fluid">
                        <a class="navbar-brand" href="#">After School Lessons</a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarNav">
                            <ul class="navbar-nav">
                                <li v-for="(page, index) in pages" class="nav-item" :key="index">
                                    <!-- add the CSS class active when this condition is TRUE. It's only true when activePage == index -->
                                    <a 
                                        class="nav-link" 
                                        :class="{active: activePage == index}" 
                                        aria-current="page" 
                                        :href="page.link.url"
                                        :title="`This link goes to the ${page.link.text} page`"
                                        @click.prevent="navLinkClick(index)" 
                                        > {{page.link.text}} </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    </nav>
</template>

<script>
export default {
    props:['pages', 'activePage', 'navLinkClick'],
}
</script>
<template>
  <div id="app">
    <HeaderContainer :cartItems="cartItems" />
    <div class="custom-container">
      <router-view @add-to-cart="handleAddToCart" />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import HeaderContainer from './components/HeaderContainer.vue';

export default {
  components: {
    HeaderContainer,
  },
  computed: {
    ...mapState(['cart']),
    cartItems() {
      return this.cart;
    }
  },
  methods: {
    ...mapMutations(['addToCart']),
    handleAddToCart({ product, quantity, variant, currentImage }) {
        this.addToCart({ product, quantity, variant, currentImage });
    }
  }
};
</script>
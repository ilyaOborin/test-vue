<template>
    <h1 class="title"> Корзина </h1>
    <product-cart
        :cart-items="cartItems"
        @remove-from-cart="handleRemoveFromCart"
    />
</template>

<script>
import {mapMutations, mapState} from 'vuex';
import ProductCart from "@/components/ProductCart.vue";

export default {
  components: {
    ProductCart,
  },
  computed: {
    ...mapState(['cart']),
    cartItems() {
      return this.cart;
    }
  },
  methods: {
    ...mapMutations(['removeFromCart']),
    handleRemoveFromCart(index) {
      this.removeFromCart(index);
    },
  },
};
</script>
<template>
  <div class="cart-page">
    <ul class="cart-page__list" v-if="cartItems.length > 0">
      <li v-for="(product) in cartItems" :key="product.id" class="product">
        <div class="product__left">
          <div class="product__image">
            <img :src="product.currentImage" :alt="product.title"/>
          </div>
          <div class="product__middle">
            <div class="product__info">
              <div class="product__variant" v-if="product.variant">
                <span class="product__variant-item">Размер: {{ product.variant.size }}</span>
                <span class="product__variant-item">Цвет: {{ product.variant.color }}</span>
              </div>
              <h2 class="product__title">{{ product.title }}</h2>
            </div>
            <button class="product__button" @click="removeFromCart(`${product.id}-${product.variant?.product.sku}`)">
              <img src="/images/delete.png" alt="Удалить"/>
              Удалить
            </button>
          </div>
        </div>
        <div class="product__right">
          <p class="product__price">{{ product.regular_price.value }} ₽</p>
          <div class="quantity-control">
            <button @click="decrementQuantity(`${product.id}-${product.variant?.product.sku}`)" class="quantity-control__btn">-</button>
            <input
                type="number"
                v-model.number="product.quantity"
                min="1"
                placeholder="1"
                class="quantity-control__input"
            />
            <button @click="incrementQuantity(`${product.id}-${product.variant?.product.sku}`)" class="quantity-control__btn">+</button>
          </div>
        </div>
      </li>
    </ul>
    <p v-else>Ваша корзина пуста</p>
    <div class="cart-page__total" v-if="cartItems.length > 0">
      <h3>Итого: {{ totalPrice }} ₽</h3>
    </div>
    <button class="cart-page__button" v-if="cartItems.length > 0">
      Перейти к оформлению
    </button>
  </div>
</template>

<script>
export default {
  props: {
    cartItems: {
      type: Array,
      required: true,
    },
  },
  computed: {
    totalPrice() {
      return this.cartItems.reduce((total, item) => total + (item.regular_price.value * item.quantity), 0).toFixed(2);
    }
  },
  methods: {
    removeFromCart(productId) {
      this.$emit('remove-from-cart', productId);
    },
    incrementQuantity(productId) {
      const product = this.cartItems.find(item => item.uniqueId === productId);
      if (product) {
        product.quantity++;
      }
    },
    decrementQuantity(productId) {
      const product = this.cartItems.find(item => item.uniqueId === productId);
      if (product && product.quantity > 1) {
        product.quantity--;
      }
    },
  },
};
</script>

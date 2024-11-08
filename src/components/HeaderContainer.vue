<template>
  <header>
    <div class="custom-container">
      <nav>
        <ul class="d-flex justify-content-between">
          <li>
            <router-link to="/">
              <img src="/images/logo.png" alt="Логотип">
            </router-link>
          </li>
          <li>
            <router-link to="/cart" class="cart">
              <div class="cart__button">
                <span class="cart__button-image">
                  <img src="/images/cart.png" alt="Корзина">
                </span>
                <span class="cart__button-counter">
                  {{ itemCount }}
                </span>
              </div>
              <div class="cart__info">
                <span class="cart__info-title">
                  Корзина
                </span>
                <span class="cart__info-price">
                  {{ totalPrice }} ₽
                </span>
              </div>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  props: {
    cartItems: {
      type: Array,
      required: true
    }
  },
  computed: {
    itemCount() {
      return this.cartItems.reduce((total, item) => total + item.quantity, 0);
    },
    totalPrice() {
      return this.cartItems.reduce((total, item) => total + (item.regular_price.value * item.quantity), 0).toFixed(2);
    }
  }
};
</script>
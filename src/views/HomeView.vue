<template>
    <h1 className="title"> Заголовок </h1>
    <div className="grid">
      <brand-filter :brands="brands" @filter="filterProducts"/>
      <product-list v-if="filteredProducts.length" :products="filteredProducts" @add-to-cart="addToCart"/>
    </div>
</template>

<script>
import axios from 'axios';
import BrandFilter from '../components/BrandFilter.vue';
import ProductList from '../components/ProductList.vue';

export default {
  components: {
    BrandFilter,
    ProductList,
  },
  data() {
    return {
      brands: [],
      allProducts: [],
      filteredProducts: [],
    };
  },
  methods: {
    filterProducts(selectedBrands) {
      if (selectedBrands.length === 0) {
        this.filteredProducts = this.allProducts;
      } else {
        this.filteredProducts = this.allProducts.filter(product =>
            selectedBrands.includes(product.brand)
        );
      }
    },
    async fetchProducts() {
      try {
        const response = await axios.get('/data/products.json');
        this.allProducts = response.data;
        this.filteredProducts = this.allProducts;
      } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
      }
    },
    async fetchBrands() {
      try {
        const response = await axios.get('/data/brands.json');
        this.brands = response.data;
      } catch (error) {
        console.error('Ошибка при загрузке брендов:', error);
      }
    },
    addToCart({product, quantity, variant = null, currentImage = null}) {
      this.$emit('add-to-cart', {product, quantity, variant, currentImage});
    }
  },
  created() {
    this.fetchProducts();
    this.fetchBrands();
  }
};
</script>
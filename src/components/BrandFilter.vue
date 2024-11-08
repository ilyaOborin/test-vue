<template>
  <div class="filter">
    <h3 class="filter__title">Фильтры</h3>
    <div class="filter__content">
      <div class="filter__button" @click="toggleFilter">
        <span class="filter__button-title">Производитель</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 10L8 6L12 10" stroke="#5E5E5E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      
      <ul class="filter__list" v-if="isFilterVisible">
        <li class="filter__item" v-for="brand in brands" :key="brand.id">
          <input type="checkbox" 
            class="filter__item-checkbox" 
            :id="'brand-' + brand.id" 
            :value="brand.id" 
            v-model="selectedBrands" 
            @change="updateFilter"/>
          <label class="filter__item-custom-checkbox" 
            :for="'brand-' + brand.id">
            <span class="filter__item-checkmark"></span>
            <span class="filter__item-name">
              {{ brand.title }}
            </span>
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    brands: Array
  },
  data() {
    return {
      selectedBrands: [],
      isFilterVisible: true
    };
  },
  methods: {
    toggleFilter() {
      this.isFilterVisible = !this.isFilterVisible;
    },
    updateFilter() {
      this.$emit('filter', this.selectedBrands);

      if (this.selectedBrands.length === 0) {
        this.$emit('filter', []);
      }
    }
  }
};
</script>
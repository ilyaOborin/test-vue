  <template>
    <div class="list-card">
      <div class="card" v-for="product in products" :key="product.id">
        <div class="card__image">
          <img :src="currentImage[product.id] || product.image" :alt="product.title" />
        </div>
        <div class="card__info">
          <h4 class="card__title">{{ product.title }}</h4>
          <div class="card__options" v-if="product.type === 'configurable'">
            <div class="card__options-list">
              <button
                  v-for="color in product.configurable_options.find(option => option.attribute_code === 'color').values"
                  :key="color.value_index"
                  :style="{ backgroundColor: color.value }"
                  @click="selectOption(product.id, 'color', color.value_index)"
                  :class="{'active': isSelected(product.id, 'color', color.value_index)}"
                  class="card__option"
              >
              </button>
            </div>
            <div class="card__options-list">
              <button
                  v-for="size in product.configurable_options.find(option => option.attribute_code === 'size').values"
                  :key="size.value_index"
                  @click="selectOption(product.id, 'size', size.value_index)"
                  :class="{'active': isSelected(product.id, 'size', size.value_index)}"
                  class="card__option"
                  :disabled="!isSizeAvailable(product.id, size.value_index)"
              >
                {{ size.label }}
              </button>
            </div>
          </div>
        </div>
        <div class="card__action">
          <p class="card__price">{{ product.regular_price.value }} ₽</p>
          <div class="quantity-control">
            <button @click="decrementQuantity(product.id)" class="quantity-control__btn">-</button>
            <input
                type="number"
                v-model.number="quantity[product.id]"
                min="1"
                placeholder="1"
                class="quantity-control__input"
            />
            <button @click="incrementQuantity(product.id)" class="quantity-control__btn">+</button>
          </div>
          <button class="card__button" @click="addToCart(product, quantity[product.id] || 1)">
            <img src="/images/cart.png" alt="Корзина" />
          </button>
        </div>
      </div>
    </div>
  </template>

  <script>
  export default {
    props: {
      products: Array,
    },
    data() {
      return {
        selectedVariant: {},
        quantity: {},
        currentImage: {},
      };
    },
    methods: {
      setInitialColor(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product && product.configurable_options) {
          const colorOption = product.configurable_options.find(option => option.attribute_code === 'color');
          if (colorOption && colorOption.values.length > 0) {
            const firstColor = colorOption.values[0].value_index;
            this.selectedVariant[productId] = { color: firstColor };
            this.setFirstAvailableSize(productId);
          }
        }
      },
      selectOption(productId, optionType, valueIndex) {
        this.selectedVariant[productId] = {
          ...this.selectedVariant[productId],
          [optionType]: valueIndex,
        };

        if (optionType === 'color') {
          this.setFirstAvailableSize(productId);
        }

        this.updateCurrentImage(productId);
      },
      setFirstAvailableSize(productId) {
        const product = this.products.find((p) => p.id === productId);
        if (!product) return false;

        const availableSize = product.variants
            .filter(variant => variant.attributes.some(attr => attr.code === 'color' && attr.value_index === this.selectedVariant[productId]?.color))
            .map(variant => variant.attributes.find(attr => attr.code === 'size').value_index)[0];

        if (availableSize) {
          this.selectedVariant[productId].size = availableSize;
          this.updateCurrentImage(productId);
        }
      },
      isSelected(productId, optionType, valueIndex) {
        return this.selectedVariant[productId]?.[optionType] === valueIndex;
      },
      updateCurrentImage(productId) {
        const product = this.products.find((p) => p.id === productId);
        if (!product) return false;

        const variant = product.variants?.find((variant) =>
            variant.attributes.every(attr => {
              const selected = this.selectedVariant[productId];
              return (attr.code === 'color' && attr.value_index === selected?.color) ||
                  (attr.code === 'size' && attr.value_index === selected?.size);
            })
        );

        this.currentImage[productId] = variant ? variant.product.image : product.image;
      },
      isSizeAvailable(productId, sizeValueIndex) {
        const product = this.products.find((p) => p.id === productId);
        if (!product) return false;

        if(this.selectedVariant[productId]?.color) {
          const availableSizes = product.variants
              .filter(variant => variant.attributes.some(attr => attr.code === 'color' && attr.value_index === this.selectedVariant[productId]?.color))
              .map(variant => variant.attributes.find(attr => attr.code === 'size').value_index);

          return availableSizes.some(size => size === sizeValueIndex);
        } else {
          return true;
        }
      },
      getLabelByValueIndex(product, attributeCode, valueIndex) {
        const attribute = product.configurable_options.find(option => option.attribute_code === attributeCode);
        if (attribute) {
          const value = attribute.values.find(val => val.value_index === valueIndex);
          return value ? value.label : null;
        }
        return null;
      },
      addToCart(product, quantity) {
        const selectedVariant = this.selectedVariant[product.id];
        let variant = product.variants?.find((variant) =>
            variant.attributes.every(attr => {
              const selected = this.selectedVariant[product.id];
              return (attr.code === 'color' && attr.value_index === selected?.color) ||
                  (attr.code === 'size' && attr.value_index === selected?.size);
            })
        );

        const currentImage = this.currentImage[product.id] || product.image;

        if(variant) {
          variant.color = this.getLabelByValueIndex(product,'color', selectedVariant?.color);
          variant.size = this.getLabelByValueIndex(product,'size', selectedVariant?.size);
        }

        if (variant || product.type !== 'configurable') {
          this.$emit('add-to-cart', { product, variant, quantity, currentImage});
        } else {
          alert('Товара с такими вариантами характеристик нет.');
        }
      },
      incrementQuantity(productId) {
        this.quantity[productId] = (this.quantity[productId] || 0) + 1;
      },
      decrementQuantity(productId) {
        if (this.quantity[productId] > 1) {
          this.quantity[productId] -= 1;
        }
      },
    },
    created() {
      this.products.forEach(product => {
        if (product.type === 'configurable') {
          this.setInitialColor(product.id);
        }
      });
    }
  };
  </script>
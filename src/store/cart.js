import { createStore } from 'vuex';

export default createStore({
    state: {
        cart: []
    },
    mutations: {
        addToCart(state, { product, quantity, variant, currentImage }) {
            const uniqueId = `${product.id}-${variant?.product.sku}`;
            const existingItem = state.cart.find(item => item.uniqueId === uniqueId);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.cart.push({ ...product, quantity, variant, currentImage, uniqueId });
            }
        },
        removeFromCart(state, uniqueId) {
            const index = state.cart.findIndex(item => item.uniqueId === uniqueId);
            if (index !== -1) {
                state.cart.splice(index, 1);
            }
        },
    }
});
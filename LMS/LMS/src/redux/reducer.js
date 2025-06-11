import * as actions from "./actionTypes";//{ ADD_TO_CART,REMOVE_FROM_CART }
// []
export const initialState = {
    productsCart: [],
    productsNums: 0
};
const reducer = (state = initialState, action) => {

    switch (action.type) {
        case actions.ADD_TO_CART:
            {
                const productWithQty = {
                    ...action.payload,
                    quantity: 1,
                }
                //find filter

                return {
                    ...state,
                    productsCart: [...state.productsCart, productWithQty],
                    productsNums: ++state.productsNums
                }
            }
        case actions.REMOVE_FROM_CART:
            {// productsNums++;
                return state.products.filter(product => product.id !== action.payload.id);
            }
        case actions.ADD_TO_QNT:
            {// productsNums++;
                 const prod=state.productsCart.find(product => product.id === action.payload.id);
                 const prodIndex=state.productsCart.findIndex(product => product.id === action.payload.id);
                 const x = [...state.productsCart];

                 x[prodIndex]= {
                    ...prod,
                    quantity: ++prod.quantity
                }

                return {
                    ...state,
                    productsCart: x,
                    productsNums: ++state.productsNums
                }
            }
            case actions.SUBTRACTION_FROM_QNT:
            {// productsNums++;
                 const prod=state.productsCart.find(product => product.id === action.payload.id);
                 const prodIndex=state.productsCart.findIndex(product => product.id === action.payload.id);
                 const x = [...state.productsCart];

                 x[prodIndex]= {
                    ...prod,
                    quantity: --prod.quantity
                }

                return {
                    ...state,
                    productsCart: x,
                    productsNums: --state.productsNums
                }
            }
        default: {
            console.log('reducer', state);
            console.log('action.type', action.type);
            return state;
        }
    }
}
export default reducer;
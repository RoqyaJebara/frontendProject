import * as actions from './actionTypes';

export const productAdded = (product) => {
    console.log('ok');
    return{
        type: actions.ADD_TO_CART,
        payload: product
    };
   
};
export const incrementQnt = (product) => {
    console.log('incrementQntOk');
    return{
        type: actions.ADD_TO_QNT,
        payload: product
    };
   
};
export const decrementQnt = (product) => {
    console.log('decrementQntOk');
    return{
        type: actions.SUBTRACTION_FROM_QNT,
        payload: product
    };   
};
// const productRemoved = (id) => {
//     return {
//         type: actions.REMOVE_FROM_CART,
//         payload: {
//             id
//         }
//     };   
// };
// export default{ productAdded, productRemoved};


// block of code  // opject

// export function productAdded(description) {
//     return {
//         type: actions.ADD_TO_CART,
//         payload: {
//             description: "product1"
//         }
//     };
// }

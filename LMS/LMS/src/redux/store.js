import {createStore} from "redux";
import reducer from "./reducer";//{default export}

export const store = createStore(reducer);

// export default store;
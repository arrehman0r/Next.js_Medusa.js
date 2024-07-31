import { persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';

export const actionTypes = {
    SHIPPING_METHOD: "SHIPPING_METHOD",
    SET_LOADING : 'SET_LOADING'
};

const initialState = {
    shippingMethod: null,
    loading: false
};

const utilsReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SHIPPING_METHOD:
            return {
                ...state,
                shippingMethod: action.payload.shippingMethod
            };
            case actionTypes.SET_LOADING:
                return {
                    ...state,
                    loading: action.payload.loading
                };
    
        default:
            return state;
    }
};

export const utilsActions = {
    setShippingMethod: (shippingMethod) => ({
        type: actionTypes.SHIPPING_METHOD,
        payload: { shippingMethod }
    }),
    setLoading: (loading) => ({
        type: actionTypes.SET_LOADING,
        payload: { loading }
    })
};

const persistConfig = {
    keyPrefix: "party-",
    key: "utils",
    storage
};

export default persistReducer(persistConfig, utilsReducer);

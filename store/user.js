import { persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';

export const actionTypes = {
    USER: "USER",
   
};

const initialState = {
   user: null
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.USER:
            return {
                ...state,
                user: action.payload.user
            };
            
    
        default:
            return state;
    }
};

export const userActions = {
    setUser: (user) => ({
        type: actionTypes.USER,
        payload: { user }
    }),
  
};

const persistConfig = {
    keyPrefix: "party-",
    key: "user",
    storage
};

export default persistReducer(persistConfig, userReducer);

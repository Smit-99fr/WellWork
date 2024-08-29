// import { createStore, applyMiddleware } from 'redux'
// import { composeWithDevTools } from 'redux-devtools-extension'
// import { thunk } from 'redux-thunk'
// import rootReducer from './reducers'

// const initialState = {};

// const middleware = [thunk]

// const store = createStore(
//     rootReducer,
//     initialState,
//     composeWithDevTools(applyMiddleware(...middleware))
// )

// export default store;

import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { thunk as thunkMiddleware } from 'redux-thunk'; // Correct import for thunk
import rootReducer from './reducers'; // Import your root reducer
import { composeWithDevTools } from 'redux-devtools-extension';

// Configure persist
const persistConfig = {
    key: 'root',
    storage, // Use localStorage
    whitelist: ['auth'], // List of reducers to persist, like 'auth'
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store with persisted reducer
const store = createStore(
    persistedReducer,
    composeWithDevTools(applyMiddleware(thunkMiddleware))// Applying middleware like redux-thunk
);

// Create a persistor
const persistor = persistStore(store);

export { store, persistor };



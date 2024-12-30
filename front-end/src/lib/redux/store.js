import { configureStore, createReducer } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    slice: createReducer({}, (builder) => {
      builder.addCase("action", (state, action) => {
        state.value = action.payload;
      });
    }),
  },
});

export default store;

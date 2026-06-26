import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,

  theme: "light",
};

const uiSlice = createSlice({
  name: "ui",

  initialState,

  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
});

export const { setLoading, toggleTheme } = uiSlice.actions;

export default uiSlice.reducer;

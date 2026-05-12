import { createReducer } from "@reduxjs/toolkit";
import { setTheme, toggleTheme } from "../actions/ui.actions";
import { getInitialUiState } from "../persistence";

const uiReducer = createReducer(getInitialUiState(), (builder) => {
  builder
    .addCase(setTheme, (state, action) => {
      state.theme = action.payload;
    })
    .addCase(toggleTheme, (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
    });
});

export default uiReducer;

import { createReducer } from "@reduxjs/toolkit";
import { hydrateDemo, recordScan } from "../actions/demo.actions";
import { getInitialDemoState } from "../persistence";

const demoReducer = createReducer(getInitialDemoState(), (builder) => {
  builder
    .addCase(recordScan, (state, action) => {
      state.scanCount += 1;
      state.scanLog = [action.payload, ...state.scanLog].slice(0, 5);
    })
    .addCase(hydrateDemo, (state, action) => {
      state.scanCount = action.payload.scanCount;
      state.scanLog = action.payload.scanLog;
    });
});

export default demoReducer;

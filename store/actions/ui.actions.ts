import { createAction } from "@reduxjs/toolkit";
import type { Theme } from "../types";

export const setTheme = createAction<Theme>("ui/setTheme");
export const toggleTheme = createAction("ui/toggleTheme");

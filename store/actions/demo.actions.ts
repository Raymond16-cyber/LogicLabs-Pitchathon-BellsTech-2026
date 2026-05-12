import { createAction } from "@reduxjs/toolkit";
import type { ScanRecord } from "../types";

export const recordScan = createAction<ScanRecord>("demo/recordScan");
export const hydrateDemo = createAction<{
  scanCount: number;
  scanLog: ScanRecord[];
}>("demo/hydrateDemo");

// import { defineConfig } from "vitest/config";
// import react from "@vitejs/plugin-react";

// // https://vite.dev/config/
// // export default defineConfig({
// //   plugins: [react()],
// // })
// export default defineConfig({
//   plugins: [react()],
//   test: {
//     globals: true,
//     environment: "jsdom", // Use jsdom for DOM-related tests
//     setupFiles: "./setupTests.ts",
//   },
// });

/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Enable global test utilities like describe and it
    environment: "jsdom", // Simulate a browser environment for DOM testing
    setupFiles: "./setupTests.ts", // Load setup file
  },
});

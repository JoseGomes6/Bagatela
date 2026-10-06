// Só para `npm run dev` (servidor local com recarregamento). O build de produção está em scripts/build.ts.
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  root: __dirname,
  publicDir: path.resolve(__dirname, "public"),
  plugins: [react()],
  server: { fs: { allow: [path.resolve(__dirname)] } },
});

import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.bookread.app",
  appName: "Book Read",
  webDir: "www",
  bundledWebRuntime: false,
  android: {
    backgroundColor: "#10131c"
  }
};

export default config;

const config = {
  isDev: process.env.NODE_ENV === "development",
  wsUrl: "",
  appName: "Top notch city",
  origin: process.env.NEXT_PUBLIC_API_URL as string,
  websiteUrl: process.env.NEXT_PUBLIC_WEB_URL as string,
};

if (config.origin === undefined) {
  throw new Error("Missing NEXT_PUBLIC_API_URL environment variable");
}

export default config;

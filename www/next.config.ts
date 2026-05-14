import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // redirects: async () => {
  //   if (process.env.VERCEL) {
  //     return [
  //       {
  //         source: "/:path*",
  //         destination: "https://bevelui.vercel.app/:path*",
  //         permanent: false,
  //       },
  //     ];
  //   }
  //   return [];
  // },
};

export default nextConfig;

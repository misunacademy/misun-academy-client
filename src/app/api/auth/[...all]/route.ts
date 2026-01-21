// import { auth } from "@/lib/auth";
// import { toNextJsHandler } from "better-auth/next-js";

// let authHandler: ReturnType<typeof toNextJsHandler> | null = null;

// async function getAuthHandler() {
//   if (!authHandler) {
//     // const auth = await auth();
//     authHandler = toNextJsHandler(auth);
//   }
//   return authHandler;
// }

// export async function GET(request: Request) {
//   const { GET } = await getAuthHandler();
//   return GET(request);
// }

// export async function POST(request: Request) {
//   const { POST } = await getAuthHandler();
//   return POST(request);
// }

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
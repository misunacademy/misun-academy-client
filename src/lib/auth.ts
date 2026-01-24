
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import clientPromise from "./db";

export const auth = betterAuth({
  database: mongodbAdapter(await clientPromise.then((client) => client.db(process.env.DB_NAME!)), {
    usePlural: true, 
  }),
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
   
  },
  emailAndPassword: {
    enabled: false, 
  },
  AUTH_SECRET: process.env.AUTH_SECRET as string,
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "learner",
        input: false,
      },
      isActive: {
        type: "boolean",
        required: false,
        defaultValue: true,
        input: false,
      },
      passwordChangedAt: {
        type: "date",
        required: false,
        input: false,
      },
      password: {
        type: "string",
        required: true,
        input: true, 
      },
    },
  },

  session: { modelName: "sessions" },
  account: { modelName: "accounts" },
});

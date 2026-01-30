
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import clientPromise from "./db";
import { hash } from "bcrypt";

export const auth = betterAuth({
  database: mongodbAdapter(await clientPromise.then((client) => client.db(process.env.DB_NAME!)), {
    usePlural: true, // Auto-renames 'user' -> 'users'
  }),
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },

  },
  emailAndPassword: {
    enabled: false, // why built-in auth disabled?
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
        input: true, // Must be true so you can pass it during sign-up
      },
    },
  },

  // 3. Hooks for Hashing (Fixed Syntax)
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // If password exists, hash it. If not (social login), generate random one.
          const plainPassword = user.password as string | undefined;

          // if (!plainPassword) {
          //   // ... insert your random password logic here if needed ...
          //   plainPassword = "ComplexDefaultPassword123!"; // why use default password?
          // }

          // // Hash the password before it touches the DB
          // const hashedPassword = await hash(plainPassword, 10);

          return {
            data: {
              ...user,
              password: plainPassword ? await hash(plainPassword, 10) : null,
            },
          };
        },
      },
    },
  },

  session: { modelName: "sessions" },
  account: { modelName: "accounts" },
});


import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import clientPromise from "./db";
import { hash } from "bcrypt"; // Make sure to install bcrypt: npm install bcrypt @types/bcrypt

export const auth = betterAuth({
  database: mongodbAdapter(await clientPromise.then((client) => client.db("misun-academy")), {
    usePlural: true, // Auto-renames 'user' -> 'users'
  }),
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    // Add github: { ... } here if you need it later
  },
  // 1. Disable built-in auth (we will handle it manually)
  emailAndPassword: {
    enabled: false,
  },
  AUTH_SECRET: process.env.AUTH_SECRET as string,
  // 2. Define your schema manually
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "student",
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
      // Manually define password since plugin is disabled
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
          let plainPassword = user.password as string | undefined;

          if (!plainPassword) {
            // ... insert your random password logic here if needed ...
            plainPassword = "ComplexDefaultPassword123!";
          }

          // Hash the password before it touches the DB
          const hashedPassword = await hash(plainPassword, 10);

          return {
            data: {
              ...user,
              password: hashedPassword,
            },
          };
        },
      },
    },
  },

  session: { modelName: "sessions" },
  account: { modelName: "accounts" },
});

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { betterAuth } from "better-auth";
// import { mongodbAdapter } from "better-auth/adapters/mongodb";
// import { getDb } from "./db";
// let authInstance: ReturnType<typeof betterAuth> | null = null;
// export const auth = new Proxy({} as ReturnType<typeof betterAuth>, {
//   get(target, prop) {
//     if (!authInstance) {
//       throw new Error("Auth instance not initialized. Make sure to call getAuth() first.");
//     }
//     return authInstance[prop as keyof typeof authInstance];
//   }
// });
// export async function getAuth() {
//   if (!authInstance) {
//     const db = await getDb();
//     authInstance = betterAuth({
//       database: mongodbAdapter(db,
//         // {
//         // Optional: if you want custom id generation (default is uuid v4)
//         // generateId: () => crypto.randomUUID(),
//         // Optional: change collection names if needed (default shown below)
//         // collections: {
//         //   user: "users",
//         //   session: "sessions",
//         //   account: "accounts",
//         //   ...
//         // }
//         //},
//       ),
//       // Very important for production!
//       secret: process.env.AUTH_SECRET!,
//       // Recommended for Next.js
//       baseURL: process.env.AUTH_URL || "http://localhost:3000",
//       // Disable email and password - will be handled by server
//       emailAndPassword: {
//         enabled: false,
//       },
//       email: {
//         smtp: {
//           host: process.env.SMTP_HOST || "smtp.gmail.com",
//           port: parseInt(process.env.SMTP_PORT || "587"),
//           user: process.env.SMTP_USER!,
//           pass: process.env.SMTP_PASS!,
//         },
//         from: process.env.EMAIL_FROM || "Misun Academy <noreply@misun-academy.com>",
//       },
//       socialProviders: {
//         google: {
//           enabled: true,
//           clientId: process.env.GOOGLE_CLIENT_ID!,
//           clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//         },
//         // github: { ... }
//       },
//       // Add database hooks to set role for social login users
//       //  databaseHooks: {
//       //    user: {
//       //      create: {
//       //        before: async (user) => {
//       //          // Set default role to STUDENT for social login users
//       //          return {
//       //            data: {
//       //              ...user,
//       //              role: "STUDENT",
//       //            },
//       //          };
//       //        },
//       //        after: async (created) => {
//       //          try {
//       //            // Ensure we create a corresponding user document in our users collection
//       //            const db = await getDb();
//       //            const usersCol = db.collection('users');
//       //            const email = (created as any)?.email || (created as any)?.user?.email;
//       //            if (!email) return { data: created };
//       //            const name = (created as any)?.name || (created as any)?.user?.name || email.split('@')[0];
//       //            const image = (created as any)?.image || (created as any)?.user?.image || null;
//       //            const emailVerified = !!((created as any)?.emailVerified || (created as any)?.user?.emailVerified || false);
//       //            // Default password (hashed) — do not store plain text. Use bcrypt to hash.
//       //            const bcrypt = await import('bcrypt');
//       //            const defaultPassword = process.env.DEFAULT_SOCIAL_PASSWORD || 'ChangeMe123!';
//       //            const hashed = await bcrypt.hash(defaultPassword, 10);
//       //            const now = new Date();
//       //            const doc = {
//       //              name,
//       //              email,
//       //              password: hashed,
//       //              role: 'STUDENT',
//       //              isActive: true,
//       //              image,
//       //              emailVerified,
//       //              createdAt: now,
//       //              updatedAt: now,
//       //              __v: 0,
//       //            };
//       //            // Insert only if not exists
//       //            await usersCol.updateOne({ email }, { $setOnInsert: doc }, { upsert: true });
//       //            return { data: created };
//       //          } catch (err) {
//       //            // Log and continue — do not block auth flow
//       //            // eslint-disable-next-line no-console
//       //            console.error('[BetterAuth hook] Failed creating app user:', err);
//       //            return { data: created };
//       //          }
//       //        }
//       //      },
//       //    },
//       //  },
//       // plugins: [
//       //   passkey(), twoFactor(), organization(), ...
//       // ],
//     });
//   }
//   return authInstance;
// }
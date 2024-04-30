import { PrismaAdapter } from "@auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import DiscordProvider from "next-auth/providers/discord";

import { env } from "@/env";
import { db } from "@/server/db";
import LineProvider from "next-auth/providers/line";
import type { Account, Role, User } from "@prisma/client";
import { DefaultJWT } from "next-auth/jwt";
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      role: Role;
      providerAccountId: string;
      // ...other properties
      // role: UserRole;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string | undefined | null;
    image: string | undefined | null;
    role: Role;
    providerAccountId: string;

    // ...other properties
    // role: UserRole;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    id: string;
    role: Role;
    name: string;
    email: string | undefined | null;
    image: string | undefined | null;
    providerAccountId: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 90 * 24 * 60 * 60, // 90 days
  },
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider === "line") {
        try {
          if (profile) {
            console.log("profile", profile);
            console.log("account", account);
            console.log("user", user);
            const userAccount = await db.account.findUnique({
              where: {
                providerAccountId: user.id,
              },
            });

            if (!userAccount) {
              await db.account.create({
                data: {
                  provider: account.provider,
                  type: account.type,
                  providerAccountId: user.id,
                  refresh_token: account.refresh_token,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  user: {
                    create: {
                      email: user.email,
                      name: user.name,
                      image: user.image,
                    },
                  },
                },
              });
            } else {
              await db.account.update({
                where: {
                  providerAccountId: user.id,
                },
                data: {
                  refresh_token: account.refresh_token,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  user: {
                    update: {
                      email: user.email,
                      name: user.name,
                      image: user.image,
                    },
                  },
                },
              });
            }
            return true;
          }
        } catch (error) {
          throw new Error("something-went-wrong");
        }
      }
      return false;
    },
    async jwt({ token, user, account, profile }) {
      if (profile) {
        const fetchUser = (await db.account.findUnique({
          where: {
            providerAccountId: profile?.sub,
          },
          include: {
            user: true,
          },
        })) as Account & { user: User };
        console.log("fetchUser", fetchUser);

        if (fetchUser) {
          token.id = fetchUser.user.id;
          token.role = fetchUser.user.role;
          token.name = fetchUser.user.name!;
          token.email = fetchUser.user.email;
          token.image = fetchUser.user.image;
          token.providerAccountId = fetchUser.providerAccountId;
        }

        return token;
      }
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        // ...session.user,
        id: token.id,
        role: token.role,
        name: token.name,
        email: token.email,
        image: token.image,
        providerAccountId: token.providerAccountId,
      },
    }),
  },
  // adapter: PrismaAdapter(db) as Adapter,
  providers: [
    LineProvider({
      authorization: {
        params: {
          max_age: 90 * 24 * 60 * 60,
        },
      },
      clientId: env.LINE_CLIENT_ID,
      clientSecret: env.LINE_CLIENT_SECRET,
    }),
    // DiscordProvider({
    //   clientId: env.DISCORD_CLIENT_ID,
    //   clientSecret: env.DISCORD_CLIENT_SECRET,
    // }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

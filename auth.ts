import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./db";

const SCOPES = "openid email profile";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 30 * 24 * 3600 },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/", error: "/" }, // errors return to the SPA as /?error=Code
  providers: [GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID ?? "", clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    authorization: { params: { scope: SCOPES } },
  })],
  callbacks: {
    async signIn({ profile }) { return !!profile?.email && (profile as { email_verified?: boolean }).email_verified !== false; },
    async jwt({ token, account, profile }) {
      if (account && profile?.email) {
        const picture = (profile as { picture?: string }).picture;
        const user = await prisma.user.upsert({ where: { email: profile.email },
          update: { name: profile.name, image: picture }, create: { email: profile.email, name: profile.name, image: picture } });
        token.uid = user.id;

      }
      return token;
    },
    async session({ session, token }) { if (session.user) (session.user as { id?: string }).id = token.uid as string; return session; },
  },
};

import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Enter your email" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password.");
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("No account found with this email.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Incorrect password.");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name:user.name,
          country: user.country || null,
          imageUrl: user.imageUrl || null
        };
      }
    }),
     GitHubProvider({
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET
  }),
  GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      authorization:{
        params:{
          scope:"email public_profile"
        }
      }
    }),
  ],

callbacks: {
  async jwt({ token, user, account, profile }) {
    if (user) {
      token.id = user.id
      token.email = user.email
      if (profile?.name) {
        token.name = profile.name
      } else if (user.name) {
        token.name = user.name
      } else {
        token.name = user.email.split("@")[0]
      }
      token.imageUrl = user.imageUrl || profile?.avatar_url || null
    }
    return token
  },

  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id
      session.user.email = token.email
      session.user.name = token.name
      session.user.imageUrl = token.imageUrl
    }
    return session
  }
},


  pages: {
    signIn: "/login",
    error: "/login"
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 
  },

  secret: process.env.NEXTAUTH_SECRET
};

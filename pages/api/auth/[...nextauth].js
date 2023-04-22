import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";

const AdminUsers = () => {
  let admins = (process.env.ADMIN_USERS).split(", ")
}

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
    // ...add more providers here
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, account }) {
      //  Get a secure access token.
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Add an access token variable to the user session object.
      session.accessToken = token.accessToken;
      return session;
    },
    async signIn({ account, profile }) {
      // Only sign in with allowed email addresses.
      const admins = (process.env.ADMIN_USERS).split(", ")

      // if (account.provider === "google") {
      //   return profile.email_verified && admins.includes(profile.email)
      // }
      return admins.includes(profile.email)
    },
  },
}
export default NextAuth(authOptions)

import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from './prisma'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id
        
        // Get or create subscription
        let subscription = await prisma.subscription.findFirst({
          where: { userId: user.id }
        })
        
        if (!subscription) {
          subscription = await prisma.subscription.create({
            data: {
              userId: user.id,
              status: 'FREE',
              plan: 'FREE'
            }
          })
        }
        
        session.user.subscription = subscription
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  session: {
    strategy: 'database',
  },
}

export default NextAuth(authOptions)
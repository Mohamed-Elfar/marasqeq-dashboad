import NextAuth from 'next-auth'
import { AuthOptions } from 'next-auth'

// For now, we'll use a simple auth configuration
// You can extend this with proper providers later
const authOptions = {
  providers: [
    // Add your auth providers here
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

import { API_URL } from '@/config';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios'
import { jwtDecode } from 'jwt-decode';

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('Please provide process.env.NEXTAUTH_SECRET');
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      type: 'credentials',
      id: 'credentials',
      credentials: {
        username: { label: 'username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials) {
          throw new Error('No credentials.');
        }
        const res = await axios.post(`${API_URL}/User/LoginUser`, credentials);
        const data = await res.data;
        if (!data) {
          throw new Error('No data - something went wrong with login.');
        }
        if (data.error) {
          throw new Error(data.error)
        }
        const decoded: any = jwtDecode(data?.token)
        const roles = [decoded?.role];
        const userData: any = {
          token: data?.token,
          user: {
            username: decoded.unique_name[1],
            firstName: decoded.given_name,
            lastName: decoded.family_name,
            userId: decoded.nameid,
            email: decoded.email
          },
          role: roles,
        };
        return userData;
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60 // 7 hours
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).user.userId;
        token.username = (user as any).user.username;
        token.firstName = (user as any).user.firstName;
        token.lastName = (user as any).user.lastName;
        token.email = (user as any).user.email;
        token.role = (user as any).role;
        token.token = (user as any).token;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        (session as any).user.id = token.id;
        (session as any).user.username = token.username;
        (session as any).user.firstName = token.firstName;
        (session as any).user.lastName = token.lastName;
        (session as any).user.email = token.email;
        (session as any).user.role = token.role;
        (session as any).token = token.token;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
}


export default NextAuth(authOptions)

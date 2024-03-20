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
      const res = await axios.post(`${API_URL}/User/LoginUser`,credentials);
      const data = await res.data;
      if(!data) {
        throw new Error('No data - something went wrong with login.');
      }
      if(data.error){
        throw new Error(data.error)
      }
      const decoded: any = jwtDecode(data?.token)
      const roles = [decoded?.role]; 
      const userData = {
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
    maxAge: 8 * 60  * 60 // 7 hours
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.user.userId;
        token.username = user.user.username;
        token.firstName = user.user.firstName;
        token.lastName = user.user.lastName;
        token.email = user.user.email;
        token.role = user.role;
        token.token = user.token;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.email = token.email;
        session.user.role = token.role;
        session.token = token.token;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
}


export default NextAuth(authOptions)

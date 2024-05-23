import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: any,
            username: string,
            firstName: string,
            lastName: string,
            email: string,
            role: string,
        }
    }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
    interface JWT {
        user: {
            id: any,
            username: string,
            firstName: string,
            lastName: string,
            email: string,
            role: string,
        }
    }
}
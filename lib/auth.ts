import { betterAuth,BetterAuthOptions } from "better-auth";
import {prismaAdapter} from 'better-auth/adapters/prisma'
import prisma from "./prisma";

export const auth = betterAuth({
    database:prismaAdapter(prisma,{ 
        provider:"postgresql"
    }),
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
        cookieCache: {
          enabled: true,
          maxAge: 5 * 60 
        }
    },
    socialProviders:{
        github:{
            clientId: process.env.GITHUB_CLIENT_ID as string, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
        },
        google:{
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        },
    }
}satisfies BetterAuthOptions)
export type Session = typeof auth.$Infer.Session;
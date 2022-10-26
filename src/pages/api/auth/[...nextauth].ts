import { query } from 'faunadb';
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { fauna } from "../../../services/fauna";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {params: {scope: 'read:user'}}
    }),
  ],
  callbacks: {
    // async session({session}) {
    //   try {
    //     const userActiveSubscription = await fauna.query<string>(
    //       query.Get(
    //         query.Intersection([
    //           query.Match(
    //             query.Index('subscription_by_user_ref'),
    //             query.Select(
    //               "ref",
    //               query.Get(
    //                 query.Match(
    //                   query.Index('user_by_email'),
    //                   query.Casefold(session.user.email)
    //                 )
    //               )
    //             )
    //           ),
    //           query.Match(
    //             query.Index('subscription_by_status'),
    //             query.Casefold('active')
    //           )
    //         ])
    //       )
    //     );

    //     return {
    //       ...session,
    //       activeSubscription: userActiveSubscription
    //     };
    //   } catch(err) {
    //     console.log('entrou')
    //     return {
    //       ...session,
    //       activeSubscription: null
    //     }
    //   }
    // },

    async signIn({ user, account, profile }) {
      const { email } = user;

      try {
        await fauna.query(
          query.If(
            query.Not(
              query.Exists(
                query.Match(
                  query.Index('user_by_email'),
                  query.Casefold(user.email)
                )
              )
            ),
            query.Create(
              query.Collection('users'),
              {data: { email }}
            ),
            query.Get(
              query.Match(
                query.Index('user_by_email'),
                query.Casefold(user.email)
              )
            )
          )
        );
        
        return true
      } catch {
        return false;
      }
    },
  }
}
export default NextAuth(authOptions)
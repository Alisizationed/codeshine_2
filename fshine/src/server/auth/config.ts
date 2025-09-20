/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

/**
 * Extend the session and JWT token types to include additional fields.
 */

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      keycloakId: string;
    } & DefaultSession["user"];
    accessToken?: string;
    idToken?: string;
    error?: string;
  }

  interface JWT {
    id_token?: string;
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
    sub?: string;
    error?: string;
  }
}

/**
 * NextAuth configuration with Keycloak and refresh token handling.
 */
export const authConfig = {
  providers: [
    KeycloakProvider({
      clientId: process.env.AUTH_KEYCLOAK_ID!,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET!,
      issuer: process.env.AUTH_KEYCLOAK_ISSUER!,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, account }) {
      // On initial login
      if (account) {
        return {
          ...token,
          id_token: account.id_token,
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          expires_at: account.expires_at, // Keycloak returns seconds
        };
      }

      // If token is still valid, return it
      if (Date.now() < (token?.expires_at as any ?? 0) * 1000) {
        return token;
      }

      // If no refresh token available
      if (!token.refresh_token) {
        console.warn("Missing refresh token, cannot refresh access_token");
        return { ...token, error: "RefreshTokenMissing" };
      }

      // Refresh token logic
      try {
        const response = await fetch(
          `${process.env.AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              client_id: process.env.AUTH_KEYCLOAK_ID!,
              client_secret: process.env.AUTH_KEYCLOAK_SECRET!,
              grant_type: "refresh_token",
              refresh_token: token.refresh_token as any,
            }),
          },
        );

        const refreshedTokens = await response.json();

        if (!response.ok) {
          throw new Error(
            refreshedTokens.error_description ?? "Token refresh failed",
          );
        }

        return {
          ...token,
          id_token: refreshedTokens.id_token,
          access_token: refreshedTokens.access_token,
          expires_at:
            Math.floor(Date.now() / 1000) + refreshedTokens.expires_in,
          refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
        };
      } catch (error) {
        console.error("Error refreshing token:", error);
        return { ...token, error: "RefreshTokenError" };
      }
    },

    session({ session, token }) {
      const keycloakId = JSON.parse(
        Buffer.from((token.id_token as any).split(".")[1], "base64").toString(),
      ).sub;
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub ?? "",
          keycloakId,
        },
        idToken: token.id_token,
        accessToken: token.access_token,
      };
    },
  },
  events: {
    async signOut({ token } : any) {
      if (token?.refreshToken) {
        try {
          const issuerUrl = process.env.AUTH_KEYCLOAK_ISSUER;

          const revokeUrl = `${issuerUrl}/protocol/openid-connect/revoke`;

          const params = new URLSearchParams();
          params.append("client_id", process.env.AUTH_KEYCLOAK_ID!);
          params.append("client_secret", process.env.AUTH_KEYCLOAK_SECRET!);
          params.append("token", token.refreshToken as string);
          params.append("token_type_hint", "refresh_token");

          await fetch(revokeUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params.toString(),
          });

          if (token?.accessToken) {
            const accessParams = new URLSearchParams();
            accessParams.append("client_id", process.env.AUTH_KEYCLOAK_ID!);
            accessParams.append(
              "client_secret",
              process.env.AUTH_KEYCLOAK_SECRET!,
            );
            accessParams.append("token", token.accessToken as string);
            accessParams.append("token_type_hint", "access_token");

            await fetch(revokeUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: accessParams.toString(),
            });
          }
        } catch (err) {
          console.error("Error during Keycloak token revocation:", err);
        }
      }
    },
  },
} satisfies NextAuthConfig;

declare namespace Express {
  // JWT authenticated user (from AuthGuard)
  export interface User {
    id: string;
    googleId: string;
    name: string;
    teamId?: string;
    teamName?: string;
  }

  // OAuth user (from GoogleOauthGuard)
  export interface OAuthUser {
    provider: string;
    providerId: string;
    email: string;
    name: string;
    picture: string;
  }

  export interface Request {
    user?: User | OAuthUser;
  }

  export interface Response {
    cookie(
      name: string,
      value: string,
      options?: {
        httpOnly?: boolean;
        secure?: boolean;
        sameSite?: 'strict' | 'lax' | 'none';
        domain?: string;
        expires?: Date;
        maxAge?: number;
        path?: string;
      }
    ): this;
  }
}

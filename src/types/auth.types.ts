import { Request } from 'express';
import { JWTPayload, User } from './user.types';

// Interface for requests with JWT authentication (using jwtUser property)
export interface JWTAuthenticatedRequest extends Request {
  jwtUser: JWTPayload;
}

// Interface for requests with OAuth authentication (using user property)
export interface OAuthAuthenticatedRequest extends Request {
  user: User;
}

// Type guard to check if request has JWT authenticated user
export function isJWTAuthenticated(req: Request): req is JWTAuthenticatedRequest {
  return 'jwtUser' in req && req.jwtUser !== undefined;
}

// Type guard to check if request has OAuth authenticated user
export function isOAuthAuthenticated(req: Request): req is OAuthAuthenticatedRequest {
  return req.user !== undefined && 'id' in req.user;
}

// Helper function to get user ID from either auth type
export function getUserId(req: Request): string | null {
  if (isJWTAuthenticated(req)) {
    return req.jwtUser.userId;
  }
  if (isOAuthAuthenticated(req)) {
    return req.user.id;
  }
  return null;
}
import { Request } from 'express';
import { JWTPayload } from './user.types';

// Interface for requests with JWT authentication
export interface AuthenticatedRequest extends Request {
  user: JWTPayload;
}

// Type guard to check if request has authenticated user
export function isAuthenticatedRequest(req: Request): req is AuthenticatedRequest {
  return req.user !== undefined && 'userId' in req.user;
}
import { JWTPayload } from './user.types';
import { User as UserModel } from './user.types';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload; // For JWT authenticated requests
    }
    
    // For Passport OAuth - this extends the default Passport User
    interface User extends UserModel {}
  }
}
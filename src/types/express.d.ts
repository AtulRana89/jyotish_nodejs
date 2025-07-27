import { User as UserModel } from './user.types';

declare global {
  namespace Express {
    // For Passport OAuth - this extends the default Passport User
    interface User extends UserModel {}
  }
}
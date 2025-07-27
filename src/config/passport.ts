import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { UserService } from '../services/userService';
import { User } from '../types/user.types';

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await UserService.findByProviderId('google', profile.id);
    
    if (user) {
      return done(null, user);
    }

    // Check if user exists with same email
    user = await UserService.findByEmail(profile.emails?.[0]?.value || '');
    
    if (user) {
      // Update existing user with Google provider info
      user = await UserService.updateUser(user.id, {
        provider: 'google',
        providerId: profile.id,
        avatar: profile.photos?.[0]?.value
      });
      return done(null, user);
    }

    // Create new user
    user = await UserService.createUser({
      email: profile.emails?.[0]?.value || '',
      name: profile.displayName || '',
      avatar: profile.photos?.[0]?.value,
      provider: 'google',
      providerId: profile.id,
      isVerified: true
    });

    return done(null, user);
  } catch (error) {
    return done(error, undefined);
  }
}));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID || '',
  clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  callbackURL: '/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await UserService.findByProviderId('github', profile.id);
    
    if (user) {
      return done(null, user);       
    }

    // Check if user exists with same email
    const email = profile.emails?.[0]?.value || `${profile.username}@github.local`;
    user = await UserService.findByEmail(email);
    
    if (user) {
      // Update existing user with GitHub provider info
      user = await UserService.updateUser(user.id, {
        provider: 'github',
        providerId: profile.id,
        avatar: profile.photos?.[0]?.value
      });
      return done(null, user);
    }

    // Create new user
    user = await UserService.createUser({
      email,
      name: profile.displayName || profile.username || '',
      avatar: profile.photos?.[0]?.value,
      provider: 'github',
      providerId: profile.id,
      isVerified: true
    });

    return done(null, user);
  } catch (error) {
    return done(error, undefined);
  }
}));

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserService.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
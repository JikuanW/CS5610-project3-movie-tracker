import passport from 'passport';
import passportLocal from 'passport-local';
import { ObjectId } from 'mongodb';
import { getDb } from '../db/mongo.js';
import { verifyPassword } from '../utils/password.js';

const { Strategy: LocalStrategy } = passportLocal;

// Configure passport local strategy and session handling
function configurePassport() {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const db = getDb();
        const users = db.collection('users');
        const trimmedUsername = username ? username.trim() : '';
        const user = await users.findOne({ username: trimmedUsername });

        if (!user || !verifyPassword(password, user.passwordHash)) {
          return done(null, false, {
            message: 'Invalid username or password',
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user._id.toString());
  });

  passport.deserializeUser(async (userId, done) => {
    try {
      const db = getDb();
      const users = db.collection('users');
      const user = await users.findOne({ _id: new ObjectId(userId) });

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  });
}

export { passport, configurePassport };

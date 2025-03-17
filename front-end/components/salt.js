import bcrypt from 'bcryptjs';

export const SALT = bcrypt.genSaltSync(10); //generate password hash salt
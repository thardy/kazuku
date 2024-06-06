import crypto, {scrypt, randomBytes} from 'crypto';
import {promisify} from 'util';

const scryptAsync = promisify(scrypt);


async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(8).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;

  return `${buf.toString('hex')}.${salt}`;
}

async function comparePasswords(storedPassword: string, suppliedPassword: string): Promise<boolean> {
  const [hashedPassword, salt] = storedPassword.split('.');
  const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

  return buf.toString('hex') === hashedPassword;
}

const passwordUtils = {
  hashPassword,
  comparePasswords
};

export default passwordUtils;

import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

export class AuthController {
  static async getConnect(req, res) {
    const auth = req.headers.authorization;
    const base64String = auth.split(' ')[1];
    const decodedString = Buffer.from(base64String, 'base64').toString('utf-8');
    const [email, password] = decodedString.split(':');
    const hashedPassword = sha1(password);
    const user = await dbClient.users.findOne({ email, password: hashedPassword });
    if (!user) {
      res.status(401);
      res.send({ error: 'Unauthorized' });
    }
    const token = uuidv4();
    const key = `auth_${token}`;
    await redisClient.set(key, user._id.toString(), 24 * 60 * 60);
    res.status(200).send({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.header['X-Token'];
    const user = await redisClient.get(`auth_${token}`);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
    }
    await redisClient.del(`auth_${token}`);
    res.status(204).end();
  }
}

export default AuthController;

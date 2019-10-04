import * as express from 'express';
import { Request, Response } from 'express';

import { APIError } from '../models/api-response';
import { isAuthorized } from '../middleware';

export const router = express.Router();

const user = {
  email: 'test@test.com',
  password: '12345678',
  username: 'usertest'
};

router.get('/', (req: Request, res: Response) => {
  res.send({ message: 'Welcome to api!' });
});

router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(JSON.stringify(req.body));
  if (email === user.email && password === user.password) {
    return res.json({
      token: email
    });
  }
  res.status(401).json({
    code: 401,
    message: 'login failed!'
  } as APIError);
});

router.get('/user', isAuthorized, (req: Request, res: Response) => {
  return res.json({
    username: user.username
  });
});

router.get('/contacts', isAuthorized, (req: Request, res: Response) => {
  return res.json([
    { type: 'email', value: 'some@test.com' },
    { type: 'phone', value: '0123456789' },
    { type: 'address', value: 'some address' }
  ]);
});

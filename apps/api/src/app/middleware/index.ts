import { Request, Response, NextFunction } from 'express';
import { APIError } from '../models/api-response';
export function isAuthorized(req: Request, res: Response, next: NextFunction) {
  if (req.header('Authorization') === 'test@test.com') {
    return next();
  }
  return res.status(401).json({
    code: 4001, // some predefined code
    message: 'Unauthorized'
  } as APIError);
}

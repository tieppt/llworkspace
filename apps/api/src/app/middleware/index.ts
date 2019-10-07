import { Request, Response, NextFunction } from 'express';
import { APIError } from '../models/api-response';
export function isAuthorized(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization') || '';
  if ( token.includes('TEST_TOKEN')) {
    return next();
  }
  return res.status(401).json({
    code: 4001, // some predefined code
    message: 'Unauthorized'
  } as APIError);
}

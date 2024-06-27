import { NestMiddleware, BadRequestException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

export class ApiTokenCheckMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.token) {
      throw new BadRequestException('Protocol Error');
    }
    try {
      const jwtverify = jwt.verify(req.headers.token, process.env.SECRET);
      next();
    } catch (error) {
      throw new BadRequestException('This Protocol does not match');
    }
  }
}

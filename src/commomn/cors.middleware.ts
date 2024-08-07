import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class BlockExternalMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const allowedOrigins = ['http://karmashree.wbdeptemployment.in','http://wbkarmashree.in'];
    const origin = req.headers.origin;

    if (!origin || !allowedOrigins.includes(origin)) {
      throw new ForbiddenException('Access from this origin is not allowed');
    }

    next();
  }
}

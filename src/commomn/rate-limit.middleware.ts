import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private limiter: any;

  constructor() {
    this.limiter = rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minute window
      max: 1, // limit each IP to 1 request per windowMs
      message: { "errorCode": 1, "message": 'Too many requests for OTP resend from this IP, please try again later' },
          
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.limiter(req, res, next);
  }
}

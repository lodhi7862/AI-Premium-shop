import { Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Check if Authorization header exists
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided. Please log in first.');
    }

    // Call parent's canActivate to do the actual JWT verification
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, _info: any) {
    // Handle any errors from the JWT strategy
    if (err) {
      throw err;
    }

    if (!user) {
      throw new UnauthorizedException('Authentication failed. Invalid or expired token.');
    }

    return user;
  }
}

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRoute } from '../guards/auth.guard';

export const User = createParamDecorator(
  (fieldName: string, context: ExecutionContext) => {
    try {
      const request = context.switchToHttp().getRequest<AuthenticatedRoute>();
      const user = request.user;
      
      if (fieldName && user && user[fieldName]) {
        return user[fieldName];
      }

      return user;
    } catch (error) {
      throw new Error('Failed to retrieve user information.');
    }
  },
);

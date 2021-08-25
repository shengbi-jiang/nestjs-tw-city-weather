import { ExecutionContext } from '@nestjs/common';

export interface AuthStrategy {
  authenticate(context: ExecutionContext): Promise<void>;
}

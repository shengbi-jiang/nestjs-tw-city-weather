import { UseGuards } from '@nestjs/common';
import { createGuardType } from './guard-type-factory';

export const LoginGuard = createGuardType('login');

export function UseLoginGuard() {
  return UseGuards(LoginGuard);
}

/**
 * Users Controller
 */

import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('users')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return this.usersService.getUserById(user.id);
  }

  @Get('addresses')
  async getAddresses(@CurrentUser() user: any) {
    return this.usersService.getUserAddresses(user.id);
  }
}

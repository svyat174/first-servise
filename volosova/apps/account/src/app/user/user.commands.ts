import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { AccountChangeProfile, AccountRegister, AccountUserCourses } from '@purple/contracts';
import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './entities/user.entity';

@Controller()
export class UserCommands {
	constructor(private readonly userRepository: UserRepository) {}

	@RMQValidate()
	@RMQRoute(AccountChangeProfile.topic)
	async userCourses(@Body() { user, id }: AccountChangeProfile.Request): Promise<AccountChangeProfile.Response> {
		const existedUser = await this.userRepository.findUserById(id);

		if (!existedUser) {
			throw new Error('User not found');
		}

		const userEntity = new UserEntity(existedUser).updateProfile(user.displayName);
		await this.userRepository.updateUser(userEntity);
		return {}
	}
}

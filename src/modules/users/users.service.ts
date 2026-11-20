// Service - файл, в котором мы изолируем бизнес логику нашего модуля
import { Injectable } from '@nestjs/common';

import { UserRepository } from './users.repository.js';
import { User } from './users.entity.js';
import { ROLE } from './enums/role.enum.js';
import { UserDto } from './dto/responses/users.dto.js';
import { UserSaveDto } from './dto/requests/users.save-dto.js';
import { UserUpdateDto } from './dto/requests/user.update-dto.js';
import { UsersMapper } from './dto/users.mapper.js';

@Injectable()
class UsersService {
  constructor(
    private readonly repository: UserRepository,
    private readonly mapper: UsersMapper,
  ) {}

  async createUser(userSaveDto: UserSaveDto): Promise<UserDto> {
    const entity: User = this.mapper.mapDtoToEntity(userSaveDto);
    entity.role = ROLE.CLIENT;
    entity.active = true;

    await this.repository.save(entity);
    return this.mapper.mapEntityToDto(entity);
  }

  async getAllActiveUsers(): Promise<UserDto[]> {
    const users: User[] = await this.repository.findAllActive();

    return this.mapper.mapEntityListToDtoList(users);
  }

  async getActiveEntityById(id: number): Promise<User> {
    const user = await this.repository.findById(id);

    if (!user || !user.active) {
      // return null;
      throw new Error();
    }

    return user;
  }

  async getActiveUserById(id: number): Promise<UserDto> {
    const user: User = await this.getActiveEntityById(id);

    return this.mapper.mapEntityToDto(user);
  }

  async updateUser(id: number, updateDto: UserUpdateDto): Promise<void> {
    const foundedUser: User | null = await this.repository.findById(id);

    if (foundedUser) {
      foundedUser.name = updateDto.newName;
      await this.repository.save(foundedUser);
    }
  }

  // На самом деле мы из БД пользователя не удаляем насовсем, мы просто меняем его статус active на false
  async deleteUserById(id: number): Promise<void> {
    const userForDelete: User | null = await this.repository.findById(id);

    if (userForDelete) {
      userForDelete.active = false;
      await this.repository.save(userForDelete);
    }
  }

  async restoreUserById(id: number): Promise<void> {
    const userForRestore: User | null = await this.repository.findById(id);

    if (userForRestore && !userForRestore.active) {
      userForRestore.active = true;
      await this.repository.save(userForRestore);
    }
  }

  async setRole(id: number, role: ROLE): Promise<void> {
    const user: User | null = await this.repository.findById(id);

    if (user) {
      user.role = role;
      await this.repository.save(user);
    }
  }
}

export { UsersService };

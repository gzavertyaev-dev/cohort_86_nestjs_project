import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import PoliciesService from './policies.service.js';
import { PolicyRepository } from './policies.repository.js';
import { CarsModule } from '../cars/cars.module.js';
import {UsersModule} from '../users/users.module.js'
import { Policy } from './policies.entity.js';
import {PoliciesMapper} from './dto/index.js'

@Module({
  imports: [TypeOrmModule.forFeature([Policy]), CarsModule, UsersModule],
  providers: [PoliciesService, PolicyRepository, PoliciesMapper],
})
class PoliciesModule {}

export { PoliciesModule };

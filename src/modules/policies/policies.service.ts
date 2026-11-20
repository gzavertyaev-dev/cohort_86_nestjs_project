import { Injectable } from '@nestjs/common';

import { PolicyRepository } from './policies.repository.js';
import { Policy } from './policies.entity.js';
import CarsService from '../cars/cars.service.js';
import { Car } from '../cars/cars.entity.js';
import { UsersService } from '../users/users.service.js';
// import { PoliciesMapper } from './dto/policies.mapper.js';
// import { PoliciesSaveDto } from './dto/requests/policies.save-dto.js';
// import { PoliciesDto } from './dto/responses/policies.dto.js';
import { PoliciesMapper, PoliciesDto, PoliciesSaveDto } from './dto/index.js';

@Injectable()
class PoliciesService {
  constructor(
    private readonly repository: PolicyRepository,
    private readonly carsService: CarsService,
    private readonly usersService: UsersService,
    private readonly mapper: PoliciesMapper,
  ) {}

  async createPolicy(policySaveDto: PoliciesSaveDto): Promise<PoliciesDto> {
    const entity: Policy = this.mapper.mapDtoToEntity(policySaveDto);
    const holder = await this.usersService.getActiveEntityById(
      policySaveDto.holderId,
    );
    const agent = await this.usersService.getActiveEntityById(
      policySaveDto.agentId,
    );
    entity.agent = agent;
    entity.holder = holder;
    entity.active = true;

    await this.repository.save(entity);
    return this.mapper.mapEntityToDto(entity);
  }

  async getAllActivePolicies(): Promise<PoliciesDto[]> {
    const policies: Policy[] = await this.repository.findAllActive();

    return this.mapper.mapEntityListToDtoList(policies);
  }

  async getActiveEntityById(id: number): Promise<Policy> {
    const policy: Policy | null = await this.repository.findById(id);

    if (!policy || !policy.active) {
      throw new Error();
    }

    return policy;
  }

  async getActivePolicyById(id: number): Promise<PoliciesDto> {
    const policy: Policy = await this.getActiveEntityById(id);

    return this.mapper.mapEntityToDto(policy);
  }

  async deleteById(id: number): Promise<void> {
    const policy: Policy | null = await this.repository.findById(id);

    if (policy) {
      policy.active = false;
      await this.repository.save(policy);
    }
  }

  async restoreById(id: number): Promise<void> {
    const policy: Policy | null = await this.repository.findById(id);

    if (policy && !policy.active) {
      policy.active = true;
      await this.repository.save(policy);
    }
  }

  async addActiveCarToActivePolicy(
    carId: number,
    policyId: number,
  ): Promise<void> {
    const policy: Policy = await this.getActiveEntityById(policyId);
    const car: Car | null = await this.carsService.getActiveEntityById(carId);

    if (policy && car) {
      policy.cars.push(car);
      await this.repository.save(policy);
    }
  }
}

export default PoliciesService;

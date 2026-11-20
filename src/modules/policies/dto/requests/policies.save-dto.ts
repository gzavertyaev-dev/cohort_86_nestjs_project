import { INSURANCE_TYPES } from '../../enums/insurance.enum.js';

// Создание страховки в DB
export class PoliciesSaveDto {
  type: INSURANCE_TYPES;
  holderId: number;
  agentId: number;
  coverage: number;
  issuedAt: Date;
  expiresAt: Date;
}

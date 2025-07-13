// ─────────────────────────────────────────────────────────────
// Domain entities representing core user and auth models
// ─────────────────────────────────────────────────────────────
export * from './entities/auth-tokens';
export * from './entities/mongo-user';
export * from './entities/user';

// ─────────────────────────────────────────────────────────────
// Data Transfer Objects used for input/output validation
// ─────────────────────────────────────────────────────────────
export * from './dtos/create-user.dto';
export * from './dtos/user-history.dto';
export * from './dtos/verify-assertion.dto';

// ─────────────────────────────────────────────────────────────
// Interfaces representing conversation and message structures
// ─────────────────────────────────────────────────────────────
export * from './interfaces/user-history.interface';
export * from './interfaces/user-message.interface';

// ─────────────────────────────────────────────────────────────
// Mapper functions to convert between raw input and DTOs
// ─────────────────────────────────────────────────────────────
export * from './mappers/verify-assertion-mapper';

// ─────────────────────────────────────────────────────────────
// Repository and service layers for domain logic and persistence
// ─────────────────────────────────────────────────────────────
export * from './repositories/user-repository';


// ─────────────────────────────────────────────────────────────
// Enums representing supported providers, services and plans
// ─────────────────────────────────────────────────────────────
export * from './enums/auth-provider';
export * from './enums/message-role.enum';
export * from './enums/service-name';
export * from './enums/subscription-event';
export * from './enums/subscription-plan';
export * from './enums/subscription-status';


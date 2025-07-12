// ─────────────────────────────────────────────────────────────
// Domain entities representing core user and auth models
// ─────────────────────────────────────────────────────────────
export * from './entities/User';
export * from './entities/AuthTokens';
export * from './entities/MongoUser';

// ─────────────────────────────────────────────────────────────
// Data Transfer Objects used for input/output validation
// ─────────────────────────────────────────────────────────────
export * from './dtos/VerifyAssertionDTO';
export * from './dtos/CreateUserDTO';

// ─────────────────────────────────────────────────────────────
// Mapper functions to convert between raw input and DTOs
// ─────────────────────────────────────────────────────────────
export * from './mappers/verifyAssertionMapper';

// ─────────────────────────────────────────────────────────────
// Repository and service layers for domain logic and persistence
// ─────────────────────────────────────────────────────────────
export * from './repositories/UserRepository';
export * from './services/AuthService';

// ─────────────────────────────────────────────────────────────
// Enums representing supported providers, services and plans
// ─────────────────────────────────────────────────────────────
export * from './enums/AuthProvider';
export * from './enums/SubscriptionPlan';
export * from './enums/SubscriptionStatus';
export * from './enums/ServiceName';
export * from './enums/SubscriptionEvent'

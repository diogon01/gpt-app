// Entidades
export * from './entities/auth-tokens';
export * from './entities/mongo-user';
export * from './entities/User';
export * from './entities/user-history-entry.entity';
export * from './entities/user-history.entity';
export * from './entities/user-message.entity';

// DTOs de Resposta
export * from './dtos/create-user.dto';
export * from './dtos/ia-response.dto'; // ✅ necessário para IA
export * from './dtos/response/history-search-response.dto';
export * from './dtos/response/user-history-entry-response.dto';
export * from './dtos/response/user-history-response.dto';
export * from './dtos/user-message-response.dto';
export * from './dtos/verify-assertion.dto';

// DTOs de Requisição
export * from './dtos/ia-request.dto'; // ✅ necessário para IA
export * from './dtos/request/history-rename-request.dto';

// Mappers
export * from './mappers/ia-response.mapper'; // ✅ necessário para IA
export * from './mappers/user-history.mapper';
export * from './mappers/verify-assertion-mapper';

// Repositórios
export * from './repositories/user-repository';

// Enums (exceto MessageRole)
export * from './enums/auth-provider';
// ❌ NÃO exporte diretamente message-role.enum para evitar conflito com o export manual abaixo
// export * from './enums/message-role.enum';
export * from './enums/service-name';
export * from './enums/subscription-event';
export * from './enums/subscription-plan';
export * from './enums/subscription-status';

// Export explícito (resolvendo erro de Rollup)
import { MessageRole as _MessageRole } from './enums/message-role.enum';
export const MessageRole = _MessageRole;


export const _domainEntryPoint = true;
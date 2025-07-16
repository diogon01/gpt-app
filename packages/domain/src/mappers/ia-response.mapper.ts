// packages/domain/src/mappers/ia-response.mapper.ts

import { IAResponseDTO } from '../dtos/ia-response.dto';
import { MessageRole } from '../enums/message-role.enum';

export function mapIAResponse(result: any, mongoId?: string): IAResponseDTO {
  return {
    _id: mongoId, // ← Inclui o _id no retorno, se fornecido
    id: result.id,
    object: result.object,
    created: result.created,
    model: result.model,
    choices: result.choices.map((c: any) => ({
      index: c.index,
      message: {
        role: c.message?.role ?? MessageRole.Assistant,
        content: c.message?.content ?? '',
      },
      finish_reason: c.finish_reason ?? null,
    })),
    usage: result.usage,
  };
}

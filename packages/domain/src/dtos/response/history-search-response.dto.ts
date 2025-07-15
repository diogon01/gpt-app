import { UserHistoryEntryEntity } from "../../entities/user-history-entry.entity";


/**
 * HistorySearchResponseDTO
 * ------------------------------------------------------------------
 * Padroniza o retorno da busca de histórico.
 *
 * @property matches  Array com todas as sessões que contêm o termo buscado
 * @property total    Número total de sessões encontradas
 * @property query    Termo utilizado na pesquisa (echo back)
 */
export interface HistorySearchResponseDTO {
  /** Sessions that matched the query, ordered by relevance or date */
  matches: UserHistoryEntryEntity[];
  /** Total number of sessions returned (para paginação futura) */
  total: number;
  /** Echo do termo de busca para referência no frontend */
  query: string;
}

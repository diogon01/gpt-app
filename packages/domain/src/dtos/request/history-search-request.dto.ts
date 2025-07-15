/**
 * HistorySearchRequestDTO
 * ------------------------------------------------------------------
 * Request payload for searching messages inside a user's chat history.
 *
 * This DTO é usado quando a busca é enviada via corpo (POST) ou pode ser
 * reutilizado como referência de tipagem caso a busca seja feita por query
 * string (GET /history/search?q=...).
 *
 * @property query   Texto livre a ser pesquisado em prompts e respostas
 */
export interface HistorySearchRequestDTO {
  /** Free-text search term (case-insensitive, min 2 chars recommended) */
  query: string;
}

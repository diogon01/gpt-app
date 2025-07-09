import { OpenAI } from 'openai';
import { env } from './env';

if (!env.azureOpenAiKey || !env.azureOpenAiEndpoint || !env.azureOpenAiDeployment) {
    throw new Error('⚠️  Variáveis AZURE_OPENAI_* não definidas no .env');
}

export const openai = new OpenAI({
    apiKey: env.azureOpenAiKey,
    baseURL: `${env.azureOpenAiEndpoint}/openai/deployments/${env.azureOpenAiDeployment}`,
    defaultQuery: { 'api-version': '2024-02-15-preview' },
    defaultHeaders: { 'api-key': env.azureOpenAiKey },
});

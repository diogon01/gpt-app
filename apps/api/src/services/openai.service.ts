import { OpenAI } from 'openai';
import { env } from '../config/env';

/**
 * Generates a chat completion with Azure OpenAI.
 * Creates a fresh client per call so the deployment (`model`) goes in the path.
 */
export async function generateChatCompletion(prompt: string, model: string) {
    // Build a client for THIS deployment
    const client = new OpenAI({
        apiKey: env.azureOpenAiKey,
        baseURL: `${env.azureOpenAiEndpoint}/openai/deployments/${model}`,
        defaultQuery: { 'api-version': env.azureOpenAiVersion },
        defaultHeaders: { 'api-key': env.azureOpenAiKey }
    });

    try {
        const response = await client.chat.completions.create({
            model,
            messages: [
                {
                    role: 'system',
                    content:
                        'Você é um assistente de IA que ajuda as pessoas a encontrar informações.'
                },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 800,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        });

        return response;
    } catch (err: any) {
        // Azure OpenAI error handling
        const status = err?.status ?? 'unknown';
        const code = err?.code ?? 'unknown';
        const msg = err?.message ?? 'OpenAI request failed';

        throw new Error(`Azure OpenAI Error [${status} | ${code}]: ${msg}`);
    }
}

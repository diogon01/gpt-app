import OpenAI from "openai";
import { env } from "./env";

/* Validate mandatory env vars */
const missing: string[] = [];
if (!env.azureOpenAiKey) missing.push('AZURE_OPENAI_KEY');
if (!env.azureOpenAiEndpoint) missing.push('AZURE_OPENAI_ENDPOINT');

if (missing.length) {
    throw new Error(
        `⚠️  Missing env vars: ${missing.join(', ')}. Check your .env configuration.`
    );
}

/* Generic client (rarely used, but exported for image generation) */
export const openai = new OpenAI({
    apiKey: env.azureOpenAiKey,
    baseURL: `${env.azureOpenAiEndpoint}/openai`, // generic; per-call client builds full path
    defaultQuery: { 'api-version': env.azureOpenAiVersion },
    defaultHeaders: { 'api-key': env.azureOpenAiKey }
});

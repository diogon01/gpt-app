import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';
dotenv.config();

export const openai = new OpenAI({
    apiKey: process.env.AZURE_OPENAI_KEY,
    baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_GPT}`,
    defaultQuery: { 'api-version': '2024-02-15-preview' },
    defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_KEY! },
});

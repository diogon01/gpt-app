// src/controllers/ia.controller.ts
import { Request, Response } from 'express';
import { openai } from '../config/openai';
import { PromptResult } from '../models/PromptResult';

export async function handleIA(req: Request, res: Response) {
    const { prompt } = req.body;
    const tipo = req.params.tipo as 'art' | 'geo';

    try {
        let result: any;

        if (tipo === 'art') {
            // imagem via DALL·E
            result = await openai.images.generate({
                prompt,
                size: '1024x1024',
            });
        } else {
            // texto via GPT
            result = await openai.chat.completions.create({
                model: process.env.AZURE_OPENAI_DEPLOYMENT_GPT!,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
            });
        }

        // salva no banco
        await PromptResult.create({ prompt, type: tipo, response: result });

        res.json(result);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: 'AI error', detail: err.message });
    }
}

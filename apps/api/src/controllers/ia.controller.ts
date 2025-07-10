// apps/api/src/controllers/ia.controller.ts
import { RequestHandler } from 'express';
import { openai } from '../config/openai';
import { PromptResult } from '../models/PromptResult';

export const handleIA: RequestHandler = async (req, res, next) => {
    const { prompt, modelo } = req.body;

    /* ─────── basic validation ─────── */
    if (!prompt || !modelo) {
        res.status(400).json({ error: 'Required parameters: prompt and modelo' });
        return; // <- return *void*, not the Response object
    }

    try {
        let result: any;

        /* ─────── choose GPT vs. DALL·E ─────── */
        if (modelo === 'GeoAI' || modelo.toLowerCase().includes('gpt')) {
            result = await openai.chat.completions.create({
                model: process.env.AZURE_OPENAI_DEPLOYMENT_GPT!,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
            });
        } else {
            result = await openai.images.generate({
                prompt,
                size: '1024x1024',
            });
        }

        /* ─────── save history for authenticated users ─────── */
        if (req.user) {
            await PromptResult.create({
                userId: req.user.id,
                prompt,
                type: modelo,
                response: result,
            });
        }

        res.json(result);          // send payload
        // no "return res.json(...)"  -> keeps ReturnType = void
    } catch (err) {
        next(err);                 // forward to global error handler
    }
};

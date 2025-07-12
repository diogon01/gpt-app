import { RequestHandler } from 'express';
import { openai } from '@42robotics/infra/src/config/openai';
import { PromptResult } from '../models/PromptResult';
import { generateChatCompletion } from '../services/openai.service';

export const handleIA: RequestHandler = async (req, res, next) => {
    const { prompt, model } = req.body;

    // ─────── basic validation ───────
    if (!prompt || !model) {
        res.status(400).json({ error: 'Required parameters: prompt and model' });
        return;
    }

    try {
        let result: any;

        // ─────── Decide between chat or image generation ───────
        if (model === 'GeoAI' || model.toLowerCase().includes('gpt')) {
            result = await generateChatCompletion(prompt, model);
        } else {
            result = await openai.images.generate({
                model,
                prompt,
                size: '1024x1024'
            });
        }

        // ─────── Save to history if authenticated ───────
        if (req.user) {
            await PromptResult.create({
                userId: req.user.id,
                prompt,
                type: model,
                response: result
            });
        }

        res.json(result);
    } catch (err) {
        next(err);
    }
};

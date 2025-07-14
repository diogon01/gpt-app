import { IARequestDTO } from '@42robotics/domain/src/dtos/ia-request.dto';
import { IAResponseDTO } from '@42robotics/domain/src/dtos/ia-response.dto';
import { mapIAResponse } from '@42robotics/domain/src/mappers/ia-response.mapper';
import { openai } from '@42robotics/infra/src/config/openai';
import { RequestHandler } from 'express';
import { HistoryService } from '../services/history.service';
import { generateChatCompletion } from '../services/openai.service';

export const handleIA: RequestHandler = async (req, res, next) => {
    const { prompt, model } = req.body as IARequestDTO;

    console.log('📥 [handleIA] Incoming request received');

    if (!prompt || !model) {
        console.warn('⚠️ [handleIA] Missing prompt or model');
        res.status(400).json({ error: 'Required parameters: prompt and model' });
        return;
    }

    try {
        let result: any;

        console.log(`🧠 [handleIA] Processing model: ${model}`);

        if (model === 'GeoAI' || model.toLowerCase().includes('gpt')) {
            console.log('💬 [handleIA] Generating chat completion...');
            result = await generateChatCompletion(prompt, model);
            console.log('✅ [handleIA] Chat completion generated');
        } else {
            console.log('🖼️ [handleIA] Generating image...');
            result = await openai.images.generate({
                model,
                prompt,
                size: '1024x1024',
            });
            console.log('✅ [handleIA] Image generated');
            res.json(result);
            return;
        }

        if (req.user) {
            console.log(`💾 [handleIA] Saving result to history for user: ${req.user.id}`);
            await HistoryService.savePromptResult({
                userId: req.user.id,
                prompt,
                type: model,
                response: result,
            });
        }

        const response: IAResponseDTO = mapIAResponse(result);

        console.log('📤 [handleIA] Sending response to client');
        res.json(response);
    } catch (err) {
        console.error('❌ [handleIA] Error while processing request:', err);
        next(err);
    }
};

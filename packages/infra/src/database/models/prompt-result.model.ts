// src/models/PromptResult.ts
import { Schema, model } from 'mongoose';

const schema = new Schema({
    prompt: String,
    type: { type: String, enum: ['art', 'geo'] },
    response: Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now },
});
export const PromptResult = model('PromptResult', schema);

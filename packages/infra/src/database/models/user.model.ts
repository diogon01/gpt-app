// packages/infra/src/database/models/User.ts

import { Schema, model, Document } from 'mongoose';

/**
 * Represents a persisted Firebase-authenticated user in MongoDB.
 */
export interface IUser extends Document {
    firebaseUid: string;
    federatedId: string;
    providerId: string;
    email: string;
    emailVerified: boolean;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    photoUrl?: string;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        firebaseUid: { type: String, required: true, unique: true },
        federatedId: { type: String, required: true },
        providerId: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        emailVerified: { type: Boolean, default: false },
        firstName: { type: String },
        lastName: { type: String },
        fullName: { type: String },
        photoUrl: { type: String },
        lastLogin: { type: Date },
    },
    {
        timestamps: true,
        collection: 'firebase_users', // opcional: define o nome fixo da coleção
    }
);

export const User = model<IUser>('User', UserSchema);

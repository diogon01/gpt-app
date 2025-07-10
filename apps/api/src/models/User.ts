import { Schema, model, Document } from 'mongoose';

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
        firstName: String,
        lastName: String,
        fullName: String,
        photoUrl: String,
        lastLogin: Date,
    },
    { timestamps: true }
);

export const User = model<IUser>('User', UserSchema);

// packages/infra/src/database/models/user-history.model.ts
import { MessageRole } from '@42robotics/domain/enums/message-role.enum';
import { UserHistory } from '@42robotics/domain/interfaces/user-history.interface';
import { UserMessage } from '@42robotics/domain/interfaces/user-message.interface';
import { Document, Schema, model } from 'mongoose';

/**
 * Extension of the domain interface to support Mongoose-specific behavior.
 */
interface IUserHistoryDocument extends UserHistory, Document { }

const MessageSchema = new Schema<UserMessage>(
    {
        role: {
            type: String,
            enum: Object.values(MessageRole),
            required: true,
        },
        content: { type: String, required: true },
    },
    { _id: false }
);

const UserHistorySchema = new Schema<IUserHistoryDocument>(
    {
        firebaseUid: { type: String, required: true, index: true },
        history: [
            {
                timestamp: { type: Date, required: true },
                messages: [MessageSchema],
            },
        ],
    },
    {
        timestamps: true,
        collection: '42r_user_histories_prod',
    }
);

export const UserHistoryModel = model<IUserHistoryDocument>(
    'UserHistory',
    UserHistorySchema
);

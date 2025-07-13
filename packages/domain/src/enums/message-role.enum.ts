export enum MessageRole {
    System = 'system',
    User = 'user',
    Assistant = 'assistant',
    Tool = 'tool', // Optional - in case of OpenAI tool calls
    Function = 'function' // Optional - if using function calling
}

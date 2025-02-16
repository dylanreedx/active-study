// utils/build-convo-history.ts
/**
 * Build a conversation history string from the user record.
 * Expects userRecord.messages and userRecord.responses to be JSON strings of string arrays.
 */
export function buildConversationHistory(userRecord) {
    let messages = [];
    let responses = [];
    try {
        messages = JSON.parse(userRecord.messages || '[]');
    }
    catch {
        messages = [];
    }
    try {
        responses = JSON.parse(userRecord.responses || '[]');
    }
    catch {
        responses = [];
    }
    // Interleave messages and responses.
    const historyParts = [];
    const maxLength = Math.max(messages.length, responses.length);
    for (let i = 0; i < maxLength; i++) {
        if (i < messages.length) {
            historyParts.push(`User: ${messages[i]}`);
        }
        if (i < responses.length) {
            historyParts.push(`Assistant: ${responses[i]}`);
        }
    }
    return historyParts.join('\n');
}

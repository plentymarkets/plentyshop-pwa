/**
 * Reasons the chatbot gives for a failed text block. The SDK throws them as the `key` of the ApiError.
 */
export const AI_TEXT_BLOCK_REJECTED = 'TEXT_BLOCK_REJECTED';
export const AI_TEXT_BLOCK_MISSING_ITEM_ID = 'TEXT_BLOCK_MISSING_ITEM_ID';
export const AI_TEXT_BLOCK_HTML_VALIDATION_FAILED = 'HTML_VALIDATION_FAILED';

export const AI_GENERATION_FAILED_MESSAGE = 'AI generation failed.';
export const AI_MISSING_ITEM_ID_MESSAGE =
  'Please add the item ID (and, if needed, the variation ID) of the product to your prompt.';
export const AI_HTML_VALIDATION_FAILED_MESSAGE =
  'The AI could not create a usable text for this request. Please rephrase your prompt and try again.';

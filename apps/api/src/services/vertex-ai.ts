import { VertexAI, GenerativeModel, HarmCategory, HarmBlockThreshold } from '@google-cloud/vertexai';
import type { ChatMessage, ArtistRole } from '@expressions/shared';

const PROJECT_ID = process.env.GCP_PROJECT_ID || 'gen-lang-client-0010416291';
const LOCATION = 'us-central1';
const GEMINI_MODEL = 'gemini-2.0-flash-001';

let vertexAI: VertexAI;
let geminiModel: GenerativeModel;

export function getGeminiModel(): GenerativeModel {
  if (geminiModel) return geminiModel;

  if (!vertexAI) {
    vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });
  }

  geminiModel = vertexAI.getGenerativeModel({
    model: GEMINI_MODEL,
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ],
  });

  return geminiModel;
}

const ROLE_SYSTEM_PROMPTS: Record<ArtistRole, string> = {
  tutor: 'You are an art tutor for Expressions, an AI-powered creative platform. Guide the artist with patient, educational responses. Explain concepts clearly, offer step-by-step guidance, and celebrate progress. Always encourage artistic growth.',
  guide: 'You are a creative guide for Expressions. Help the artist find their direction without prescribing it. Ask thoughtful questions, offer multiple paths, and help them trust their instincts.',
  critic: 'You are a constructive art critic for Expressions. Offer honest, specific, and actionable feedback. Balance encouragement with candid observations. Focus on craft, intention, and effect — never be dismissive.',
  freestyle: "You are a creative collaborator for Expressions. Be a brainstorming partner, a sounding board, and an enthusiastic ally. Match the artist's energy and help them think freely without constraints.",
};

export function buildSystemPrompt(role: ArtistRole, emotionalIntent?: string): string {
  let prompt = ROLE_SYSTEM_PROMPTS[role];
  if (emotionalIntent) {
    prompt += `\n\nThe artist has set an emotional intent for this session: "${emotionalIntent}". Keep this in mind and gently reference it when relevant.`;
  }
  return prompt;
}

export function mapToVertexHistory(messages: ChatMessage[]) {
  return messages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));
}

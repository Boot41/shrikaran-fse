// Example for React
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: import.meta.env.REACT_APP_API_KEY || "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",
    dangerouslyAllowBrowser: true
});

export async function getGroqChatCompletion(prompt) {
    return groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
    });
  }
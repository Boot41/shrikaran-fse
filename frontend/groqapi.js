import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: "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",
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
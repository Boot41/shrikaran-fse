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
import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import cors from "cors";
import OpenAI from "openai";

const OPENAI_API_KEY = defineSecret("OPENAI_API_KEY");
const corsHandler = cors({ origin: true });

export const askOpenAI = onRequest(
  { region: "us-central1", secrets: [OPENAI_API_KEY] },
  (req, res) => {
    corsHandler(req, res, async () => {
      // ✅ important pour le navigateur (preflight CORS)
      if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
      }

      try {
        const prompt = req.body?.prompt;

        if (!prompt || typeof prompt !== "string") {
          res.status(400).json({ error: "Missing prompt" });
          return;
        }

        const client = new OpenAI({ apiKey: OPENAI_API_KEY.value() });

        const result = await client.responses.create({
          model: "gpt-4.1-mini",
          input: prompt,
        });

        res.json({ text: result.output_text });
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Server error";
        res.status(500).json({ error: msg });
      }
    });
  }
);

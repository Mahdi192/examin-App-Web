const FN_URL =
  "https://us-central1-examin-final.cloudfunctions.net/askOpenAI";

export async function askOpenAIText(prompt) {
  const r = await fetch(FN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = await r.json().catch(() => ({}));

  if (!r.ok) {
    throw new Error(data?.error || "OpenAI request failed");
  }

  return data.text || "";
}

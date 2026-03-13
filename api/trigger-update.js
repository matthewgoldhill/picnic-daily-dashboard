export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const pat = process.env.GITHUB_PAT;
  if (!pat) return res.status(500).json({ error: "GITHUB_PAT not configured" });

  const resp = await fetch(
    "https://api.github.com/repos/matthewgoldhill/picnic-daily-dashboard/actions/workflows/update-pipeline.yml/dispatches",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${pat}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "picnic-dashboard",
      },
      body: JSON.stringify({ ref: "main" }),
    }
  );

  if (resp.status === 204) return res.status(200).json({ ok: true });
  const text = await resp.text();
  return res.status(resp.status).json({ error: text });
}

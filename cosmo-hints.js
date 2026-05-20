/**
 * COSMO Hints — shared utility for AI hints across all pages.
 * Call getCosmoHint(contextString) from any page.
 * Returns hint text or null (if no worker URL or network error).
 */
async function getCosmoHint(context) {
  const workerUrl = localStorage.getItem('cosmo_worker_url');
  if (!workerUrl) return null;
  try {
    const response = await fetch(`${workerUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 150,
        system: 'You are COSMO, Cassian\'s AI tutor. Give one short, encouraging hint (2-3 sentences max). Be specific and smart.',
        messages: [{ role: 'user', content: context }]
      })
    });
    const data = await response.json();
    return data.content?.[0]?.text || null;
  } catch(e) { return null; }
}

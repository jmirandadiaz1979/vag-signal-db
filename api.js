// ============================================================
// Cloudflare Pages Function — /api
// Proxy para Claude API desde VAG Signal DB
// Mismo dominio que el HTML → sin CORS
// ============================================================

export async function onRequestPost(context) {
  try {
    const { apiKey, payload } = await context.request.json();

    if (!apiKey || !apiKey.startsWith('sk-ant-')) {
      return new Response(
        JSON.stringify({ error: { message: 'API key inválida' } }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: { message: err.message } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

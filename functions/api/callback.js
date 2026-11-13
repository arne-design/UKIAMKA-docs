export async function onRequest(context) {
  const { request, env } = context;
  const code = new URL(request.url).searchParams.get('code');

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const result = await response.json();

  if (result.error || !result.access_token) {
    return new Response(`GitHub OAuth feil: ${JSON.stringify(result)}`, { status: 400 });
  }

  const tokenData = JSON.stringify({
    token: result.access_token,
    provider: 'github',
  });

  const content = `
    <script>
      const receiveMessage = (message) => {
        window.opener.postMessage(
          'authorization:github:success:${tokenData}',
          message.origin
        );
        window.removeEventListener("message", receiveMessage, false);
      }
      window.addEventListener("message", receiveMessage, false);
      window.opener.postMessage("authorizing:github", "*");
    </script>
  `;

  return new Response(content, { headers: { 'Content-Type': 'text/html' } });
}

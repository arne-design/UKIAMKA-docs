export async function onRequest(context) {
  const { env } = context;
  const clientId = env.GITHUB_CLIENT_ID;
  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo`;
  return Response.redirect(url, 302);
}

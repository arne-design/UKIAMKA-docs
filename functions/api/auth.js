export async function onRequest(context) {
  const { env } = context;
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  url.searchParams.set('scope', 'repo,user');
  return Response.redirect(url.toString(), 302);
}

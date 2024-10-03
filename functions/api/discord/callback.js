export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response("No authorization code provided", { status: 400 });
  }

  const client_id = context.env.DISCORD_CLIENT_ID;
  const client_secret = context.env.DISCORD_CLIENT_SECRET;
  const redirect_uri = context.env.NEXT_PUBLIC_REDIRECT_URI;

  const body = new URLSearchParams({
    client_id,
    client_secret,
    grant_type: 'authorization_code',
    code,
    redirect_uri,
  });

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token } = tokenResponse.data;

    // Redirect to the frontend with the access token
    return Response.redirect(`https://form-builder.pages.dev/api/discord/user?access_token=${access_token}`);
  } catch (error) {
    return new Response(`Error fetching access token: ${error.message}`, { status: 500 });
  }
}

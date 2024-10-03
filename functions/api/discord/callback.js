export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response("No authorization code provided", { status: 400 });
  }

  const client_id = '807156860573974539';
  const client_secret = 'i4nLPL1rP15775yS2XsVMc8fhxnnVCP0'; //should be secret
  const redirect_uri = "https://form-builder.pages.dev/api/discord/callback";

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

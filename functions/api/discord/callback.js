export async function onRequest(context) { console.log('callback 1');
  const { request } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code'); console.log('callback 2');

  if (!code) {
    return new Response("No authorization code provided", { status: 400 });
  }console.log('callback 3');

  const client_id = '807156860573974539';
  const client_secret = 'i4nLPL1rP15775yS2XsVMc8fhxnnVCP0'; //should be secret
  const redirect_uri = "https://form-builder.pages.dev/api/discord/callback";console.log('callback 4');

  const body = new URLSearchParams({
    client_id,
    client_secret,
    grant_type: 'authorization_code',
    code,
    redirect_uri,
  });console.log('callback 5');

  try {
    // Exchange code for access token
    let tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });console.log('callback 6');

    console.log(tokenResponse.ok)
    console.log(tokenResponse.status)
    console.log(tokenResponse)
    console.log(await tokenResponse.json())
    tokenResponse = await tokenResponse.json()

    const { access_token } = tokenResponse;console.log('callback 7');

    // Redirect to the frontend with the access token
    console.log('callback 8');
    return Response.redirect(`https://form-builder.pages.dev/api/discord/user?access_token=${access_token}`);
  } catch (error) {
    return new Response(`Error fetching access token: ${error.message}`, { status: 500 });
  }
}

export async function onRequest({ request, env }) {
  console.log('callback 1');
  const url = new URL(request.url);
  const code = url.searchParams.get('code'); console.log('callback 2');

  if (!code) {
    return new Response("No authorization code provided", { status: 400 });
  } console.log('callback 3');

  const client_id = '942858850850205717';
  const client_secret = env.DISCORD_CLIENT_SECRET;
  const redirect_uri = "https://form-builder.pages.dev/api/discord/callback"; console.log('callback 4');

  const body = new URLSearchParams({
    client_id,
    client_secret,
    grant_type: 'authorization_code',
    code,
    redirect_uri,
  }); console.log('callback 5');

  try {
    // Exchange code for access token
    let tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }); console.log('callback 6');

    tokenResponse = await tokenResponse.json()

    const { access_token, expires_in } = tokenResponse; console.log('callback 7');

    // Redirect to the frontend with the access token
    console.log('callback 8');

    const sessionID = crypto.randomUUID()

    await env.SESSIONS.put(sessionID, JSON.stringify({ token: access_token }), { expirationTtl: expires_in })

    // Set the access token as a cookie
    const cookieHeader = `session=${sessionID}; Secure; Path=/; Max-Age=${expires_in}; SameSite=Lax`;

    // Redirect user to a protected page, setting the cookie in the response
    return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OAuth2 Callback</title>
  <script>
    window.onload = function () {
      if (window.opener) {
        window.opener.postMessage("authorized", "*");
        window.close();
      }
    };
  </script>
</head>
<body>
  <noscript>Authorization successful. You may close this window.</noscript>
</body>
</html>
`, {
      // status: 302,  // Redirect status
      status: 200,
      headers: {
        'Set-Cookie': cookieHeader,
        'Content-Type': 'text/html'
        // 'Location': 'https://form-builder.pages.dev',  // Redirect to a page after login
      },
    });

    //return Response.redirect(`https://form-builder.pages.dev/api/discord/user?access_token=${access_token}`);
  } catch (error) {
    return new Response(`Error fetching access token: ${error.message}`, { status: 500 });
  }
}

export async function onRequest(context) {console.log('user 1');
  const { request } = context;
  const url = new URL(request.url);
  const access_token = url.searchParams.get('access_token');console.log('user 2');

  if (!access_token) {
    return new Response("Access token not provided", { status: 400 });
  }console.log('user 3');

  try {
    // Fetch user details from Discord using the access token
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });console.log('user 4');

    const user = userResponse.data;console.log('user 5');
    
    // Return user data to frontend
    return new Response(JSON.stringify(user), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(`Error fetching user data: ${error.message}`, { status: 500 });
  }
}

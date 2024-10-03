export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const access_token = url.searchParams.get('access_token');

  if (!access_token) {
    return new Response("Access token not provided", { status: 400 });
  }

  try {
    // Fetch user details from Discord using the access token
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const user = userResponse.data;

    // Return user data to frontend
    return new Response(JSON.stringify(user), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(`Error fetching user data: ${error.message}`, { status: 500 });
  }
}

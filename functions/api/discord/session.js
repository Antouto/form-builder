export async function onRequest({ request, env }) {console.log('user 1');
  const url = new URL(request.url);
  const sessionID = request.headers.get('sessionID');console.log('user 2');

  if (!sessionID) {
    return new Response("Session ID not provided", { status: 400 });
  }console.log('user 3');

  const { token } = await env.SESSIONS.get(sessionID, 'json')

  try {
    // Fetch guild details from Discord using the access token
    let guildResponse = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });console.log('user 4');
    guildResponse = await guildResponse.json()

    guildResponse = guildResponse.filter(guild => (guild.permissions & 1 << 3) === 1 << 3)
    console.log('user 5');
    
    // Return user data to frontend
    return new Response(JSON.stringify(guildResponse), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(`Error fetching user data: ${error.message}`, { status: 500 });
  }
}

import { parse } from "cookie";

export async function onRequest({ request, env }) {
  console.log('cs', env.DISCORD_CLIENT_SECRET)
  console.log("user 1");
  const url = new URL(request.url);
  const cookie = parse(request.headers.get("Cookie") || "");
  const sessionID = cookie["session"];

  if (!sessionID) {
    return new Response("Session ID not provided", { status: 400 });
  }
  console.log("user 3");

  const { token } = await env.SESSIONS.get(sessionID, "json");

  try {
    // Fetch guild details from Discord using the access token
    let guildResponse = await fetch(
      "https://discord.com/api/users/@me/guilds",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("user 4");
    guildResponse = await guildResponse.json();

    guildResponse = guildResponse.filter(
      (guild) => (guild.permissions & (1 << 3)) === 1 << 3
    );
    console.log("user 5");

    const guild_id = url.searchParams.get("guild_id");
    const checkIfAdmin = url.searchParams.get("checkIfAdmin");

    if (guild_id && guildResponse.some((guild) => guild.id === guild_id)) {
      
      
      if(checkIfAdmin === 'true') {
        return new Response(`User is an admin in this server`, {
          status: 200,
        });
      }


      let specificGuildResponse = await fetch(
        `https://discord.com/api/guilds/${guild_id}/channels`,
        {
          // Specific Guild Channels
          headers: {
            Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
          },
        }
      );
      specificGuildResponse = await specificGuildResponse.json();

      //return specific guild to frontend
      return new Response(JSON.stringify(specificGuildResponse), {
        headers: { "Content-Type": "application/json" },
        status: specificGuildResponse.status,
      });
    }

    if(checkIfAdmin === 'true') return new Response('User is NOT an admin in this server', {
      status: 200,
    });

    // Return guild list to frontend
    return new Response(JSON.stringify(guildResponse), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(`Error fetching user data: ${error.message}`, {
      status: 500,
    });
  }
}

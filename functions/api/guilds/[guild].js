export function onRequest({ params }) {
  const guildId = params.guild
  
  let guildResponse;
  await (async () => {
    guildResponse = await ( await fetch(
      `https://create.discordforms.app/api/discord/session?guild_id=${guildId}&checkIfAdmin=true`
    )
  ).text();
  })()

  return new Response(guildResponse)
}
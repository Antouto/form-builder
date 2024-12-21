import { env } from "process";

export const AVATAR_URL =
  "https://cdn.discordapp.com/avatars/942858850850205717/a_437f281f490a388866b7be0b3cd7cc33.gif?size=4096";

export const DEFAULT_API_URI = "https://create.discordforms.app";
export const API_URI = DEFAULT_API_URI;
// process.env?.NEXT_PUBLIC_API_URL == null
//   ? DEFAULT_API_URI
//   : process.env.NEXT_PUBLIC_API_URL;

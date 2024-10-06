export async function onRequest(context) {
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
    headers: {
      'Content-Type': 'text/html'
    },
    status: 200
  });
}

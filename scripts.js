const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const open = require('open');

const app = express();
const port = 3000;

// Replace these with your actual values
const clientId = '4cb55a19f1f2454a92186d51c11fb5e1';
const clientSecret = 'c59da673e670454a90aa428ad80e4f91';
const redirectUri = 'http://localhost:3000/callback'; // Make sure this matches your Spotify app settings
// list of scopes: https://developer.spotify.com/documentation/general/guides/scopes/
// Define the scope variable with all the required scopes
const scope = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'app-remote-control',
    'streaming',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-private',
    'playlist-modify-public',
    'user-follow-modify',
    'user-follow-read',
    'user-read-playback-position',
    'user-top-read',
    'user-read-recently-played',
    'user-library-modify',
    'user-library-read',
    'user-read-email',
    'user-read-private'
  ].join(' ');
app.get('/login', (req, res) => {
  const authorizeUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  res.redirect(authorizeUrl);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code || null;
  if (!code) {
    res.send('Error: No code provided');
    return;
  }

  try {
    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const refreshToken = tokenResponse.data.refresh_token;
    res.send(`Refresh Token: ${refreshToken}`);
  } catch (error) {
    res.send(`Error: ${error.response.data.error_description}`);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  open(`http://localhost:${port}/login`); // Automatically open the login URL in the default browser
});

const stateKey = 'spotify_auth_state';
const token = new URLSearchParams(
  window.location.hash.substring(1)
).get("access_token");


const limit = 50;
const unfollowLim = 50;

let artistIDs = [];

getProfile(token);

function getContent(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  }
}

async function getProfile(token) {
  if (!token)
    return;
  const url = new URL("https://api.spotify.com/v1/me/following");
  url.searchParams.set("type", "artist");
  url.searchParams.set("limit", limit);
  artistIDs = []

  let resp;
  let json;
  do {
    resp = await fetch(url, getContent(token));
    if (!resp.ok) {
      throw await resp.text();
    }
    json = await resp.json();


    for (let artist of json.artists.items) {
      artistIDs.push(artist.id);
    }
    if (json.artists.items.length > 0) {
      url.searchParams.set("after", artistIDs.at(-1));
    }
  } while (json.artists.items.length == limit)

  document.getElementById("unfollow-text").innerHTML = `You follow ${artistIDs.length} artists<br><br>`;
  document.getElementById("unfollow").removeAttribute("disabled");
}


document.getElementById("login").addEventListener('click', async event => {
  const client_id = 'b63f8b2b00f3445a835b5f79a0a5ca7e'; // Client ID is not a secret
  const temp_url = new URL(window.location.href);
  const redirect_uri = temp_url.origin + temp_url.pathname;
  const scope = 'user-follow-modify';

  const state = generateRandomString(16);
  localStorage.setItem(stateKey, state);


  let url = new URL('https://accounts.spotify.com/authorize');
  url.searchParams.append("response_type", "token");
  url.searchParams.append("client_id", encodeURIComponent(client_id));
  url.searchParams.append("redirect_uri", redirect_uri);
  url.searchParams.append("scope", encodeURIComponent(scope));
  url.searchParams.append("state", encodeURIComponent(state));
  window.location = url;
})

async function UnfollowEveryone() {
  const url = new URL("https://api.spotify.com/v1/me/following");
  url.searchParams.set("type", "artist");
  let content = getContent(token);
  content['method'] = 'DELETE';

  while (artistIDs.length > 0) {
    url.searchParams.set("ids", artistIDs.splice(0, unfollowLim).join(','));
    let resp = await fetch(url, content);
    if (!resp.ok) {
      throw await resp.text();
    }
  }
  document.getElementById("content").innerText = "You unfollowed all the artists!";
}

document.getElementById("unfollow").addEventListener('click', async event => {
  await UnfollowEveryone().catch(error => {
    console.log(error);
    document.getElementById("content").innerText = "Problem encountered, try authenticating again.";
  })
  document.getElementById("")
})

function generateRandomString(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
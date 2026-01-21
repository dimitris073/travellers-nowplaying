import fetch from "node-fetch";

export default async function handler(req, res) {
 const STREAM_URL = "http://s41.myradiostream.com/7.html";

  try {
    const response = await fetch(STREAM_URL, { timeout: 5000 });
    const text = await response.text();

    const parts = text.split(",");
    const raw = parts[6] || "";

    let artist = "";
    let title = "";

    if (raw.includes(" - ")) {
      const split = raw.split(" - ");
      artist = split[0].trim();
      title = split[1].trim();
    }

    if (!artist || !title) {
      return res.status(200).json({
        status: "offline",
        artist: "",
        title: "",
        cover: "",
        listeners: 0
      });
    }

    const cover = await lookupCover(artist, title);

    return res.status(200).json({
      status: "online",
      artist,
      title,
      cover,
      listeners: parseInt(parts[4] || "0", 10)
    });

  } catch (err) {
    return res.status(200).json({
      status: "offline",
      artist: "",
      title: "",
      cover: "",
      listeners: 0
    });
  }
}

async function lookupCover(artist, title) {
  try {
    const q = encodeURIComponent(`${artist} ${title}`);
    const url = `https://itunes.apple.com/search?term=${q}&limit=1`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      return data.results[0].artworkUrl100.replace("100x100", "300x300");
    }
  } catch (e) {}

  return "";
}

import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const html = await fetch("http://s41.myradiostream.com:30014/index.html").then(r => r.text());

    const bitrate = html.match(/Stream is up at (\d+) kbps/)?.[1] || "0";
    const listeners = html.match(/with (\d+) of/)?.[1] || "0";

    res.status(200).json({
      status: "online",
      bitrate,
      listeners
    });

  } catch (e) {
    res.status(200).json({
      status: "offline",
      bitrate: 0,
      listeners: 0
    });
  }
}

import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const html = await fetch("http://s41.myradiostream.com:30014/played.html").then(r => r.text());

    const rows = [...html.matchAll(/<tr><td>(.*?)<\/td><td>(.*?)<\/td><\/tr>/g)]
      .map(m => ({
        time: m[1],
        track: m[2]
      }));

    res.status(200).json(rows);

  } catch (e) {
    res.status(200).json([]);
  }
}

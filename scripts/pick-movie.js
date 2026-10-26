const fs = require("fs");
const crypto = require("crypto");

const FILE = "movies.json";
const WATCHED = "watched.json";
const remove = process.env.REMOVE_PICKED === "true";

const data = JSON.parse(fs.readFileSync(FILE, "utf8"));
const list = (Array.isArray(data) ? data : data.movies || [])
  .map((m) => (typeof m === "string" ? { title: m } : m))
  .filter((m) => m && m.title);

if (!list.length) {
  console.error("movies.json has no movies with a title.");
  process.exit(1);
}

const pick = list[crypto.randomInt(list.length)];
const meta = [pick.year, pick.genre].filter(Boolean).join(" | ");

// Job summary shown on the workflow run page
const summary = [
  "# 🎃 Tonight’s movie",
  "",
  `## ${pick.title}`,
  meta ? `**${meta}**` : "",
  pick.note ? `> ${pick.note}` : "",
  "",
  `Picked from ${list.length} titles.`,
].filter((l) => l !== "").join("\n\n");
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary + "\n");

// Outputs for later steps
if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `title=${pick.title}\n`);
}
console.log(`PICKED: ${pick.title}${meta ? " (" + meta + ")" : ""}`);

// Optionally move the pick from the wheel to the watched list
if (remove) {
  const rest = list.filter((m) => m !== pick);
  if (Array.isArray(data)) fs.writeFileSync(FILE, JSON.stringify(rest, null, 2) + "\n");
  else fs.writeFileSync(FILE, JSON.stringify({ ...data, movies: rest }, null, 2) + "\n");

  const watched = fs.existsSync(WATCHED) ? JSON.parse(fs.readFileSync(WATCHED, "utf8")) : [];
  watched.push({ ...pick, picked_at: new Date().toISOString() });
  fs.writeFileSync(WATCHED, JSON.stringify(watched, null, 2) + "\n");
}

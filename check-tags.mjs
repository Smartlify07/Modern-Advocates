import fs from "fs"
const content = fs.readFileSync(
  "src/features/marketing/components/mission-sections.tsx",
  "utf-8"
)
const mbs = content.split("export function FounderStorySection")[0]

function count(tag, openRe, closeRe) {
  const opens = (mbs.match(openRe) || []).length
  const closes = (mbs.match(closeRe) || []).length
  console.log(`${tag}: ${opens} opens, ${closes} closes${opens !== closes ? " ***MISMATCH***" : ""}`)
}

count("section", /<section/g, /<\/section>/g)
count("div", /<div[\s>]/g, /<\/div>/g)
count("p", /<p[\s>]/g, /<\/p>/g)
count("h2", /<h2[\s>]/g, /<\/h2>/g)
count("h3", /<h3[\s>]/g, /<\/h3>/g)
count("Image", /<Image[\s/>]/g, /<\/Image>/g)
count("Gift", /<Gift[\s/>]/g, /<\/Gift>/g)

// Show lines with &nbsp;
const lines = content.split("\n")
lines.forEach((line, i) => {
  if (line.includes("&nbsp")) console.log(`Line ${i + 1}: has &nbsp`)
})

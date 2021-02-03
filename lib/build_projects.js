// Builds the individual project pages from Markdown files in code/html/projects

/* eslint-disable no-console */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const template = require("lodash.template");
const marked = require("marked");
const { buildTiles } = require("./build_tiles.js");

const TEMPLATE_PATH = path.join("lib", "templates", "project.html.template");
const PROJECTS_PATH = path.join("code", "html", "projects");
const projectTemplate = template(fs.readFileSync(TEMPLATE_PATH).toString());

const addClasses = html => {
  return html.replace(/\<p\>/g, '<p class="mt-4">').replace(/\<a /g, '<a class="underline" ');
};

const parse = filename => {
  const markdown = fs.readFileSync(path.join(PROJECTS_PATH,filename)).toString();
  const lines = markdown.split("\n")
  let form = null

  if (lines[0].match(/# form/)) {
    form = markdown.match(/# form: ?(.*)/)[1]
    lines.shift()
    lines.shift()
  }

  return { html: marked(lines.join("\n")),form }
};

const writeFile = (filename, html) => {
  const outputFilename = filename
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/md$/, "html");
  const outputPath = path.join(PROJECTS_PATH, outputFilename);
  fs.writeFileSync(outputPath, html);
  console.info(`Wrote file ${outputPath}`);
};

const templateize = ({ filename, tiles, ...rest }) => {
  const name = filename.replace(/_/," ").replace(/\.md$/,"");
  const year = (new Date()).getFullYear()
  const filteredTiles = tiles.filter(tile => {
    return tile.match(new RegExp(`data-categories="[^"]*?${name}.*?"`)) && tile.match(new RegExp(`data-years="[^"]*?${year}.*?"`))
  })

  return projectTemplate({ filename, name, tiles: filteredTiles.slice(0,3).join("\n"), ...rest });
};

const main = async () => {
  const filenames = fs.readdirSync(PROJECTS_PATH)
  const { tiles } = await buildTiles()

  for (let i = 0; i < filenames.length; i++)  {
    const filename = filenames[i]

    if (filename.match(/md$/)) {
      console.info(`Found ${filename} markdown`);
      console.group();
      const { html,form } = parse(filename)
      const output = templateize({
        filename,html: addClasses(html),form,tiles: tiles });
      writeFile(filename, output);
      console.groupEnd();
    }
  };
};

module.exports = main;

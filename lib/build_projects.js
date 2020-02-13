// Builds the individual project pages from Markdown files in code/html/projects

/* eslint-disable no-console */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const template = require("lodash.template");
const marked = require("marked");

const OUTPUT_PATH = path.join("code", "html", "projects");
const TEMPLATE_PATH = path.join("code", "html", "projects", "_projects.html.template");
const PROJECTS_PATH = path.join("code", "html", "projects");
const projectTemplate = template(fs.readFileSync(TEMPLATE_PATH).toString());

const addClasses = html => {
  return html.replace(/\<p\>/g, '<p class="mt-4">').replace(/\<a /g, '<a class="underline" ');
};

const parse = filename => {
  const markdown = fs.readFileSync(path.join(PROJECTS_PATH, filename)).toString();
  return marked(markdown);
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

const templateize = (filename, html) => {
  const name = filename.replace(/_/, " ").replace(/\.md$/, "");
  return projectTemplate({ name, html });
};

const main = async () => {
  fs.readdirSync(PROJECTS_PATH).forEach(filename => {
    if (filename.match(/md$/)) {
      console.info(`Found ${filename} markdown`);
      console.group();
      const html = templateize(filename, addClasses(parse(filename)));
      writeFile(filename, html);
      console.groupEnd();
    }
  });
};

module.exports = main;

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
const PREVIEW_PROJECTS_COUNT = 2

const addClasses = (html) => {
  return html
    .replace(/\<p\>/g, '<p class="mt-4">')
    .replace(/\<a /g, '<a class="underline" ')
}

const parse = (filename) => {
  const markdown = fs
    .readFileSync(path.join(PROJECTS_PATH, filename))
    .toString()
  const lines = markdown.split('\n')
  let form = null

  if (lines[0].match(/# form/)) {
    form = markdown.match(/# form: ?(.*)/)[1]
    lines.shift()
    lines.shift()
  }

  return { html: marked(lines.join('\n')), form }
}

const writeFile = (filename, html) => {
  const outputFilename = filename
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/md$/, 'html')
  const outputPath = path.join(PROJECTS_PATH, outputFilename)
  fs.writeFileSync(outputPath, html)
  console.info(`Wrote file ${outputPath}`)
}

const pickTiles = (tiles, category, year) => {
  console.info(`picking ${year}`)

  // sort by latest
  const sorted = tiles.sort((a, b) => {
    const aDate = new Date(a.match(`data-created="(.*?)"`)[1])
    const bDate = new Date(b.match(`data-created="(.*?)"`)[1])

    if (aDate < bDate) {
      return 1
    } else if (aDate > bDate) {
      return -1
    } else {
      return 0
    }
  })

  // filter out only those for the given category and year
  return sorted.filter((tile) => {
    return (
      tile.match(new RegExp(`data-categories="[^"]*?${category}.*?"`)) &&
      tile.match(new RegExp(`data-years="[^"]*?${year}.*?"`))
    )
  })
}

const templateize = ({ filename, tiles, ...rest }) => {
  const name = filename.replace(/_/, ' ').replace(/\.md$/, '')
  const year = new Date().getFullYear()
  let filteredTiles = pickTiles(tiles, name, year)

  // if we don't have 3 preview tiles, go back a year and get more
  if (filteredTiles.length < PREVIEW_PROJECTS_COUNT) {
    filteredTiles.push(...pickTiles(tiles, name, year - 1))
  }

  // make sure tiles are unique
  filteredTiles = [...new Set(filteredTiles)]

  return projectTemplate({
    filename,
    name,
    tiles: filteredTiles.slice(0, PREVIEW_PROJECTS_COUNT).join('\n'),
    ...rest,
  })
}

const main = async () => {
  const filenames = fs.readdirSync(PROJECTS_PATH)
  const { tiles } = await buildTiles({ width: 2 })

  for (let i = 0; i < filenames.length; i++) {
    const filename = filenames[i]

    if (filename.match(/md$/)) {
      console.info(`Found ${filename} markdown`)
      console.group()
      const { html, form } = parse(filename)
      const output = templateize({
        filename,
        form,
        tiles,
        html: addClasses(html),
      })
      writeFile(filename, output)
      console.groupEnd()
    }
  }
}

module.exports = main;

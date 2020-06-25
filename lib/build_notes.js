// Builds the All Projects page as a static file in /publish

/* eslint-disable no-console */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const template = require("lodash.template");
const marked = require("marked");
const { paramCase } = require("param-case");

const INDEX_OUTPUT_FILE = path.join("code", "html", "notes.html");
const NOTE_OUTPUT_PATH = path.join("code", "html", "notes");
const INDEX_TEMPLATE_PATH = path.join("lib", "templates", "notes.html.template");
const NOTE_TEMPLATE_PATH = path.join("lib","templates","note.html.template");
const NOTES_INPUT_PATH = path.join("notes")

const indexTemplate = template(fs.readFileSync(INDEX_TEMPLATE_PATH).toString());
const noteTemplate = template(fs.readFileSync(NOTE_TEMPLATE_PATH).toString());

const getNotes = () => {
  return fs.readdirSync(NOTES_INPUT_PATH).map(file => {
    return parseNote(fs.readFileSync(path.join(NOTES_INPUT_PATH, file)).toString())
  })
}

const parseNote = (text) => {
  let noteObject = { content: [] }

  console.info(paramCase)
  marked.lexer(text).forEach(token => {
    if (token.type === 'heading') {
      if (token.depth === 1) {
        noteObject.title = token.text
        noteObject.link = paramCase(noteObject.title) + '.html'
      } else if (token.depth === 2) {
        noteObject.date = token.text
      } else if (token.depth === 3) {
        noteObject.author = token.text
        noteObject.authorImage = noteObject.author.split(' ')[0].toLowerCase() + '.jpg'
      }
    } else {
      noteObject.content.push(token)
    }
  })
  noteObject.content['links'] = {}
  noteObject.content = marked.parser(noteObject.content)

  return noteObject
}

const sortNotes = (notes) => {
  return notes
}

const main = async () => {
  const notes = sortNotes(getNotes())

  // write out individual notes
  notes.forEach(note => {
    if (note.link) {
      console.info(note)
      const output = noteTemplate(note)
      const outputPath = path.join(NOTE_OUTPUT_PATH,note.link)

      fs.writeFileSync(outputPath,output);
      console.info(`\nWrote ${outputPath}`);
    }
  })

  // write out index file

};

module.exports = main;

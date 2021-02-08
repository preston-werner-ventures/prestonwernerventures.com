// Builds the All Projects page as a static file in /publish

/* eslint-disable no-console */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const template = require("lodash.template");
const marked = require("marked");
const { paramCase } = require("param-case");

const NOTES_OUTPUT_FILE = path.join("code", "html", "learning", "notes.html");
const NOTE_OUTPUT_PATH = path.join("code", "html", "learning", "notes");
const NOTES_TEMPLATE_PATH = path.join("lib", "templates", "notes.html.template");
const NOTE_TEMPLATE_PATH = path.join("lib","templates","note.html.template");
const NOTES_INPUT_PATH = path.join("notes")

const notesTemplate = template(fs.readFileSync(NOTES_TEMPLATE_PATH).toString());
const noteTemplate = template(fs.readFileSync(NOTE_TEMPLATE_PATH).toString());

const getNotes = () => {
  return fs.readdirSync(NOTES_INPUT_PATH).map(file => {
    return parseNote(fs.readFileSync(path.join(NOTES_INPUT_PATH, file)).toString())
  })
}

const parseNote = (text) => {
  let noteObject = { content: [], summary: [] }

  marked.lexer(text).forEach(token => {
    if (token.type === 'heading' && token.depth === 1) {
      noteObject.title = token.text
      noteObject.link = paramCase(noteObject.title) + '.html'
    } else if (token.type === 'heading' && token.depth === 2) {
      noteObject.date = token.text
    } else if (token.type === 'heading' && token.depth === 3) {
      noteObject.author = token.text
      noteObject.authorImage = noteObject.author.split(' ')[0].toLowerCase() + '.jpg'
    } else {
      noteObject.content.push(token)
      if (noteObject.summary.length !== 1) {
        noteObject.summary.push(token)
      }
    }
  })

  // required for the marked parser
  noteObject.content['links'] = {}
  noteObject.summary['links'] = {}

  noteObject.content = marked.parser(noteObject.content)
  noteObject.summary = marked.parser(noteObject.summary)

  return noteObject
}

const sortNotes = (notes) => {
  return notes.sort((a, b) => {
    const aDate = new Date(a.date)
    const bDate = new Date(b.date)

    if (aDate > bDate) {
      return -1
    } else if (aDate < bDate) {
      return 1
    } else {
      return 0
    }
  })
}

const main = async () => {
  const notes = sortNotes(getNotes())

  // write out individual notes
  notes.forEach(note => {
    if (note.link) {
      const output = noteTemplate(note)
      const outputPath = path.join(NOTE_OUTPUT_PATH,note.link)

      fs.writeFileSync(outputPath,output);
      console.info(`Wrote ${outputPath}`);
    }
  })

  // write out index file
  const notesIndex = notesTemplate({ notes })

  fs.writeFileSync(NOTES_OUTPUT_FILE, notesIndex);
  console.info(`Wrote ${NOTES_OUTPUT_FILE}`);
};

module.exports = main;

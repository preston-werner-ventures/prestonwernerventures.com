// Builds the "What We're Reading" page based on Airtable data

/* eslint-disable no-console */
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const template = require("lodash.template");
const Airtable = require("airtable");
var base = new Airtable({ apiKey: process.env["AIRTABLE_API_KEY"] }).base(
  process.env["AIRTABLE_READINGS_BASE_ID"]
);

const TITLE = "Title";
const DATE = "Date";
const RECOMMENDER = "Recommender";
const LINK = "Link";
const IMAGE = "Image";

const AIRTABLE_FIELDS = [TITLE, DATE, RECOMMENDER, LINK, IMAGE];
const AIRTABLE_SORT = [{ field: DATE, direction: "desc" }];
const FIELD_MAP = {
  title: TITLE,
  date: DATE,
  recommender: RECOMMENDER,
  link: LINK,
  image: IMAGE
};

const OUTPUT_PATH = path.join("code", "html", "learning", "reading.html");
const TEMPLATE_PATH = path.join("lib", "templates", "reading.html.template");
const readingTemplate = template(fs.readFileSync(TEMPLATE_PATH).toString());

const books = []

const isValidRecord = record => {
  return (
    record.get(TITLE) &&
    record.get(RECOMMENDER) &&
    record.get(DATE) &&
    record.get(LINK)
  );
};

const getBooks = () => {
  return new Promise((resolve, reject) => {
    base("Readings")
      .select({ view: "Grid view", fields: AIRTABLE_FIELDS, sort: AIRTABLE_SORT })
      .eachPage(
        (records, fetchNextPage) => {
          records.forEach(function(record) {
            if (isValidRecord(record)) {
              const obj = {};
              Object.keys(FIELD_MAP).forEach(field => {
                const data = record.get(FIELD_MAP[field]);
                obj[field] = data || null;
              });
              if (obj.image) {
                obj.image = `<img class="w-full" src="${obj.image}" alt="${obj.title}">`
              } else {
                obj.image = `<div class="flex items-center min-h-4 bg-gray-200 rounded"><span class="my-4 p-2 font-medium">${obj.title}</span></div>`
              }
              books.push(obj);
            }
          });

          fetchNextPage();
        },
        err => {
          if (err) {
            reject(err);
          } else {
            resolve(books);
          }
        }
      );
  });
};

const main = async () => {
  let books = [];

  try {
    books = await getBooks();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.info(`Building tiles for ${books.length} books...\n`);
  console.group();
  const output = readingTemplate({ books });
  console.groupEnd();

  fs.writeFileSync(OUTPUT_PATH, output);
  console.info(`\nWrote ${OUTPUT_PATH}. Done.`);
};

module.exports = main;

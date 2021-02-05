// Builds the All Projects page as a static file in /publish

/* eslint-disable no-console */
require("dotenv").config();
const buildNotes = require("./build_notes");
const buildReading = require("./build_reading");
const buildProjects = require("./build_projects");
const buildProjectSearch = require("./build_project_search");

const main = async () => {
  console.info("\n--------------------");
  console.info("  Building Notes Pages");
  console.info("----------------------\n");
  buildNotes();

  console.info("\n------------------------------");
  console.info("  Building Learning/Reading Page");
  console.info("--------------------------------\n");
  buildReading();

  console.info("\n----------------------");
  console.info("  Building Project Pages");
  console.info("------------------------\n");
  await buildProjects();

  console.info("\n-----------------------");
  console.info("  Building Project Search");
  console.info("-------------------------\n");
  buildProjectSearch();
}

main()

// Builds the All Projects page as a static file in /publish

/* eslint-disable no-console */
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const template = require("lodash.template");

const { buildTiles } = require("./build_tiles.js")
const CATEGORY_PROPS = require("./categories.js");

const OUTPUT_PATH = path.join("code", "html", "projects", "all.html");
const PROJECT_TEMPLATE_PATH = path.join("lib", "templates", "projects.html.template");
const LEGEND_TEMPLATE_PATH = path.join("lib", "templates", "legend.html.template");

const projectTemplate = template(fs.readFileSync(PROJECT_TEMPLATE_PATH).toString());
const legendTemplate = template(fs.readFileSync(LEGEND_TEMPLATE_PATH).toString());

// turns an array of strings into HTML <option> tags
const stringsToOptionTags = (strings, options = {}) => {
  const prefix = options.prefix || "";

  return [strings]
    .flat()
    .map(value => `<option value="${value}">${prefix}${value}</option>`)
    .join("\n");
};

// returns <option> tags for every org category
const categoryOptions = _orgs => {
  const options = [];

  for (group in CATEGORY_PROPS) {
    let props = CATEGORY_PROPS[group];

    // add to an array of arrays where the first element is a parent if available
    if (props.parent) {
      const groupIndex = options.findIndex(opts => opts[0] === props.parent);

      if (groupIndex !== -1) {
        // add to an existing group
        options[groupIndex][1].push(props.name);
      } else {
        // create a new group
        options.push([props.parent, [props.name]]);
      }
    } else {
      // top level, no group
      options.push([null, [props.name]]);
    }
  }
  console.info(`Creating category filter with ${options.length} keys`);

  let output = "";
  options.forEach(option => {
    if (option[0]) {
      // build indented group
      if (!output.match(option[0])) {
        output += stringsToOptionTags(option[0]);
      }
      output += stringsToOptionTags(option[1], { prefix: "&nbsp;&nbsp;&nbsp;&nbsp;" });
    } else {
      // regular list of options
      output += stringsToOptionTags(option[1]);
    }
  });

  return output;
};

// returns <option> tags for every year that orgs have listed
const yearOptions = orgs => {
  const years = [];

  // loop through all years for all orgs and collect
  orgs.forEach(org => {
    org.years.forEach(year => {
      if (years.indexOf(year) === -1) {
        years.push(year);
      }
    });
  });
  console.info(`Creating years filter with ${years.length} keys`);

  return years
    .sort()
    .reverse()
    .map(year => {
      return `<option value="${year}">${year}</option>`;
    })
    .join("\n");
};

// returns <option> tags for every country an org has been in
const locationOptions = orgs => {
  const locations = [];

  // loop through all locations for all orgs and collect
  orgs.forEach(org => {
    org.locations.forEach(location => {
      if (locations.indexOf(location) === -1) {
        locations.push(location);
      }
    });
  });
  console.info(`Creating locations filter with ${locations.length} keys`);

  return locations
    .sort()
    .map(location => {
      return `<option value="${location}">${location}</option>`;
    })
    .join("\n");
};

const buildLegend = _orgs => {
  const legends = [];

  for (group in CATEGORY_PROPS) {
    const props = CATEGORY_PROPS[group];

    legends.push(
      legendTemplate({
        symbol: props.symbol,
        name: props.abbreviation || props.name
      })
    );
  }
  console.info(`Creating legend with ${legends.length} keys`);

  return legends.join("\n");
};

const main = async () => {
  const { orgsData, tiles } = await buildTiles()

  console.info(`Building tiles for ${orgsData.length} orgs...\n`);
  console.group();

  // output final HTML page based on all other interpolated values and templates
  const output = projectTemplate({
    categoryOptions: categoryOptions(orgsData),
    yearOptions: yearOptions(orgsData),
    locationOptions: locationOptions(orgsData),
    legend: buildLegend(orgsData),
    tiles: tiles.join("\n")
  });
  console.groupEnd();

  fs.writeFileSync(OUTPUT_PATH, output);
  console.info(`\nWrote ${OUTPUT_PATH}. Done.`);
};

module.exports = main;

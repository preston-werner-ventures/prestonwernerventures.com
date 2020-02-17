// Builds the All Projects page as a static file in /publish

/* eslint-disable no-console */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const template = require("lodash.template");

const getOrgs = require("./get_orgs.js");
const {
  placeholders: PLACEHOLDER_PHOTOS,
  fallback: FALLBACK_PHOTO
} = require("./placeholder_photos.js");
const CATEGORY_PROPS = require("./categories.js");

const OUTPUT_PATH = path.join("code", "html", "projects", "all.html");
const TILE_TEMPLATE_PATH = path.join("lib", "templates", "tile.html.template");
const PROJECT_TEMPLATE_PATH = path.join("lib", "templates", "projects.html.template");
const LEGEND_TEMPLATE_PATH = path.join("lib", "templates", "legend.html.template");

const tileTemplate = template(fs.readFileSync(TILE_TEMPLATE_PATH).toString());
const projectTemplate = template(fs.readFileSync(PROJECT_TEMPLATE_PATH).toString());
const legendTemplate = template(fs.readFileSync(LEGEND_TEMPLATE_PATH).toString());

// takes a filestack URL and added modifiers
const resizedImage = (url, size) => {
  let src = url.split("/");
  src.splice(3, 0, `cache=expiry:max/resize=width:${size}/compress`);
  src.shift();
  src.shift();

  return `https://${src.join("/")}`;
};

// turn the `years` property into a range instead of individual years
const orgYears = years => {
  let output = Math.min(...years);
  if (years.length > 1) {
    output = `${Math.min(...years)} - ${Math.max(...years)}`;
  }
  return output;
};

// get names/symbols for categories this org is in
const orgSymbols = categories => {
  const output = categories.map(cat => {
    const props = CATEGORY_PROPS[cat];

    if (props) {
      return {
        symbol: props.symbol,
        name: props.name
      };
    } else {
      throw `Cannot find CATEGORY_PROPS entry for "${cat}"`;
    }
  });

  return output;
};

const orgCategories = categories => {
  const names = [];

  categories.forEach(category => {
    const props = CATEGORY_PROPS[category];

    // push this category's name
    names.push(props.name);

    // if the category has a parent and it's not already in the list, add that too
    if (props.parent && names.indexOf(props.parent) === -1) {
      names.push(props.parent);
    }
  });

  return names;
};

// if org has no photo, pull one at random from their country
const orgPhoto = (photo, country) => {
  if (photo !== null) {
    return resizedImage(photo, 512);
  }

  const placeholderPhotos = PLACEHOLDER_PHOTOS[country];
  if (placeholderPhotos && placeholderPhotos.length) {
    return resizedImage(placeholderPhotos.shift(), 512);
  } else {
    return resizedImage(FALLBACK_PHOTO, 512);
  }
};

// returns the logo for the org
const orgLogo = logo => {
  if (logo) {
    return resizedImage(logo, 512);
  } else {
    return null;
  }
};

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

// generate a tile from a template based on DB and computed data
const buildTiles = orgs => {
  errors = [];
  const tiles = orgs
    .map(org => {
      console.info(`+ ${org.name}`);

      try {
        let props = Object.assign(org, {
          categories: orgCategories(org.categories),
          categorySymbols: orgSymbols(org.categories),
          years: org.years,
          yearsString: orgYears(org.years),
          logo: orgLogo(org.logo),
          photo: orgPhoto(org.photo, org.locations[0])
        });

        return tileTemplate(props);
      } catch (e) {
        console.error(`  Skipping: ${e}`);
        errors.push(e);
      }
    })
    .join("\n");

  if (errors.length) {
    console.error("\n ----- MISSING CATEGORIES -----");
    console.error(errors);
    console.error("--------------------------------");
  }

  return tiles;
};

const main = async () => {
  let orgsData = [];

  try {
    orgsData = await getOrgs();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.info(`Building tiles for ${orgsData.length} orgs...\n`);
  console.group();

  // output final HTML page based on all other interpolated values and templates
  const output = projectTemplate({
    categoryOptions: categoryOptions(orgsData),
    yearOptions: yearOptions(orgsData),
    locationOptions: locationOptions(orgsData),
    legend: buildLegend(orgsData),
    tiles: buildTiles(orgsData)
  });
  console.groupEnd();

  fs.writeFileSync(OUTPUT_PATH, output);
  console.info(`\nWrote ${OUTPUT_PATH}. Done.`);
};

module.exports = main;

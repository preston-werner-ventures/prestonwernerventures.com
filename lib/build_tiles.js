const fs = require("fs");
const path = require("path");
const template = require("lodash.template");

const { getOrgs } = require('./get_orgs.js')
const {
  placeholders: PLACEHOLDER_PHOTOS,
  fallback: FALLBACK_PHOTO
} = require("./placeholder_photos.js");
const CATEGORY_PROPS = require("./categories.js");
const TILE_TEMPLATE_PATH = path.join("lib", "templates", "tile.html.template");
const tileTemplate = template(fs.readFileSync(TILE_TEMPLATE_PATH).toString());

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
      throw `orgSymbols(): Cannot find CATEGORY_PROPS entry for "${cat}"`
    }
  });

  return output;
};

const orgCategories = categories => {
  const names = [];

  categories.forEach(category => {
    const props = CATEGORY_PROPS[category];

    if (props) {
      // push this category's name
      names.push(props.name);

      // if the category has a parent and it's not already in the list, add that too
      if (props.parent && names.indexOf(props.parent) === -1) {
        names.push(props.parent);
      }
    } else {
      console.error(`orgCategories(): ! No category definition for ${category}`)
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


// generate a tile from a template based on DB and computed data
const buildTiles = async ({ width } = { width: 3 }) => {
  let orgsData = []

  try {
    orgsData = await getOrgs()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }

  errors = []
  const tiles = orgsData.map((org) => {
    try {
      let props = Object.assign(org, {
        categories: orgCategories(org.rawCategories),
        categorySymbols: orgSymbols(org.rawCategories),
        years: org.years,
        yearsString: orgYears(org.years),
        logo: orgLogo(org.logo),
        photo: orgPhoto(org.photo, org.locations[0]),
        created: org.created,
        width,
      })

      return tileTemplate(props)
    } catch (e) {
      console.error(`  Skipping: ${org.name}: ${e}`)
      errors.push(e)
    }
  })

  if (errors.length) {
    console.error('\n ----- MISSING CATEGORIES -----')
    console.error(errors)
    console.error('--------------------------------')
  }

  return { orgsData, tiles }
}

module.exports = { buildTiles }

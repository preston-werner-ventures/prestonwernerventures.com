require("dotenv").config();

const Airtable = require("airtable");
var base = new Airtable({ apiKey: process.env["AIRTABLE_API_KEY"] }).base(
  process.env["AIRTABLE_BASE_ID"]
);

const NAME = "Organization";
const VISIBLE = "Show on Website?";
const CATEGORIES = "Buckets";
const URL = "Website";
const LOCATIONS = "Location (of Project)";
const YEARS = "Funding Quarters";
const LOGO = "Logo";
const PHOTO = "Photo";

const AIRTABLE_FIELDS = [NAME, VISIBLE, CATEGORIES, URL, LOCATIONS, YEARS, LOGO, PHOTO];
const AIRTABLE_SORT = [{ field: NAME, direction: "asc" }];
const FIELD_MAP = {
  name: NAME,
  visible: VISIBLE,
  categories: CATEGORIES,
  url: URL,
  locations: LOCATIONS,
  years: YEARS,
  logo: LOGO,
  photo: PHOTO
};
const YEAR_REGEX = new RegExp(/20\d{2}/g);

const orgs = [];

const isValidRecord = record => {
  return (
    record.get(VISIBLE) &&
    record.get(CATEGORIES) &&
    record.get(CATEGORIES).length > 0 &&
    record.get(YEARS) &&
    record.get(YEARS).match(YEAR_REGEX)
  );
};

const unique = (value, index, self) => {
  return self.indexOf(value) === index;
};

const formatYears = text => {
  // text is blank
  if (!text) {
    console.info("  !text");
    return [];
  }

  const years = text.match(YEAR_REGEX);
  if (years) {
    return years
      .filter(unique)
      .sort()
      .map(year => parseInt(year));
  } else {
    return [];
  }
};

const formatLocations = text => {
  return [text];
};

const getData = () => {
  return new Promise((resolve, reject) => {
    base("Grantees")
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
              obj.years = formatYears(obj.years);
              obj.locations = formatLocations(obj.locations);
              orgs.push(obj);
            }
          });

          fetchNextPage();
        },
        err => {
          if (err) {
            reject(err);
          } else {
            resolve(orgs);
          }
        }
      );
  });
};

module.exports = getData;
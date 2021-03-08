require('dotenv').config()

const Airtable = require('airtable')
var base = new Airtable({ apiKey: process.env['AIRTABLE_API_KEY'] }).base(
  process.env['AIRTABLE_GRANTEES_BASE_ID']
)

const NAME = 'Organization'
const VISIBLE = 'Show on Website?'
const CATEGORIES = 'Buckets'
const URL = 'Website'
const LOCATIONS = 'Location (of Project)'
const YEARS = 'Dates (Auto)'
const LOGO = 'Logo'
const PHOTO = 'Photo'

const AIRTABLE_FIELDS = [
  NAME,
  VISIBLE,
  CATEGORIES,
  URL,
  LOCATIONS,
  YEARS,
  LOGO,
  PHOTO,
]
const AIRTABLE_SORT = [{ field: NAME, direction: 'asc' }]
const FIELD_MAP = {
  name: NAME,
  visible: VISIBLE,
  categories: CATEGORIES,
  url: URL,
  locations: LOCATIONS,
  years: YEARS,
  logo: LOGO,
  photo: PHOTO,
}
const YEAR_REGEX = new RegExp(/20\d{2}/g)

const orgs = []

const isValidRecord = (record) => {
  return (
    record.get(VISIBLE) &&
    record.get(CATEGORIES) &&
    record.get(CATEGORIES).length > 0 &&
    record.get(YEARS) &&
    record.get(YEARS).length > 0
  )
}

const unique = (value, index, self) => self.indexOf(value) === index

const formatYears = (dates) => dates.map((date) => date.split('-')[0])

const formatLocations = (text) => [text]

const getOrgs = () => {
  console.info('Retrieving orgs...')
  if (orgs.length) {
    console.info('  Returning memoized orgs')
    return orgs
  }

  return new Promise((resolve, reject) => {
    base('Grantees')
      .select({
        view: 'Grid view',
        fields: AIRTABLE_FIELDS,
        sort: AIRTABLE_SORT,
      })
      .eachPage(
        (records, fetchNextPage) => {
          records.forEach(function (record) {
            if (isValidRecord(record)) {
              const obj = {}
              Object.keys(FIELD_MAP).forEach((field) => {
                const data = record.get(FIELD_MAP[field])
                obj[field] = data || null
              })
              obj.years = formatYears(obj.years)
              obj.locations = formatLocations(obj.locations)
              orgs.push(obj)
              // console.log(`+ ${obj.name}`)
            }
          })

          fetchNextPage()
        },
        (err) => {
          if (err) {
            reject(err)
          } else {
            resolve(orgs)
          }
        }
      )
  })
}

module.exports = { getOrgs }

// Builds the All Projects page as a static file in /publish

/* eslint-disable no-console */
require('dotenv').config()
const buildProjectSearch = require('./build_project_search')

const main = async () => {
  buildProjectSearch()
}

main()

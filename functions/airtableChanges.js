// Last edit: 2020-03-02 by Rob Cameron
//
// Reploys the site if there are changes to the Airtable Grantees table.
//
// A recurring job in Repeater.dev hits this function endpoint every 30 minutes:
// https://repeater.dev/applications/prestonwernerventures-com/jobs/airtable-grantee-changes

const fetch = require("node-fetch")
const md5 = require('md5');

const AIRTABLE = {
  BASE_URL: `https://api.airtable.com/v0/${process.env.AIRTABLE_GRANTEES_BASE_ID}/Grantees`,
  HEADERS: { 'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}` }
}
const NETLIFY = {
  BASE_URL: `https://api.netlify.com/api/v1/sites/${process.env.SITE_ID}`,
  HEADERS: {
    'Authorization': `Bearer ${process.env.NETLIFY_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  }
}

const getPage = async (offset) => {
  let url = AIRTABLE.BASE_URL
  if (offset) {
    url += `?offset=${offset}`
  }
  const response = await fetch(url, { headers: AIRTABLE.HEADERS })
  const json = await response.json()

  return json
}

const getAllRecords = async () => {
  let { records, offset } = await getPage()
  let entries = records

  while (offset) {
    ({ records, offset } = await getPage(offset))
    entries = entries.concat(records)
  }

  console.log(`Found ${entries.length} records`)
  return entries
}

const detectChanges = async (entries) => {
  const hash = md5(JSON.stringify(entries))

  // get site data, including latest published deploy
  const response = await fetch(NETLIFY.BASE_URL, { headers: NETLIFY.HEADERS })
  const site = await response.json()
  const lastHash = site.build_settings.env.LAST_AIRTABLE_HASH

  const shouldDeploy = hash !== lastHash

  if (shouldDeploy) {
    console.log(`Detected at least one change: ${hash} vs ${lastHash}`)
  } else {
    console.log("No changes detected, skipping")
  }

  return { shouldDeploy, hash, site }
}

const deploy = async (site) => {
  console.log("Triggering Netlify Build...")
  await fetch(`${NETLIFY.BASE_URL}/builds`, {
    method: 'POST',
    headers: NETLIFY.HEADERS
  })
  console.log("  Started")

  return site
}

// save the hash for comparing next time
const saveHash = async (site, hash) => {
  console.log(`Saving latest hash ${hash}...`)
  const response = await fetch(NETLIFY.BASE_URL,{
    method: 'PATCH',
    headers: Object.assign(NETLIFY.HEADERS),
    body: JSON.stringify({
      build_settings: {
        env: Object.assign(site.build_settings.env, { LAST_AIRTABLE_HASH: hash })
      }
    })
  })
  await response.json()
  console.log("  Done")
}

exports.handler = async (event,context) => {
  const entries = await getAllRecords()
  const { shouldDeploy, hash, site } = await detectChanges(entries)

  if (shouldDeploy) {
    await saveHash(site, hash)
    await deploy(site)
  }

  return {
    statusCode: shouldDeploy ? 201 : 200,
    body: JSON.stringify({ deployed: shouldDeploy })
  };
}

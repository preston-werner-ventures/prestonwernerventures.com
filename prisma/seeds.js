/* eslint-disable no-console */
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const db = new PrismaClient()

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const categories = [
  {
    "name": "Every Human Counts",
    "slug": "every-human-counts",
  },
  {
    "name": "Access to Family Planning",
    "slug": "access-to-family-planning",
    "parent": {
      connect: {
        slug: "every-human-counts"
      }
    }
  },
  {
    "name": "Refugees",
    "slug": "refugees",
    "parent": {
      connect: {
        slug: "every-human-counts"
      }
    }
  },
  {
    "name": "Other",
    "slug": "other",
    "parent": {
      connect: {
        slug: "every-human-counts"
      }
    }
  },
  {
    "name": "Initiative for Collaborative Research",
    "slug": "i4cr",
  },
  {
    "name": "Climate Change Action",
    "slug": "climate-change-action",
  },
  {
    "name": "Reasonable Philanthropy",
    "slug": "reasonable-philanthropy",
  },
  {
    "name": "Hypothesis",
    "slug": "hypothesis",
  },
  {
    "name": "The Future of Work",
    "slug": "future-of-work",
  },
  {
    "name": "Political Engagement",
    "slug": "political-engagement",
  },
  {
    "name": "Better Digital Tools",
    "slug": "better-digital-tools",
  }
]

const orgs = [
  {
    "name": "Action for Community Development",
    "logo": null,
    "photo": null,
    "years": "2017",
    "country": "Uganda",
    "url": "https://www.acodevuganda.org/",
    "categorieses": {
      connect: {
        slug: "every-human-counts"
      }
    }
  },
  {
    "name": "Affinity.works",
    "logo": null,
    "photo": null,
    "years": "2017",
    "country": "United Kingdom",
    "url": "https://www.affinity.works/",
    "categorieses": {
      connect: [
        { slug: "political-engagement" },
        { slug: "better-digital-tools" }
      ],
    }
  },
  {
    "name": "African Community Center for Social Sustainability",
    "logo": "https://cdn.filestackcontent.com/hyYuVmCsQyqjFzBlpyli",
    "photo": "https://cdn.filestackcontent.com/7ajTjs0tR3eQEzEaTzBj",
    "years": "2017, 2018, 2019",
    "country": "Uganda",
    "url": "https://www.acodevuganda.org/",
    "categorieses": {
      connect: {
        slug: "every-human-counts"
      }
    }
  },
  {
    "name": "Akira Chix",
    "logo": null,
    "photo": null,
    "years": "2019, 2020, 2021",
    "country": "Kenya",
    "url": "https://akirachix.com/",
    "categorieses": {
      connect: {
        slug: "every-human-counts"
      }
    }
  }
]

const seedData = async (data, model) => {
  await asyncForEach(data, async (datum) => {
    console.log(`Creating ${datum.name}...`)

    // does this record already exist?
    const record = await db[model].findOne({
      where: { name: datum.name }
    })

    if (record) {
      console.log(`  Record ${datum.name} already exists, skipping`)
    } else {
      await db[model].create({
        data: datum,
      })
    }
  })

  console.info(`\nSeeded ${data.length} ${model}\n`)
}

async function main() {
  await seedData(categories, 'categories')
  await seedData(orgs, 'organizations')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await db.disconnect()
  })

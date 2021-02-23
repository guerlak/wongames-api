'use strict';

const axios = require('axios')
const slugify = require('slugify')

async function getGameInfo(slug) {
  const { JSDOM } = require('jsdom');
  const body = await axios.get(`https://www.gog.com/game/${slug}`)
  const dom = new JSDOM(body.data);

  const description = dom.window.document.querySelector('.description');

  return {
    rating: 'BR0',
    short_description: description.textContent.slice(0, 160),
    description: description.innerHTML
  }
}

async function getByName(name, entity) {
  const item = await strapi.services[entity].find({ name });
  return item.length ? item[0] : null;
}

async function create(name, entity) {
  const item = await getByName(name, entity);
  if (!item) {
    return await strapi.services[entity].create({
      name,
      slug: slugify(name, { lower: true })
    })
  }
  return null;
}

function dataInsertion(products) {

  const developers = {}
  const publishers = {}
  const categories = {}
  const platforms = {}

  products.forEach(prod => {
    const { developer, publisher, genres, supportedOperatingSystems } = prod;

    genres &&
      genres.forEach(item => {
        categories[item] = true;
      });
    supportedOperatingSystems &&
      supportedOperatingSystems.forEach(item => {
        platforms[item] = true;
      })

    developers[developer] = true;
    publishers[publisher] = true;
  })

  return Promise.all([
    ...Object.keys(developers).map(name => create(name, 'developer')),
    ...Object.keys(publishers).map(name => create(name, 'publisher')),
    ...Object.keys(categories).map(name => create(name, 'category')),
    ...Object.keys(platforms).map(name => create(name, 'platform'))
  ])
}

module.exports = {
  populate: async (params) => {
    // const cat = await strapi.services.category.find({ name: "Action" })
    // return cat;

    const gogApiUrl = `https://www.gog.com/games/ajax/filtered?mediaType=game&page=1&sort=popularity`;
    const { data: { products } } = await axios.get(gogApiUrl);

    await dataInsertion([products[2], products[3]])
    // await create(products[0].publisher, "publisher")
    // await create(products[0].developer, "developer")

  }
};

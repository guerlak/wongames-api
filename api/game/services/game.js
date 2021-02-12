'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/services.html#core-services)
 * to customize this service
 */

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
    const { developer, publisher, genres, supportedOperatingSystems } = product;

    genres &&
      genres.forEach(item => {
        categories[item] = true;
      });
    supportedOperatingSystems &&
      supportedOperatingSystems.forEach(item => {
        platforms[item] = true;
      })

  })
}

module.exports = {
  populate: async (params) => {
    // const cat = await strapi.services.category.find({ name: "Action" })
    // return cat;

    const gogApiUrl = `https://www.gog.com/games/ajax/filtered?mediaType=game&page=1&sort=popularity`;
    const { data: { products } } = await axios.get(gogApiUrl);

    console.log(products[0])

    await create(products[0].publisher, "publisher")
    await create(products[0].developer, "developer")

  }
};

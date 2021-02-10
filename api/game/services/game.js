'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  populate: async (params) => {
    const cat = await strapi.services.category.find({ name: "Action" })
    return cat;
  }
};
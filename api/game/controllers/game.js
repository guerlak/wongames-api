'use strict';

module.exports = {
  populate: async (ctx) => {
    console.log(" --> Populate running...");
    const cat = await strapi.services.game.populate();
    ctx.send(cat[0].name);
  }
};

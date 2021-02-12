'use strict';

module.exports = {
  populate: async (ctx) => {
    const res = await strapi.services.game.populate();
    res ? ctx.send(res) : ctx.send("empty")
  }
};

/* eslint-disable func-names */
/* eslint-disable consistent-return */

import axios from "axios";

exports.handler = function(event, context, callback) {
  const data = JSON.parse(event.body);
  const { ids } = data;
  const url = `https://${process.env.GATSBY_SHOPIFY_EU_API_KEY}:${process.env.GATSBY_SHOPIFY_EU_PASSWORD}@${process.env.GATSBY_SHOPIFY_EU_STORE}.myshopify.com/admin/api/2020-07/inventory_levels.json?inventory_item_ids=${ids}`;

  axios.get(url).then(response => {
    callback(null, {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": `*`,
        "Access-Control-Allow-Headers": `Origin, X-Requested-With, Content-Type, Accept`
      },
      body: JSON.stringify(response.data)
    });
  });
};

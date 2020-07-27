/* eslint-disable func-names */
/* eslint-disable consistent-return */

import axios from "axios";

exports.handler = function(event, context, callback) {
  const query = JSON.parse(event.body);
  const url = `https://${process.env.GATSBY_SHOPIFY_EU_STORE}.myshopify.com/api/graphql`;

  // eslint-disable-next-line no-console
  console.log(`[debug] Executing query: `, query);

  axios({
    url,
    method: `POST`,
    headers: {
      "X-Shopify-Storefront-Access-Token":
        process.env.GATSBY_SHOPIFY_EU_STOREFRONT_TOKEN,
      Accept: `application/json`
    },
    data: {
      query
    }
  }).then(response => {
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

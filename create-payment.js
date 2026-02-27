exports.handler = async function (event) {
  try {
    const { items } = JSON.parse(event.body);

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MP_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        items: items,
        payment_methods: {
          installments: 3
        },
        back_urls: {
          success: "https://seusite.netlify.app/sucesso",
          failure: "https://seusite.netlify.app/erro",
          pending: "https://seusite.netlify.app/pendente"
        },
        auto_return: "approved"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: data })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ id: data.id })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

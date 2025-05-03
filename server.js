const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Add this line to allow all cross-origin requests
app.use(cors({ origin: '*' }));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.post('/relay', async (req, res) => {
  try {
    const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/7486139/2pjg13l/';

    const zapierRes = await fetch(zapierWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const result = await zapierRes.text();
    res.status(200).send({ success: true, zapierResponse: result });
  } catch (err) {
    console.error('Relay error:', err);
    res.status(500).send({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Relay server running on port ${PORT}`);
});

const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Allow all subdomains of dunbridgefinancial.com
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.endsWith('.dunbridgefinancial.com')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(bodyParser.json());

// ✅ Health check route
app.get('/', (req, res) => {
  res.set('X-Relay-Version', '1.0.0');
  res.send('Zapier Relay is running');
});

// ✅ POST relay to Zapier
app.post('/relay', async (req, res) => {
  try {
    console.log('📦 Incoming Payload:', JSON.stringify(req.body, null, 2));

    const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/7486139/2pjg13l/';

    const zapierRes = await fetch(zapierWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const result = await zapierRes.text();

    res.set('X-Relay-Version', '1.0.0');
    res.status(200).send({ success: true, zapierResponse: result });
  } catch (err) {
    console.error('❌ Relay error:', err);
    res.status(500).send({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Zapier relay server running on port ${PORT}`);
});

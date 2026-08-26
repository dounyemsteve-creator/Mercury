const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Read eBay Credentials safely from Render Environment Variables
const CLIENT_ID = process.env.EBAY_CLIENT_ID;
const CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET;

// Helper function to fetch OAuth Application Token from eBay
async function getEbayToken() {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`
    },
    body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope'
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error_description || 'Failed to authenticate with eBay');
  }
  return data.access_token;
}

// Proxy Endpoint: Fetch live eBay products for the search bar & homepage
app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q || 'electronics';
    const token = await getEbayToken();
    
    const ebayResponse = await fetch(`https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&limit=15`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
      }
    });
    
    const data = await ebayResponse.json();
    res.json(data);
  } catch (error) {
    console.error('eBay API Proxy Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch live products from eBay API' });
  }
});

// Fallback route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`MERCADO Server running on port ${PORT}`));

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Search endpoint to query eBay items
app.get('/api/search', async (req, res) => {
  const query = req.query.q || 'drone';
  const token = process.env.EBAY_TOKEN;

  if (!token) {
    return res.status(500).json({ error: 'EBAY_TOKEN environment variable is not set.' });
  }

  try {
    const response = await fetch(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&limit=10`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching from eBay API:', error);
    res.status(500).json({ error: 'Failed to communicate with eBay API' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


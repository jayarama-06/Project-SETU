// SETU Backend — Entry Point 
// This file will be built out during Sprint 1 (March 1-5) 
 
require('dotenv').config(); 
const express = require('express'); 
const app = express(); 
 
app.use(express.json()); 
 
// Health check 
app.get('/api/health', (req, res) => { 
  res.json({ status: 'ok', service: 'setu-backend', version: '0.1.0' 
}); 
}); 
 
const PORT = process.env.PORT || 3001; 
app.listen(PORT, () => { 
  console.log(`SETU backend running on port ${PORT}`); 
});

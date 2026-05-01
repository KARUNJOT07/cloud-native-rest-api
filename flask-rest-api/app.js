const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Simple in-memory data store for demo purposes
let items = [
  { id: 1, name: 'Item 1', description: 'First sample item', createdAt: new Date() },
  { id: 2, name: 'Item 2', description: 'Second sample item', createdAt: new Date() }
];

// Health check endpoint (important for Kubernetes liveness probes)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// GET all items
app.get('/api/items', (req, res) => {
  res.status(200).json({
    success: true,
    count: items.length,
    data: items
  });
});

// GET single item by ID
app.get('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  
  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: item
  });
});

// POST create new item
app.post('/api/items', (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Name field is required'
    });
  }
  
  const newItem = {
    id: Math.max(...items.map(i => i.id), 0) + 1,
    name,
    description: description || '',
    createdAt: new Date()
  };
  
  items.push(newItem);
  
  res.status(201).json({
    success: true,
    message: 'Item created successfully',
    data: newItem
  });
});

// DELETE item
app.delete('/api/items/:id', (req, res) => {
  const index = items.findIndex(i => i.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }
  
  const deleted = items.splice(index, 1);
  
  res.status(200).json({
    success: true,
    message: 'Item deleted successfully',
    data: deleted[0]
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Cloud-Native REST API Service',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      getItems: 'GET /api/items',
      getItem: 'GET /api/items/:id',
      createItem: 'POST /api/items',
      deleteItem: 'DELETE /api/items/:id'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`REST API Service running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

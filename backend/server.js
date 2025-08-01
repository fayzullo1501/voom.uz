const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Импорт маршрутов
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // 👉 импортируй
const routeRoutes = require('./routes/routeRoutes');

const app = express();
const PORT = process.env.PORT || 5100;

// Middleware
app.use(cors());
app.use(express.json());

// Роуты
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/routes', routeRoutes);


// 👉 Раздача аватарок по ссылке /uploads/...
app.use('/uploads', express.static('uploads'));

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
  });

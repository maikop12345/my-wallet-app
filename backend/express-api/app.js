const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const healthRoutes   = require('./routes/health.routes');
const otpRoutes      = require('./routes/otp.routes');
const authRoutes     = require('./routes/auth.routes');
const balanceRoutes  = require('./routes/balance.routes');
const transferRoutes = require('./routes/transfer.routes');
const historyRoutes  = require('./routes/history.routes');

const app = express();
app.use(cors());
app.use(express.json());

// Swagger UI en /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas principales
app.use('/health', healthRoutes);
app.use('/otp', otpRoutes);
app.use('/login', authRoutes);
app.use('/saldo', balanceRoutes);
app.use('/transferir', transferRoutes);
app.use('/transferencias', historyRoutes);

module.exports = app;

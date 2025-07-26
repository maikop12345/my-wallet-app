// backend/express-api/controllers/transfer.controller.js
const { sequelize, User, Transfer } = require('../models');

/**
 * Ejecuta una transferencia atómica entre usuarios.
 */
exports.doTransfer = async (req, res) => {
  const from = req.user.phone;
  const { to, amount } = req.body;

  // Validaciones básicas
  if (!to || !/^\d{10}$/.test(to)) {
    return res.status(400).json({ error: 'Número destino inválido' });
  }
  const amt = Number(amount);
  if (isNaN(amt) || amt <= 0) {
    return res.status(400).json({ error: 'Monto debe ser un número mayor a 0' });
  }

  try {
    // Cargar usuarios
    const fromUser = await User.findByPk(from);
    const toUser = await User.findByPk(to);

    if (!toUser) {
      // Registrar transferencia fallida
      await Transfer.create({ fromPhone: from, toPhone: to, amount: amt, status: 'failed', reason: 'Destino no existe' });
      return res.status(404).json({ error: 'Usuario destino no encontrado' });
    }
    if (fromUser.balance < amt) {
      await Transfer.create({ fromPhone: from, toPhone: to, amount: amt, status: 'failed', reason: 'Saldo insuficiente' });
      return res.status(400).json({ error: 'Saldo insuficiente' });
    }

    // Transacción Sequelize
    const t = await sequelize.transaction();
    try {
      fromUser.balance -= amt;
      toUser.balance += amt;
      await fromUser.save({ transaction: t });
      await toUser.save({ transaction: t });

      const record = await Transfer.create(
        { fromPhone: from, toPhone: to, amount: amt, status: 'success' },
        { transaction: t }
      );
      await t.commit();

      return res.json({
        success: true,
        newBalance: fromUser.balance,
        transfer: record
      });
    } catch (err) {
      await t.rollback();
      console.error('Error en transacción:', err);
      return res.status(500).json({ error: 'Error interno al procesar la transferencia' });
    }
  } catch (err) {
    console.error('Error en doTransfer:', err);
    return res.status(500).json({ error: 'Error interno en el servidor' });
  }
};

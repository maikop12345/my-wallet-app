const { Transfer } = require('../models');
const { Op } = require('sequelize');

exports.getHistory = async (req, res) => {
  try {
    const phone = req.user.phone;
    const transfers = await Transfer.findAll({
      where: {
        [Op.or]: [
          { fromPhone: phone },
          { toPhone:   phone }
        ]
      },
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    return res.json({ transfers });
  } catch (err) {
    console.error('Error en getHistory:', err);
    return res.status(500).json({ error: 'Error al obtener historial' });
  }
};

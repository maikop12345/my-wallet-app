const { User } = require('../models');

exports.getBalance = async (req, res) => {
  try {
    const phone = req.user.phone;            // proviene del middleware de auth
    const user = await User.findByPk(phone);
    return res.json({ balance: user?.balance ?? 0 });
  } catch (err) {
    console.error('Error en getBalance:', err);
    return res.status(500).json({ error: 'Error al obtener el saldo' });
  }
};

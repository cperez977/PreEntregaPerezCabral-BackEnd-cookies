import User from "../dao/models/User.js";
import Product from "../dao/models/Product.js";

const registrar = async (req, res) => {
  try {
    const usuario = new User(req.body);
    const usuarioAlamacenado = await usuario.save();
    res.json(usuarioAlamacenado);
  } catch (error) {
    console.log(error);
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;
  // Comprobar si el usuario existe
  const usuario = await User.findOne({ email });

  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  // Comprobar password
  if (await User.findOne({ email, password })) {
    // Almacena la información del usuario en la sesión
    req.session.user = {
      _id: usuario._id,
      nombre: usuario.first_name,
      email: usuario.email,
      rol: usuario.rol,
    };
    return res.redirect("/api/users/productos");
  } else {
    const error = new Error("El password es incorrecto");
    return res.status(403).json({ msg: error.message });
  }
};

const productos = async (req, res) => {
  // Accede a la información del usuario desde la sesión
  const user = req.session.user;

  if (user) {
    res.send(`Bienvenido ${user.email} tu rol es ${user.rol}`);
  } else {
    // Maneja el caso en el que no hay información de usuario en la sesión
    res.status(403).send("Acceso no autorizado");
  }
};

export { registrar, autenticar, productos };

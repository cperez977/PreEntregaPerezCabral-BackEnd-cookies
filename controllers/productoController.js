import fs from "fs/promises";
import path from "path";
import { generateID } from "../helpers/generateID.js";

export const crearProducto = async (req, res) => {
  try {
    const newProduct = req.body;

    const currentFileDirectory = path.dirname(
      new URL(import.meta.url).pathname.substring(1)
    );
    const filePath = path.join(
      currentFileDirectory,
      "..",
      "data",
      "productos.json"
    );

    let productos = await fs.readFile(filePath, "utf8");
    productos = JSON.parse(productos);

    newProduct.id = generateID();
    productos.push(newProduct);

    await fs.writeFile(filePath, JSON.stringify(productos, null, 2));

    res.status(201).json(newProduct);

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

export const obtenerProductos = async (req, res) => {
  try {
    const currentFileDirectory = path.dirname(
      new URL(import.meta.url).pathname.substring(1)
    );
    const filePath = path.join(
      currentFileDirectory,
      "..",
      "data",
      "productos.json"
    );

    let productos = await fs.readFile(filePath, "utf8");
    productos = JSON.parse(productos);

    let { limit = 10, page = 1, sort, query } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);

    if (sort === "asc") {
      productos.sort((a, b) => a.price - b.price);
    } else if (sort === "desc") {
      productos.sort((a, b) => b.price - a.price);
    }

    if (query) {
      productos = productos.filter((producto) =>
        producto.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    const totalPages = Math.ceil(productos.length / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = productos.slice(startIndex, endIndex);

    res.status(200).json({
      status: "success",
      payload: paginatedProducts,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/products?limit=${limit}&page=${page - 1}` : null,
      nextLink:
        page < totalPages ? `/products?limit=${limit}&page=${page + 1}` : null,
    });

    console.log("Productos:", paginatedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const obtenerProducto = async (req, res) => {
  const pid = req.params.pid;
  const productos = JSON.parse(
    fs.readFileSync("./data/productos.json", "utf8")
  );
  const producto = productos.find((p) => p.id === pid);
  if (producto) {
    res.json(producto);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
};

export const actualizarProducto = async (req, res) => {
  const pid = req.params.pid;
  const updatedFields = req.body;
  const productos = JSON.parse(
    fs.readFileSync("./data/productos.json", "utf8")
  );
  const index = productos.findIndex((p) => p.id === pid);
  if (index !== -1) {
    for (const key in updatedFields) {
      if (Object.hasOwnProperty.call(updatedFields, key)) {
        productos[index][key] = updatedFields[key];
      }
    }
    fs.writeFileSync(
      "./data/productos.json",
      JSON.stringify(productos, null, 2)
    );
    res.json(productos[index]);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
};

export const eliminarProducto = async (req, res) => {
  const pid = req.params.pid;
  const productos = JSON.parse(
    fs.readFileSync("./data/productos.json", "utf8")
  );
  const index = productos.findIndex((p) => p.id === pid);
  if (index !== -1) {
    productos.splice(index, 1);
    fs.writeFileSync(
      "./data/productos.json",
      JSON.stringify(productos, null, 2)
    );
    res.json({ message: "Producto eliminado" });
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
};

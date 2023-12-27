import fs from "fs";
import path from "path";
import { generateID } from "../helpers/generateID.js";
import mongoose from "mongoose";
import Cart from "../dao/models/Carts.js";

export const crearCarrito = async (req, res) => {
  try {
    const newCart = req.body;

    const currentFileDirectory = path.dirname(
      new URL(import.meta.url).pathname.substring(1)
    );

    const filePath = path.join(
      currentFileDirectory,
      "..",
      "data",
      "carritos.json"
    );

    let carritos = fs.readFileSync(filePath, "utf8");
    carritos = JSON.parse(carritos);

    newCart.id = generateID();
    carritos.push(newCart);

    fs.writeFileSync(filePath, JSON.stringify(carritos, null, 2));

    res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

const currentFileDirectory = path.dirname(
  new URL(import.meta.url).pathname.substring(1)
);

export const obtenerCarrito = async (req, res) => {
  const cid = req.params.cid;

  // Construir la ruta al archivo usando path.join
  const filePath = path.join(
    currentFileDirectory,
    "..",
    "data",
    "carritos.json"
  );

  try {
    // Leer el archivo usando la ruta absoluta
    const carritos = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const cart = carritos.find((c) => c.id === cid);

    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

export const agregarProductoAcarrito = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = req.body.quantity || 1;

  try {
    let carritos = JSON.parse(
      fs.readFileSync(
        path.join(currentFileDirectory, "..", "data", "carritos.json"),
        "utf8"
      )
    );

    const cart = carritos.find((c) => c.id === cid);

    if (cart) {
      const existingProduct = cart.products.find((p) => p.product === pid);

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ product: pid, quantity });
      }

      fs.writeFileSync(
        path.join(currentFileDirectory, "..", "data", "carritos.json"),
        JSON.stringify(carritos, null, 2)
      );

      res.json(cart);
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

export const eliminarProductoDelCarrito = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    let carritos = JSON.parse(
      fs.readFileSync(
        path.join(currentFileDirectory, "..", "data", "carritos.json"),
        "utf8"
      )
    );

    const cartIndex = carritos.findIndex((c) => c.id === cartId);

    if (cartIndex !== -1) {
      const productIndex = carritos[cartIndex].products.findIndex(
        (p) => p.product === productId
      );

      if (productIndex !== -1) {
        carritos[cartIndex].products.splice(productIndex, 1);

        fs.writeFileSync(
          path.join(currentFileDirectory, "..", "data", "carritos.json"),
          JSON.stringify(carritos, null, 2)
        );

        res.json(carritos[cartIndex]);
      } else {
        res.status(404).json({ error: "Producto no encontrado en el carrito" });
      }
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

export const actualizarCarrito = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const updatedCart = req.body;

    let carritos = JSON.parse(
      fs.readFileSync(
        path.join(currentFileDirectory, "..", "data", "carritos.json"),
        "utf8"
      )
    );

    const cartIndex = carritos.findIndex((c) => c.id === cartId);

    if (cartIndex !== -1) {
      carritos[cartIndex] = { id: cartId, products: updatedCart };

      fs.writeFileSync(
        path.join(currentFileDirectory, "..", "data", "carritos.json"),
        JSON.stringify(carritos, null, 2)
      );

      res.json(carritos[cartIndex]);
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

export const actualizarCantidadProducto = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    let carritos = JSON.parse(
      fs.readFileSync(
        path.join(currentFileDirectory, "..", "data", "carritos.json"),
        "utf8"
      )
    );

    const cartIndex = carritos.findIndex((c) => c.id === cartId);

    if (cartIndex !== -1) {
      const productIndex = carritos[cartIndex].products.findIndex(
        (p) => p.product === productId
      );

      if (productIndex !== -1) {
        carritos[cartIndex].products[productIndex].quantity = quantity;

        fs.writeFileSync(
          path.join(currentFileDirectory, "..", "data", "carritos.json"),
          JSON.stringify(carritos, null, 2)
        );

        res.json(carritos[cartIndex]);
      } else {
        res.status(404).json({ error: "Producto no encontrado en el carrito" });
      }
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

export const vaciarCarrito = async (req, res) => {
  try {
    const cartId = req.params.cid;

    let carritos = JSON.parse(
      fs.readFileSync(
        path.join(currentFileDirectory, "..", "data", "carritos.json"),
        "utf8"
      )
    );

    const cartIndex = carritos.findIndex((c) => c.id === cartId);

    if (cartIndex !== -1) {
      carritos[cartIndex].products = [];

      fs.writeFileSync(
        path.join(currentFileDirectory, "..", "data", "carritos.json"),
        JSON.stringify(carritos, null, 2)
      );

      res.json(carritos[cartIndex]);
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

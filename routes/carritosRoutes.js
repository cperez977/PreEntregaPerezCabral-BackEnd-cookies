import express from "express";
import {
  eliminarProductoDelCarrito,
  actualizarCarrito,
  actualizarCantidadProducto,
  vaciarCarrito,
  obtenerCarrito,
  crearCarrito,
  agregarProductoAcarrito,
} from "../controllers/carritoController.js";

const router = express.Router();

router.post("/", crearCarrito);

router.post("/:cid/products/:pid", agregarProductoAcarrito);

router.delete("/:cid/products/:pid", eliminarProductoDelCarrito);

router.put("/:cid", actualizarCarrito);

router.put("/:cid/products/:pid", actualizarCantidadProducto);

router.delete("/:cid", vaciarCarrito);

router.get("/:cid", obtenerCarrito);

export default router;

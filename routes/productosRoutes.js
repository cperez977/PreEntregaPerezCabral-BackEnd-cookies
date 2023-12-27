import express from "express";
import {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  eliminarProducto,
} from "../controllers/productoController.js";

const router = express.Router();

router.get("/", obtenerProductos);

router.get("/:pid", obtenerProducto);

router.post("/", crearProducto);

router.put("/:pid", actualizarProducto);

router.delete("/:pid", eliminarProducto);

export default router;

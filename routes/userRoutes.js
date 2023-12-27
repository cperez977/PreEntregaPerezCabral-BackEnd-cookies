import express from "express";
import { registrar, autenticar, productos } from "../controllers/userController.js";

const router = express.Router();

router.post("/registrar", registrar);
router.post("/autenticar", autenticar);

router.get("/productos", productos);
export default router;

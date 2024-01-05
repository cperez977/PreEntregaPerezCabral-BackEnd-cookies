import express from "express";
import conectarDB from "./config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { engine } from "express-handlebars";
import messageRoutes from "./routes/messageRoutes.js";
import productosRoutes from "./routes/productosRoutes.js";
import carritosRoutes from "./routes/carritosRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import session from "express-session";

dotenv.config();
const app = express();

app.use(
  session({ secret: "tu_secreto", resave: true, saveUninitialized: true })
);

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

conectarDB();
const server = createServer(app);
const io = new Server(server);
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado");

  socket.on("create product", (product) => {
    console.log(`Producto creado: ${product}`);
    io.emit("product created", product);
  });

  socket.on("delete product", (product) => {
    console.log(`Producto eliminado: ${product}`);
    io.emit("product deleted", product);
  });
});

app.get("/", (req, res) => {
  const products = ["Producto 1", "Producto 2", "Producto 3"];
  res.render("home", { products });
});

app.get("/realtimeproducts", (req, res) => {
  const products = ["Producto 1", "Producto 2", "Producto 3", "Producto 4"];
  products.map((product) => {
    res.render("realTimeProducts", { product });
  });
});

app.post("/create-product", (req, res) => {
  const product = req.body.product;
  io.emit("create product", product);
  res.send("Producto creado");
});

app.post("/delete-product", (req, res) => {
  const product = req.body.product;
  io.emit("delete product", product);
  res.send("Producto eliminado");
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/chat", (req, res) => {
  res.render("chat");
});

app.get("/products", (req, res) => {
  res.render("realTimeProducts");
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if(err) {
      return console.log(err);
    }
    res.redirect('/');
  });
});


app.use("/messages", messageRoutes);
app.use("/api/products", productosRoutes);
app.use("/api/carts", carritosRoutes);
app.use("/api/users", userRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import mongoose from "mongoose";

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});

    const conn = mongoose.connection;
    console.log(`DB Conectada en ${conn.host} ${conn.name} ${conn.port}`);
  } catch (error) {
    console.log(error);
    process.exit(1); 
  }
};
export default conectarDB;

import mongoose from "mongoose";

const connectDB = async () => {

  try {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB conectado");

    // Limpia googleId: null de usuarios locales para que el índice sparse
    // no los indexe y no bloquee la creación de nuevos usuarios locales.
    const db = mongoose.connection.db;
    await db.collection("users").updateMany(
      { googleId: null },
      { $unset: { googleId: "" } }
    );

  } catch (error) {

    console.error(error.message);

    process.exit(1);

  }

};

export default connectDB;
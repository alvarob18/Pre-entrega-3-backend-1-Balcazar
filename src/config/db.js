import mongoose from "mongoose";

const connectMongoDB = async() => {
  try {
    await mongoose.connect(
      "mongodb+srv://coder:coderpass@cluster0.rnhly01.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Conectado con MongoDB!");
  } catch (error) {
    console.log("Error al conectar con mongodb");
  }
}

export default connectMongoDB;
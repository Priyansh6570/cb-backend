import mongoose from 'mongoose';
mongoose.set('strictQuery', false);

const connectDB = () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // createIndexes: true, //do not uncomment, Depricated attribute!
      // useFindAndModify: false,
    })
    .then((data) => {
      console.log(`Database Connected with server: ${data.connection.host}`);
    });
};

export default connectDB;

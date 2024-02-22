const config = require("./../config/config");

const initDatabase = async (mongoose) => {
  mongoose.set('strictQuery', true);
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Failed to connect to MongoDB:', error));
};

module.exports = {
  initDatabase,
};

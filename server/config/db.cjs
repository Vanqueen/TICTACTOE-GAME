const { connect} = require("mongoose");
const dotenv = require("dotenv");
const { ServerApiVersion } = requir('mongodb');
dotenv.config();

const connectDB = async () => {
    try {
        // eslint-disable-next-line no-undef
        const uri = process.env.MONGO_URI;
        await connect(uri, {
            serverApi: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        });
        console.log("Connecté à MongoDB avec succès");
    } catch (error) {
        console.error("Erreur de connexion à MongoDB : ", error);
        // eslint-disable-next-line no-undef
        process.exit(1);
    }
}

export default connectDB;

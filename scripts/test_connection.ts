
import mongoose from 'mongoose';

const password = encodeURIComponent("Ad3n,-P@$$w0rd");
const uri = `mongodb+srv://berrybrightson:${password}@rebrycreatives.gufz6di.mongodb.net/?appName=Rebrycreatives`;

console.log("Testing URI with encoded password...");
console.log(`URI: mongodb+srv://berrybrightson:***@rebrycreatives.gufz6di.mongodb.net/?appName=Rebrycreatives`);

async function testConnection() {
    try {
        await mongoose.connect(uri);
        console.log("SUCCESS: Connected to MongoDB!");
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("FAILURE: Could not connect.");
        console.error(error);
        process.exit(1);
    }
}

testConnection();

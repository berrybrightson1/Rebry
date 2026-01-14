
import dbConnect from "../lib/db";
import Request from "../models/Request";

async function checkDb() {
    try {
        console.log("Connecting to DB...");
        await dbConnect();
        console.log("Connected. Fetching requests...");
        const requests = await Request.find({});
        console.log(`Found ${requests.length} requests.`);
        requests.forEach(r => {
            console.log(`- [${r.status}] ${r.businessName} (${r.email})`);
        });
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkDb();

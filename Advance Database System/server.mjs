import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname } from "path";
import express from "express";
import { MongoClient } from "mongodb";
import bodyParser from "body-parser";
import os from "os";
import { publicIpv4 } from "public-ip";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// MongoDB Connection
const mongoUrl = process.env.MONGO_URI || "mongodb://localhost:27017/Mini";
const client = new MongoClient(mongoUrl);
const db = client.db();
const collection = db.collection("mycollection");

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
    }
}
connectToMongoDB();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.static(__dirname + "/public")); // Serve static files
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Home Route
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Insert Data
app.post("/insertData", async (req, res) => {
    const data = req.body;
    try {
        const existingData = await collection.findOne({ email: data.email });
        if (existingData) {
            return res.status(400).send("Email already exists, user adding failed!");
        }
        await collection.insertOne(data);
        res.status(200).send("User added successfully");
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).send("Error adding data");
    }
});

// Fetch Data
app.get("/fetchData", async (req, res) => {
    try {
        const data = await collection.find({}).limit(12).sort({ _id: -1 }).toArray();
        res.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Error fetching data");
    }
});

// Host Info
app.get("/hostinfo", async (req, res) => {
    try {
        const hostname = os.hostname();
        const networkInterfaces = os.networkInterfaces();
        let privateIp = "";

        for (const iface in networkInterfaces) {
            for (let i = 0; i < networkInterfaces[iface].length; i++) {
                if (networkInterfaces[iface][i].family === "IPv4" && !networkInterfaces[iface][i].internal) {
                    privateIp = networkInterfaces[iface][i].address;
                    break;
                }
            }
            if (privateIp) break;
        }

        let publicIpAddress = await publicIpv4();
        res.json({ hostname, privateIp, publicIpAddress });
    } catch (error) {
        console.error("Error retrieving host information:", error);
        res.status(500).send("Error fetching host information");
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

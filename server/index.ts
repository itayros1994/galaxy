import express, { Request, Response } from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const DEFAULT_PORT = 5000;

// Enable CORS for all origins (temporarily for testing)
app.use(cors());


// In-memory cache
const cache: { [key: string]: any } = {};
const CACHE_TTL = 300000; // Cache Time-To-Live in milliseconds (5 minutes)

// List of meteors
let meteorData: any[] = [];

// Fetch meteor data from NASA API
const fetchData = async () => {
    try {
        const response = await axios.get(
            "https://data.nasa.gov/resource/y77d-th95.json"
        );
        meteorData = response.data;
        console.log("Meteor data fetched successfully.");
    } catch (error) {
        console.error("Error fetching meteor data:", error);
    }
};

// Middleware to check cache
const checkCache: express.RequestHandler = (req, res, next) => {
    const key = JSON.stringify(req.query);

    if (cache[key] && cache[key].timestamp + CACHE_TTL > Date.now()) {
        console.log("Cache hit!");
        res.json(cache[key].data);
        return;
    }

    console.log("Cache miss!");
    next();
};

// Endpoint to filter and return meteors (with cache)
app.get("/meteors", checkCache, (req: Request, res: Response) => {
    const { year, mass, page = 1, limit = 10 } = req.query;

    let filteredData = meteorData;

    // Filter by year
    if (year) {
        filteredData = filteredData.filter(
            (meteor) => new Date(meteor.year).getFullYear() === Number(year)
        );
    }

    // Filter by mass
    if (mass) {
        filteredData = filteredData.filter(
            (meteor) => Number(meteor.mass) > Number(mass)
        );
    }

    // Pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const pagedData = filteredData.slice(startIndex, endIndex);

    // Save to cache
    const key = JSON.stringify(req.query);
    cache[key] = { data: { data: pagedData, total: filteredData.length }, timestamp: Date.now() };

    res.json(cache[key].data);
});

// Endpoint to get unique years
app.get("/years", (req: Request, res: Response) => {
    const uniqueYears = Array.from(
        new Set(
            meteorData
                .map((meteor) => meteor.year && String(new Date(meteor.year).getFullYear()))
                .filter((year) => typeof year === "string") // Ensure all are strings
        )
    ).sort(); // Sort years ascending

    console.log("Unique years:", uniqueYears); // Log the years
    res.json({ years: uniqueYears });
});

// Function to check if a port is available
const getAvailablePort = async (port: number): Promise<number> => {
    const net = require("net");
    return new Promise((resolve) => {
        const server = net.createServer();
        server.once("error", () => {
            resolve(port + 1); // Try the next port
        });
        server.once("listening", () => {
            server.close(() => resolve(port));
        });
        server.listen(port);
    });
};

// Start the server
(async () => {
    const port = await getAvailablePort(DEFAULT_PORT);

    app.listen(port, async () => {
        console.log(`Server running on http://localhost:${port}`);
        await fetchData(); // Fetch data when the server starts
    });
})();

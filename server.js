"console.log('SERP AI Backend');" 
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Serve static files (including Google verification)
app.use(express.static(path.join(__dirname, "public")));

// ✅ Serve Google verification file directly
app.get("/google7f01d29d82127287.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "google7f01d29d82127287.html"));
});

// Root Route
app.get("/", (req, res) => {
    res.send("🚀 SERP AI Backend is Running!");
});

// Google Search Console API Route
app.get("/api/gsc", async (req, res) => {
    try {
        const auth = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        );
        auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

        const searchConsole = google.searchconsole({ version: "v1", auth });

        const response = await searchConsole.searchanalytics.query({
    siteUrl: "https://serp-ai-app.vercel.app", // Updated
    requestBody: {
        startDate: "2024-01-01",
        endDate: "2024-02-01",
        dimensions: ["query"],
        rowLimit: 10
    }
});


        res.json(response.data);
    } catch (error) {
        console.error("Google API Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// ✅ Corrected for Vercel: Export Express App
module.exports = app;

// ✅ Ensure the server runs locally
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

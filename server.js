require("dotenv").config();
console.log("🚀 SERP AI Backend is Starting...");

const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Serve static files (for Google site verification)
app.use(express.static(path.join(__dirname, "public")));

// ✅ Serve Google verification file
app.get("/google7f01d29d82127287.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "google7f01d29d82127287.html"));
});

// ✅ Root Route
app.get("/", (req, res) => {
    res.send("🚀 SERP AI Backend is Running!");
});

// ✅ Google Search Console API Route
app.get("/api/gsc", async (req, res) => {
    try {
        const siteUrl = req.query.siteUrl;
        console.log(`🔍 Fetching GSC Data for: ${siteUrl}`); // ✅ Log site URL

        // Initialize OAuth2 client
        const auth = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
        );
        auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

        // Connect to Google Search Console API
        const searchConsole = google.searchconsole({ version: "v1", auth });

        // 🔹 Query Search Console for top 10 queries
        const response = await searchConsole.searchanalytics.query({
            siteUrl: siteUrl,
            requestBody: {
                startDate: "2024-01-01",
                endDate: "2024-02-01",
                dimensions: ["query"],
                rowLimit: 10
            }
        });

        console.log("🔹 GSC API Raw Response:", response); // ✅ Log full API response
        console.log("🔹 GSC API Data:", JSON.stringify(response.data, null, 2)); // ✅ Log formatted data

        res.json(response.data);

    } catch (error) {
        console.error("❌ Google API Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});


// ✅ Export Express App for Vercel Deployment
module.exports = app;

// ✅ Run the Server Locally
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { promises as fs } from "fs";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
let apii = '';

const loadApiKey = async () => {
    try {
        apii = await fs.readFile('api_key.txt', 'utf8');
    } catch (error) {
        console.error("Error reading API key file:", error);
    }
};

loadApiKey();

app.post('/scan-url', async (req, res) => {
    const url = req.body.url;
    const api = apii.trim();
    console.log(api);
    console.log(url);

    try {
        const scanResponse = await fetch(`https://www.virustotal.com/vtapi/v2/url/scan?apikey=${api}&url=${encodeURIComponent(url)}`, {
            method: 'POST',
        });

        if (scanResponse.status !== 200) {
            const resultMessage = 3;
            const tosend = { resultMessage };
            console.log(`Error in scanning URL: ${scanResponse.status}`);
            return res.status(scanResponse.status).json(tosend);
        }

        const scanData = await scanResponse.json();

        if (!('scan_id' in scanData)) {
            console.log(`Error: scan_id not found in the scan response`);
            return res.status(400).json({ error: 'scan_id not found in the scan response' });
        }

        const scanid = scanData.scan_id;

        // waiting optional
        // await new Promise(resolve => setTimeout(resolve, 1500));

        const reportResponse = await fetch(`https://www.virustotal.com/vtapi/v2/url/report?apikey=${api}&resource=${scanid}`, {
            method: 'POST',
        });

        const reportData = await reportResponse.json();

        let resultMessage = "";
        if ('positives' in reportData && reportData['response_code'] === 1) {
            if (reportData["positives"] <= 0) {
                resultMessage = 0;
            } else if (1 <= reportData['positives'] && reportData['positives'] <= 3) {
                resultMessage = 1;
            } else if (reportData['positives'] >= 4) {
                resultMessage = 2;
            }
        } else {
            resultMessage = "URL NOT FOUND";
        }

        const responseToSend = { ...reportData, resultMessage };
        res.json(responseToSend);

        console.log(responseToSend);
        console.log(responseToSend['scan_date']);
        console.log("Done!");
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Proxy server is running on http://localhost:${port}`);
});

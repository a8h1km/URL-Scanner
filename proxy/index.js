import express from "express"
import cors from "cors"

const app = express()
const port = 3001;
const apiKey = 'c16d75cc089baa9c4b4a7ac5dfe0f1351c77908a41ce4479ecd2ac5cc0c98844';

app.use(cors())
app.use(express.json())

app.post('/scan-url', async (req, res) => {
    const url = req.body.url;
    console.log(url)
    try {
        const response = await fetch(`https://www.virustotal.com/vtapi/v2/url/scan?apikey=${apiKey}&url=${encodeURIComponent(url)}`, {
            method: 'POST',
        });
        const data = await response.json();
        const scanid = data.scan_id
        setTimeout(() => {
            console.log(scanid)
        }, 1500)
        const response2 = await fetch(`https://www.virustotal.com/vtapi/v2/url/report?apikey=${apiKey}&resource=${scanid}`, { method: 'POST' })
        const data2 = await response2.json()


        let resultMessage = "";
        if ('positives' in data2 && data2['response_code'] === 1) {
            if (data2["positives"] <= 0) {
                resultMessage = "NOT MALICIOUS";
            } else if (1 <= data2['positives'] && data2['positives'] <= 3) {
                resultMessage = "MAYBE MALICIOUS";
            } else if (data2['positives'] >= 4) {
                resultMessage = "MALICIOUS";
            }
        } else {
            resultMessage = "URL NOT FOUND";
        }

        res.json({ resultMessage })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Proxy server is running on http://localhost:${port}`);
});
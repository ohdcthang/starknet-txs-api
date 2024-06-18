import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {getTxsStarknet} from './txs/index.js'

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json({
    type: ['application/json', 'text/plain']
}))

app.get('/', function (_req, res) {
    res.send('Welcome to API')
})

app.get("/transaction", async (req, res) => {
    const params = req.query
  
    try {
        const txs = await getTxsStarknet(params)
        console.log("🚀 ~ app.get ~ txs:", txs)

        res.status(200).json(txs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.listen(8080, () => {
    console.log("listen")
});
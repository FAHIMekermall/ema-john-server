const express = require("express")
const { MongoClient, ServerApiVersion } = require("mongodb")
require("dotenv").config()
const cors = require("cors")
const port = process.env.PORT || 4000
const app = express()
app.use(cors())
app.use(express())

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.9iutd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
})
const run = async () => {
	try {
		await client.connect()
		const productsCollection = client.db("ema_john").collection("product")
		app.get("/products", async (req, res) => {
			const {
				query: { page, productCount },
			} = req
            console.log(page);
            console.log(productCount, page)
		})
	} finally {
		// console.log('final');
	}
}

run().catch(console.dir)

app.listen(port)

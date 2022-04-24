const express = require("express")
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb")
require("dotenv").config()
const cors = require("cors")
const port = process.env.PORT || 4000
const app = express()
app.use(cors())
app.use(express.json())

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
			const cursor = await productsCollection.find({})

			if (page && productCount) {
				const product = await cursor
					.skip(+page * +productCount)
					.limit(+productCount)
					.toArray()
				res.send(product)
			} else {
				const product = await cursor.toArray()
				res.send(product)
			}
		})
		app.get("/productCount", async (req, res) => {
			const count = await productsCollection.countDocuments()
			// console.log(count)
			res.send({ count })
		})
		app.post('/productsById', async (req, res) => {
			const keys = req.body
			const ids = keys.map( key => ObjectId(key) )
			const query = { _id:{$in: ids}}
			const cursor = productsCollection.find(query)
			const result = await cursor.toArray()
			res.send(result)
		})
	} finally {
		// console.log('final');
	}
}

run().catch(console.dir)

app.listen(port)

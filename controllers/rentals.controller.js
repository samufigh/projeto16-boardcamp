import { db } from "../src/database/database.connection.js"
import dayjs from "dayjs"

export async function getRentals(req, res) {
    try {
      const rentals = await db.query(
        `SELECT rentals.*, TO_CHAR(rentals."rentDate", 'YYYY-MM-DD') AS "rentDate",  TO_CHAR(rentals."returnDate", 'YYYY-MM-DD') AS "returnDate", JSON_BUILD_OBJECT('id', customers.id, 'name', customers.name) AS customer, JSON_BUILD_OBJECT('id', games.id, 'name', games.name) AS game FROM rentals 
        JOIN customers ON rentals."customerId" = customers.id 
        LEFT JOIN games ON rentals."gameId" = games.id;`
      );
      res.send(rentals.rows);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

export async function postRentals(req, res) {
        const { customerId, gameId, daysRented } = req.body
        const rentDate = dayjs().format("YYYY-MM-DD")
    try {
        if (daysRented <= 0) return res.sendStatus(400)
        
        const existingCostumer = await db.query(
            `SELECT id FROM customers WHERE id = $1;`, [customerId]
        );
        if (!existingCostumer.rows[0])
        return res.status(400).send("Cliente não existe");

        const exisitingGame = await db.query(
            `SELECT id, "stockTotal" FROM games WHERE id = $1;`,
            [gameId]
        );
        if (!exisitingGame.rows[0]) return res.status(400).send("Jogo não existe")
        
        if (exisitingGame.rows[0].stockTotal === 0)
        return res.status(400).send("Jogo sem estoque")
        
        const gamePrice = await db.query(
            `SELECT "pricePerDay" FROM games WHERE id=$1`,
            [gameId]
        );
        const price = gamePrice.rows[0].pricePerDay
        const originalPrice = price * daysRented

        await db.query(`
            INSERT INTO 
            rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate" , "originalPrice", "delayFee") 
            VALUES ($1, $2, $3, $4, null, $5, null)`, [customerId, gameId, rentDate, daysRented, originalPrice]
          )

        await db.query(`
            UPDATE games 
            SET "stockTotal" = $1 
            WHERE id=$2`, [exisitingGame.rows[0].stockTotal - 1, gameId])

        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}
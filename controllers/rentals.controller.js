import { db } from "../src/database/database.connection.js"
import dayjs from "dayjs"

export async function postRentals(req, res) {
        const { customerId, gameId, daysRented } = req.body;
        const rentDate = dayjs().format("YYYY-MM-DD");
    try {
        // verifica se os dias alugados são > 0
        if (daysRented <= 0) return res.sendStatus(400);
        
        // verifica se o cliente existe
        const existingCostumer = await db.query(
            `SELECT id FROM customers WHERE id = $1;`, [customerId]
        );
        if (!existingCostumer.rows[0])
        return res.status(400).send("Cliente não existe");

        //verifica se o jogo existe
        const exisitingGame = await db.query(
            `SELECT id, "stockTotal" FROM games WHERE id = $1;`,
            [gameId]
        );
        if (!exisitingGame.rows[0]) return res.status(400).send("Jogo não existe");
        
        //verifica se o jogo selecionado tem estoque
        if (exisitingGame.rows[0].stockTotal === 0)
        return res.status(400).send("Jogo sem estoque");
        
        // calcula o valor do aluguel
        const gamePrice = await db.query(
            `SELECT "pricePerDay" FROM games WHERE id=$1`,
            [gameId]
        );
        const price = gamePrice.rows[0].pricePerDay;
        const originalPrice = price * daysRented;

        await db.query(
            `INSERT INTO 
            rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate" , "originalPrice", "delayFee") 
            VALUES ($1, $2, $3, $4, null, $5, null)`, [customerId, gameId, rentDate, daysRented, originalPrice]
          );

        await db.query(`UPDATE games SET "stockTotal" = $1 WHERE id=$2`, [
            exisitingGame.rows[0].stockTotal - 1,
            gameId,
        ]);

        res.send("foi")
    } catch (err) {
        res.status(500).send(err.message)
    }
}
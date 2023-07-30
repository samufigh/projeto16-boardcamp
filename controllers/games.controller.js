import { db } from "../src/database/database.connection.js"

export async function getGames(req, res){
    try {
        const games = await db.query(`SELECT * FROM games;`)
        res.send(games.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function postGames(req, res){
    try {
        const {name, image, stockTotal, pricePerDay} = req.body
        const games = await db.query(`SELECT name FROM games;`)
        let exist = false
        games.rows.forEach(game => {
            if (game.name===name){
                exist = true
            }
        })  
        if(exist) return res.status(409).send("nome já existe") 

        await db.query(`
        INSERT INTO games 
        (name, image, "stockTotal", "pricePerDay")
        VALUES
        ($1, $2, $3, $4);`, [name, image, stockTotal, pricePerDay])           
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}
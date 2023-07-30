import { db } from "../src/database/database.connection.js"

export async function getCustomers(req, res) {
    try {
        const customers = await db.query(`SELECT 
        id, name, phone, cpf, to_char(birthday, 'YYYY-MM-DD') AS birthday 
        FROM customers;`)

        res.send(customers.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function postCustomers(req, res) {
    try {
        const { name, phone, cpf, birthday } = req.body;

        const existing = await db.query(`SELECT cpf FROM customers WHERE cpf = $1;`, [cpf])
        console.log(existing.rows[0]);

        if(existing.rows[0])
            return res.status(409).send("CPF já cadastrado!");

        await db.query(`
        INSERT INTO customers 
        (name, phone, cpf, birthday)
        VALUES
        ($1, $2, $3, $4);`, [name, phone, cpf, birthday])
        res.send(req.body)
    } catch (err) {
        res.status(500).send(err.message)
    }
}
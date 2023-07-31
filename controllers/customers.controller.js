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

export async function getCustomer(req, res) {
    try {
        const {id} = req.params;
        console.log(id);
        const customer = await db.query(`SELECT 
        id, name, phone, cpf, to_char(birthday, 'YYYY-MM-DD') AS birthday 
        FROM customers
        WHERE 
        id = $1;`, [id])

        if(!customer.rows[0])
            return res.sendStatus(404)

        res.send(customer.rows[0])
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function postCustomers(req, res) {
    try {
        const { name, phone, cpf, birthday } = req.body;

        const existing = await db.query(`SELECT cpf FROM customers WHERE cpf = $1;`, [cpf])

        if(existing.rows[0])
            return res.status(409).send("CPF já cadastrado!");

        await db.query(`
        INSERT INTO customers 
        (name, phone, cpf, birthday)
        VALUES
        ($1, $2, $3, $4);`, [name, phone, cpf, birthday])
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function putCustomer(req, res) {
    try {
        const { name, phone, cpf, birthday } = req.body;
        const { id } = req.params;

        const existing = await db.query(`SELECT cpf FROM customers WHERE cpf = $1;`, [cpf])
        const userCPF = await db.query(`SELECT cpf FROM customers WHERE id = $1;`, [id])

        if(existing.rows[0] && userCPF.rows[0].cpf !== cpf)
            return res.status(409).send("CPF já cadastrado!");

        await db.query(`
        UPDATE customers 
        SET 
        name = $1, phone = $2, cpf = $3, birthday= $4 WHERE id = $5;`, [name, phone, cpf, birthday, id])
        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
}
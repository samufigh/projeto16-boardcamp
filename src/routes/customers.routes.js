import { Router } from "express"
import { getCustomer, getCustomers, postCustomers } from "../../controllers/customers.controller.js"
import { validateSchema } from "../middlewares/validateSchema.js"
import { schemaCustomers } from "../../schemas/customers.schemas.js"

const customersRouter = Router()

customersRouter.get("/customers", getCustomers)
customersRouter.get("/customers/:id", getCustomer)
customersRouter.post("/customers", validateSchema(schemaCustomers), postCustomers)

export default customersRouter
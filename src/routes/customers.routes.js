import { Router } from "express"
import { getCustomers, postCustomers } from "../../controllers/customers.controller.js"
import { validateSchema } from "../middlewares/validateSchema.js"
import { schemaCustomers } from "../../schemas/customers.schemas.js"

const customersRouter = Router()

customersRouter.get("/customers", getCustomers)
customersRouter.post("/customers", validateSchema(schemaCustomers), postCustomers)

export default customersRouter
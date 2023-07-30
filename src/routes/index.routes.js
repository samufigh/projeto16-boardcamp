import { Router } from "express"
import gamesRouter from "./games.routes.js"
import customersRouter from "./customers.routes.js"
import renralsRouter from "./rentals.routes.js"

const router = Router()
router.use(gamesRouter)
router.use(customersRouter)
router.use(renralsRouter)

export default router
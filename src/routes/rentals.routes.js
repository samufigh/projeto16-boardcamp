import { Router } from "express"
import { postRentals } from "../../controllers/rentals.controller.js";

const renralsRouter = Router()

renralsRouter.post("/rentals", postRentals);

export default renralsRouter;
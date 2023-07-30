import { Router } from "express"
import { getGames, postGames } from "../../controllers/games.controller.js"
import { schemaGames } from "../../schemas/games.schemas.js"
import { validateSchema } from "../middlewares/validateSchema.js"

const gamesRouter = Router()

gamesRouter.get("/games", getGames)
gamesRouter.post("/games", validateSchema(schemaGames), postGames)

export default gamesRouter
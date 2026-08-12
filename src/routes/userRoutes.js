
import { Router } from "express";
import { getAbout, getHome, postUser,loginUser,singleUser,deleteUser} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router()

router.get("/", getHome).get("/about", getAbout).post('/signup', postUser).post("/login", loginUser).get("/user/:id",authMiddleware, singleUser,).delete("/delete-user/:id",authMiddleware,deleteUser)

export default router;
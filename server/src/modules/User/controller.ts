import baseController from "@/common/controllers/handlers";
import { UserModel } from "./model";

export const userController = {
    ...baseController(UserModel)
}
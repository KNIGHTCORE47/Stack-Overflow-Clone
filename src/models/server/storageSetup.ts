import { Permission } from "node-appwrite";

import { questionAttatchmentBucket } from '../name'
import { storage } from './config'


export default async function getOrCreateStorage() {
    try {
        await storage.getBucket(questionAttatchmentBucket);
        console.log("Storage connected");

    } catch (error) {
        try {
            await storage.createBucket(
                questionAttatchmentBucket,
                questionAttatchmentBucket,
                [
                    Permission.read("any"),
                    Permission.create("users"),
                    Permission.read("users"),
                    Permission.update("users"),
                    Permission.delete("users")
                ],
                false,
                undefined,
                undefined,
                ["jpg", "png", "gif", "jpeg", "webp", "heic"]
            );
            console.log("Storage created");
            console.log("Storage connected");
        } catch (error) {
            console.log("Error: Unable to create Storage", error);
        }
    }
}


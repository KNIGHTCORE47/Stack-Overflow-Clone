import { Permission } from 'node-appwrite'

import { db, answerCollection } from '../name'
import { databases } from './config'

export default async function createAnswerCollection() {
    //NOTE - Create Collections
    await databases.createCollection(db, answerCollection, answerCollection, [
        Permission.read("any"),
        Permission.create("users"),
        Permission.read("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ])
    console.log("Answer collection is created");



    //NOTE - Create attributes
    await Promise.all([
        databases.createStringAttribute(db, answerCollection, "content", 10000, true),
        databases.createStringAttribute(db, answerCollection, "questionId", 100, true),
        databases.createStringAttribute(db, answerCollection, "authorId", 50, true)
    ])
    console.log("Answer attributes are created");

}
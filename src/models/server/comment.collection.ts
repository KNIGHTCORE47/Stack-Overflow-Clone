import { Permission } from 'node-appwrite'

import { db, commentCollection } from '../name'
import { databases } from './config'

export default async function createCommentCollection() {
    //NOTE - Create Collections
    await databases.createCollection(db, commentCollection, commentCollection, [
        Permission.read("any"),
        Permission.create("users"),
        Permission.read("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ]);
    console.log("Comment collection is created");



    //NOTE - Create attributes
    await Promise.all([
        databases.createEnumAttribute(db, commentCollection, "type", ["answer", "question"], true),
        databases.createStringAttribute(db, commentCollection, "content", 10000, true),
        databases.createStringAttribute(db, commentCollection, "typeId", 100, true),
        databases.createStringAttribute(db, commentCollection, "authorId", 50, true)
    ]);
    console.log("Comment attributes are created");

}

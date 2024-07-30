import { IndexType, Permission } from 'node-appwrite'

import { db, questionCollection } from '../name'
import { databases } from './config'


export default async function createQuestionCollection() {
    //NOTE - Create Collections 
    await databases.createCollection(db, questionCollection, questionCollection, [
        Permission.read("any"),
        Permission.create("users"),
        Permission.read("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ]);
    console.log("Question collection is created");



    //NOTE - Create attributes
    await Promise.all([
        databases.createStringAttribute(db, questionCollection, "title", 100, true),
        databases.createStringAttribute(db, questionCollection, "content", 10000, true),
        databases.createStringAttribute(db, questionCollection, "authorId", 50, true),
        databases.createStringAttribute(db, questionCollection, "tags", 50, true, undefined, true),
        databases.createStringAttribute(db, questionCollection, "attachmentId", 50, false),
    ]);
    console.log("Question attribute is created");



    //NOTE - Create Indexes
    await Promise.all([
        databases.createIndex(db, questionCollection, "title", IndexType.Fulltext, ["title"], ["ASC"]),
        databases.createIndex(db, questionCollection, "content", IndexType.Fulltext, ["content"], ["ASC"])
    ])


}
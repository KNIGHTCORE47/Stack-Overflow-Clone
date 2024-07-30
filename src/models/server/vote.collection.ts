import { Permission } from 'node-appwrite'

import { db, voteCollection } from '../name'
import { databases } from './config'

export default async function createVoteCollection() {
    //NOTE - Create Collections
    await databases.createCollection(db, voteCollection, voteCollection, [
        Permission.read("any"),
        Permission.create("users"),
        Permission.read("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ])
    console.log("Vote collection is created");



    //NOTE - Create attributes
    await Promise.all([
        databases.createStringAttribute(db, voteCollection, "votedById", 50, true),
        databases.createStringAttribute(db, voteCollection, "typeId", 100, true),
        databases.createEnumAttribute(db, voteCollection, "type", ["answer", "question"], true),
        databases.createEnumAttribute(db, voteCollection, "voteStatus", ["upvoted", "downvoted"], true)
    ])
    console.log("Vote attributes are created");

}
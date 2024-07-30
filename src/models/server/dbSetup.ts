import { db } from '../name'
import createAnswerCollection from './answer.collection'
import createQuestionCollection from './question.collection'
import createCommentCollection from './comment.collection'
import createVoteCollection from './vote.collection'


import { databases } from './config'

export default async function getOrCreateDB() {
    try {
        await databases.get(db)
        console.log("Database connected");
    } catch (error) {
        try {
            await databases.create(db, db)
            console.log("Database created");

            await Promise.all([
                createQuestionCollection(),
                createAnswerCollection(),
                createCommentCollection(),
                createVoteCollection()
            ])
            console.log("Database collection created");
            console.log("Database connected");
        } catch (error) {
            console.log("Database or database collection creation failed", error);
        }
    }
    return databases;
}
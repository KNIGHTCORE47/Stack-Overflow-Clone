import { answerCollection, db, questionCollection, voteCollection } from '@/models/name'
import { databases, users } from '@/models/server/config'
import { UserPrefs } from '@/store/Auth'
import { NextRequest, NextResponse } from 'next/server'
import { ID, Query } from 'node-appwrite'

export async function POST(request: NextRequest) {
    try {
        //Grab the data
        const { votedById, type, voteStatus, typeId } = await request.json()


        //List-documents
        const response = await databases.listDocuments(
            db, voteCollection,
            [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("votedById", votedById)
            ]
        )

        if (response.documents.length > 0) {
            await databases.deleteDocument(db, voteCollection, response.documents[0].$id)

            //Decrease the reputation of the question/answer author
            const QuestionOrAnswer = await databases.getDocument(
                db,
                type === "question" ? questionCollection : answerCollection,
                typeId
            )


            const authorPrefs = await users.getPrefs<UserPrefs>(QuestionOrAnswer.authorId)


            await users.updatePrefs<UserPrefs>(QuestionOrAnswer.authorId, {
                reputation: response.documents[0]?.voteStatus === "upvoted" ? Number(authorPrefs.reputation) - 1 : Number(authorPrefs.reputation) + 1
            })
        }

        //NOTE - That means previous vote does not exist or status changes
        if (response.documents[0]?.voteStatus !== voteStatus) {
            const document = await databases.createDocument(
                db, voteCollection, ID.unique(),
                {
                    type,
                    typeId,
                    voteStatus,
                    votedById
                }
            )


            //Increase or decrease the reputation of the question/answer author accordingly
            const QuestionOrAnswer = await databases.getDocument(
                db,
                type === "question" ? questionCollection : answerCollection,
                typeId
            );


            const authorPrefs = await users.getPrefs<UserPrefs>(QuestionOrAnswer.authorId)


            //NOTE - if vote was present
            if (response.documents[0]) {
                await users.updatePrefs<UserPrefs>(QuestionOrAnswer.authorId, {
                    //NOTE - that means previous vote was "upvoted" and new value is "downvoted" so we have to decrease the reputation
                    reputation: response.documents[0].voteStatus === "upvoted" ? Number(authorPrefs.reputation) - 1 : Number(authorPrefs.reputation) + 1
                })
            } else {
                await users.updatePrefs<UserPrefs>(QuestionOrAnswer.authorId, {
                    //NOTE - that means previous vote was "upvoted" and new value is "downvoted" so we have to decrease the reputation
                    reputation: voteStatus === "upvoted" ? Number(authorPrefs.reputation) + 1 : Number(authorPrefs.reputation) - 1
                })
            }

            const [upvotes, downvotes] = await Promise.all(
                [
                    databases.listDocuments(db, voteCollection,
                        [
                            Query.equal("type", type),
                            Query.equal("typeId", typeId),
                            Query.equal("voteStatus", "upvoted"),
                            Query.equal("votedById", votedById),
                            Query.limit(1)
                        ]
                    ),
                    databases.listDocuments(db, voteCollection,
                        [
                            Query.equal("type", type),
                            Query.equal("typeId", typeId),
                            Query.equal("voteStatus", "downvoted"),
                            Query.equal("votedById", votedById),
                            Query.limit(1)
                        ]
                    ),
                ]
            )


            return NextResponse.json(
                {
                    data: {
                        document: document,
                        voteResult: upvotes.total = downvotes.total
                    },
                    message: response.documents[0] ? "Vote Status Updated" : "Voted"
                },
                {
                    status: 201
                }
            )
        }


        const [upvotes, downvotes] = await Promise.all(
            [
                databases.listDocuments(db, voteCollection,
                    [
                        Query.equal("type", type),
                        Query.equal("typeId", typeId),
                        Query.equal("voteStatus", "upvoted"),
                        Query.equal("votedById", votedById),
                        Query.limit(1)
                    ]
                ),
                databases.listDocuments(db, voteCollection,
                    [
                        Query.equal("type", type),
                        Query.equal("typeId", typeId),
                        Query.equal("voteStatus", "downvoted"),
                        Query.equal("votedById", votedById),
                        Query.limit(1)
                    ]
                ),
            ]
        )


        return NextResponse.json(
            {
                data: {
                    document: null,
                    voteResult: upvotes.total = downvotes.total
                },
                message: "Vote Withdrawn"
            },
            {
                status: 200
            }
        )


    } catch (error: any) {
        return NextResponse.json(
            {
                error: error?.message || "Error deleting answer"
            },
            {
                status: error?.status || error?.code || 500
            }
        )
    }
}
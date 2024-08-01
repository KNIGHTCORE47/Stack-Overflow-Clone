import { answerCollection, db } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

import { UserPrefs } from '@/store/Auth'

export async function POST(request: NextRequest) {
    try {
        const { content, authorId, questionId } = await request.json();

        const response = await databases.createDocument(
            db, answerCollection, ID.unique(),
            {
                content, authorId, questionId
            }
        )

        //Increase Author reputation
        const prefs = await users.getPrefs<UserPrefs>(authorId)
        await users.updatePrefs<UserPrefs>(
            authorId,
            {
                reputation: Number(prefs.reputation) + 1
            }
        )

        return NextResponse.json(
            response,
            {
                status: 201
            }
        )

    } catch (error: any) {
        return NextResponse.json(
            {
                error: error?.message || "Error creating answer"
            },
            {
                status: error?.status || error?.code || 500
            }
        )
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { answerId } = await request.json()

        const answer = await databases.getDocument(db, answerCollection, answerId)

        if (!answer) {
            return "Answer field is empty"
        }

        const response = await databases.deleteDocument(db, answerCollection, answerId)



        //Decrease Author reputation
        const prefs = await users.getPrefs<UserPrefs>(answer.authorId)
        await users.updatePrefs<UserPrefs>(
            answer.authorId,
            {
                reputation: Number(prefs.reputation) - 1
            }
        )


        return NextResponse.json(
            { data: response },
            { status: 200 }
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
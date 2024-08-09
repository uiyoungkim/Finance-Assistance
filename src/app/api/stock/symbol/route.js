// app/api/stock/symbol/route.js

import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const companyName = searchParams.get("companyName");

    if (!companyName) {
        return NextResponse.json(
            { error: "Company name is required" },
            { status: 400 }
        );
    }

    try {
        const response = await fetch(
            `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${companyName}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch data from Alpha Vantage");
        }

        const data = await response.json();

        if (data.bestMatches.length === 0) {
            return NextResponse.json(
                { error: "No symbol found for the company name" },
                { status: 404 }
            );
        }

        const symbol = data.bestMatches[0]["1. symbol"];
        return NextResponse.json({ symbol }, { status: 200 });
    } catch (error) {
        console.error("Error fetching symbol:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

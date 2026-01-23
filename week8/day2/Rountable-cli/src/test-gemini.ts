import "dotenv/config";

async function testWithFetch() {
    const baseUrl = "https://generativelanguage.googleapis.com/v1beta/openai/";
    const url = `${baseUrl}chat/completions`;
    const key = process.env.OPENAI_API_KEY;

    console.log("Testing with models/gemini-1.5-flash...");

    const body = {
        model: "models/gemini-3-flash-preview", // Adding models/ prefix
        messages: [{ role: "user", content: "Hello" }]
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${key}`
            },
            body: JSON.stringify(body)
        });

        console.log("Status:", response.status);
        const text = await response.text();
        console.log("Raw Response:", text);
    } catch (error: any) {
        console.error("Fetch Error:", error.message);
    }
}

testWithFetch();

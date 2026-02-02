const executionContext = {
    lastToolResult: [
        { name: "Virat Kohli", runs: 12000, average: 59.3 },
        { name: "Sachin Tendulkar", runs: 18426, average: 44.8 }
    ]
};

const answer = "Here are the top run scorers.";

let payload = { type: 'text', text: answer };
const data = executionContext.lastToolResult;

if (Array.isArray(data) && data.length > 1) {
    const columns = Object.keys(data[0]).filter(k => k !== '_id' && k !== '__v' && k !== 'metadata');
    payload = {
        type: 'table',
        text: answer,
        columns,
        rows: data.map(row => columns.map(col => row[col]))
    };
}

console.log("Generated Payload:");
console.log(JSON.stringify(payload, null, 2));

if (payload.type === 'table' && payload.columns.length > 0 && payload.rows.length === 2) {
    console.log("TEST PASS: Table payload correctly generated for multiple rows.");
} else {
    console.log("TEST FAIL: Table payload generation failed logic check.");
}

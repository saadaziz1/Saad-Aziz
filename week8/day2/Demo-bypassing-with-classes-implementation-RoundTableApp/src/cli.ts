import "dotenv/config";
import readline from "readline";
import { runRoundtable } from "./roundtable.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  console.log("=========================================");
  console.log("       LLM ROUND TABLE CLI (FREE)        ");
  console.log("=========================================");
  console.log("Type your question to start the discussion.");
  console.log("(Type 'exit' or press Ctrl+C to quit)\n");

  const askQuestion = () => {
    rl.question("❓ Question: ", async (input) => {
      const trimmedInput = input.trim();

      if (trimmedInput.toLowerCase() === "exit") {
        console.log("Goodbye! 👋");
        process.exit(0);
      }

      if (!trimmedInput) {
        askQuestion();
        return;
      }

      try {
        const answer = await runRoundtable(trimmedInput);
        console.log("\n🏆 ROUNDTABLE FINAL ANSWER:\n");
        console.log("-----------------------------------------");
        console.log(answer);
        console.log("-----------------------------------------\n");
      } catch (error) {
        console.error("❌ Error during discussion:", error);
      }

      askQuestion();
    });
  };

  askQuestion();
}

main().catch(err => {
  console.error("Fatal Error:", err);
  process.exit(1);
});

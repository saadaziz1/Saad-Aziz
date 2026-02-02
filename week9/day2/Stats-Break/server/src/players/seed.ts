import * as fs from 'fs';
import * as path from 'path';
const csv = require('csv-parser');
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/stats-break';

// Define Schemas locally for the script to avoid NestJS dependency issues during standalone run
const PlayerSchema = new mongoose.Schema({
    name: String,
    format: String,
    matches: Number,
    innings: Number,
    runs: Number,
    highestScore: String,
    average: Number,
    strikeRate: Number,
    hundreds: Number,
    fifties: Number,
    wickets: Number,
    bestBowling: String,
    metadata: Object
}, { timestamps: true });

const MatchSchema = new mongoose.Schema({
    team1: String,
    team2: String,
    format: String,
    date: Date,
    venue: String,
    result: String,
    metadata: Object
}, { timestamps: true });

const Player = mongoose.model('Player', PlayerSchema);
const Match = mongoose.model('Match', MatchSchema);

async function seedPlayers() {
    const players: any[] = [];
    const filePath = path.join(__dirname, '../../data/players.csv');

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                players.push({
                    name: data.name,
                    format: data.format,
                    matches: parseInt(data.matches) || 0,
                    innings: parseInt(data.innings) || 0,
                    runs: parseInt(data.runs) || 0,
                    highestScore: data.highestScore,
                    average: parseFloat(data.average) || 0,
                    strikeRate: parseFloat(data.strikeRate) || 0,
                    hundreds: parseInt(data.hundreds) || 0,
                    fifties: parseInt(data.fifties) || 0,
                    wickets: parseInt(data.wickets) || 0,
                    bestBowling: data.bestBowling,
                    metadata: {}
                });
            })
            .on('end', async () => {
                try {
                    console.log(`[Seeder] Loaded ${players.length} players from CSV.`);
                    await Player.deleteMany({});
                    await Player.insertMany(players);
                    console.log(`[Seeder] Successfully seeded Players collection.`);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            });
    });
}

async function seedMatches() {
    const matches: any[] = [];
    const filePath = path.join(__dirname, '../../data/matches.csv');

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                matches.push({
                    team1: data.team1,
                    team2: data.team2,
                    format: data.format,
                    date: new Date(data.date),
                    venue: data.venue,
                    result: data.result,
                    metadata: {}
                });
            })
            .on('end', async () => {
                try {
                    console.log(`[Seeder] Loaded ${matches.length} matches from CSV.`);
                    await Match.deleteMany({});
                    await Match.insertMany(matches);
                    console.log(`[Seeder] Successfully seeded Matches collection.`);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            });
    });
}

async function run() {
    try {
        console.log(`[Seeder] Connecting to MongoDB: ${MONGO_URI}`);
        await mongoose.connect(MONGO_URI);
        console.log(`[Seeder] Connected.`);

        await seedPlayers();
        await seedMatches();

        console.log(`[Seeder] Seeding completed successfully.`);
    } catch (err) {
        console.error(`[Seeder] Error:`, err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

run();

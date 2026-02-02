import * as fs from 'fs';
import * as path from 'path';
const csv = require('csv-parser');
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/stats-break';

// Metadata Schema to help AI understand collections
const MetadataSchema = new mongoose.Schema({
    collectionName: String,
    originalFile: String,
    columns: [String],
    description: String,
    rowCount: Number,
}, { timestamps: true });

const Metadata = mongoose.model('Metadata', MetadataSchema);

function sanitizeCollectionName(filename: string): string {
    return filename
        .replace(/\.csv$/i, '')
        .replace(/[^a-zA-Z0-9]/g, '_')
        .replace(/_+/g, '_')
        .toLowerCase();
}

async function processCSV(filePath: string): Promise<{ data: any[], headers: string[] }> {
    const results: any[] = [];
    let headers: string[] = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('headers', (h: string[]) => {
                headers = h;
            })
            .on('data', (data: any) => results.push(data))
            .on('end', () => resolve({ data: results, headers }))
            .on('error', (err: any) => reject(err));
    });
}

async function run() {
    try {
        console.log(`[Seeder] Connecting to MongoDB: ${MONGO_URI}`);
        await mongoose.connect(MONGO_URI);
        console.log(`[Seeder] Connected.`);

        const dataDir = path.join(__dirname, '../../data');
        const files = fs.readdirSync(dataDir).filter(f => f.toLowerCase().endsWith('.csv'));

        console.log(`[Seeder] Found ${files.length} CSV files.`);

        // Clear previous metadata
        await Metadata.deleteMany({});

        for (const file of files) {
            const collectionName = sanitizeCollectionName(file);
            const filePath = path.join(dataDir, file);

            console.log(`[Seeder] Processing ${file} -> ${collectionName}...`);

            const { data, headers } = await processCSV(filePath);

            if (data.length === 0) {
                console.log(`[Seeder] Skipping empty file: ${file}`);
                continue;
            }

            // Create model on the fly or use direct connection
            const db = mongoose.connection.db;
            if (!db) throw new Error('DB connection not established');

            const collection = db.collection(collectionName);
            await collection.deleteMany({});
            await collection.insertMany(data);

            // Security & Performance: Automatic Indexing
            const indexFields = ['Player', 'player_name', 'name', 'Team', 'team1', 'team2', 'venue', 'format'];
            const actualColumns = headers.map(h => h.trim());
            const fieldsToIndex = indexFields.filter(f => actualColumns.includes(f));

            for (const field of fieldsToIndex) {
                await collection.createIndex({ [field]: 1 });
            }

            // Save Metadata
            await Metadata.create({
                collectionName,
                originalFile: file,
                columns: headers,
                rowCount: data.length,
                description: `Raw data from ${file}`
            });

            console.log(`[Seeder] Seeded ${data.length} rows into ${collectionName} with ${fieldsToIndex.length} indexes`);
        }

        console.log(`[Seeder] All files seeded successfully.`);
    } catch (err) {
        console.error(`[Seeder] Error during seeding:`, err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

run();

import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Player, PlayerDocument } from './schemas/player.schema';
import { Match, MatchDocument } from './schemas/match.schema';

@Injectable()
export class PlayersService {
    private readonly logger = new Logger(PlayersService.name);

    constructor(
        @InjectConnection() private connection: Connection,
        @InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
        @InjectModel(Match.name) private matchModel: Model<MatchDocument>,
    ) { }

    async getMetadata(): Promise<any[]> {
        try {
            const db = this.connection.db;
            if (!db) return [];
            return await db.collection('metadatas').find().toArray();
        } catch (err) {
            this.logger.error('Failed to fetch metadata', err);
            return [];
        }
    }

    async executeQuery(query: { filter: any, sort?: any, limit?: number, collection?: string, projection?: any }): Promise<any[]> {
        try {
            const collectionName = query.collection || 'players';
            this.logger.debug(`Executing Dynamic Query on ${collectionName}: ${JSON.stringify(query)}`);

            const db = this.connection.db;
            if (!db) throw new Error('Database connection not available');

            // Security: Collection Whitelisting
            const meta = await db.collection('metadatas').findOne({ collectionName });
            const isStandard = ['players', 'matches'].includes(collectionName);

            if (!meta && !isStandard) {
                this.logger.warn(`Unauthorized collection access blocked: ${collectionName}`);
                return [];
            }

            const collection = db.collection(collectionName);

            return await collection
                .find(query.filter)
                .project(query.projection || {})
                .sort(query.sort || {})
                .limit(Math.min(query.limit || 10, 50)) // Enforce hard cap
                .maxTimeMS(5000) // Prevent long-running queries (5s timeout)
                .toArray();
        } catch (err) {
            this.logger.error(`Dynamic Query on ${query.collection} Failed`, err);
            return [];
        }
    }
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersService } from './players.service';
import { Player, PlayerSchema } from './schemas/player.schema';
import { Match, MatchSchema } from './schemas/match.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Player.name, schema: PlayerSchema },
            { name: Match.name, schema: MatchSchema },
        ]),
    ],
    providers: [PlayersService],
    exports: [
        PlayersService,
        MongooseModule.forFeature([
            { name: Player.name, schema: PlayerSchema },
            { name: Match.name, schema: MatchSchema },
        ])
    ],
})
export class PlayersModule { }

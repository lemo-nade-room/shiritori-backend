import { RoomRecords } from "../models/game/roomRecords.ts"

export interface RoomRecordRepository {
    fetch(roomId: string): RoomRecords
    add(roomId: string, playerName: string, text: string): void
    remove(roomId: string): void
}
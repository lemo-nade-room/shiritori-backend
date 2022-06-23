import { RoomRecordRepository } from "../roomRecordRepository.ts"
import { RoomRecords } from "../../models/game/roomRecords.ts"
import { RoomRecord } from "../../models/game/roomRecord.ts"

export class MemoryRoomRecordRepository implements RoomRecordRepository {

    public constructor(
        private records: { room: string, name: string, text: string, at: Date }[] = []
    ) {}

    public readonly fetch = (roomId: string): RoomRecords => {
        return new RoomRecords(
            this.records
                .filter(record => record.room === roomId)
                .map(record => new RoomRecord(record.name, record.text, record.at))
        )
    }

    public readonly add = (roomId: string, playerName: string, text: string): void => {
        this.records.push({
            room: roomId,
            name: playerName,
            text: text,
            at: new Date()
        })
    }

    public readonly remove = (roomId: string): void => {
        this.records = this.records.filter(record => record.room !== roomId)
    }
}
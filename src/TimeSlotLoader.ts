import {
  EventType,
  QueryAvailableTimeslotsArgs,
  TimeSlot,
} from './schema/types'

export interface TimeSlotResolver {
  name: string
  availableEventTypes: EventType[]
  resolve: (args: QueryAvailableTimeslotsArgs) => Promise<TimeSlot[]>
}
export default class TimeSlotLoader {
  private resolvers: TimeSlotResolver[]
  constructor(customResolvers: TimeSlotResolver[]) {
    this.resolvers = customResolvers
  }
  async loadAll(args: QueryAvailableTimeslotsArgs): Promise<TimeSlot[]> {
    const promises = this.resolvers.map((r) => r.resolve(args))
    const allResults = await Promise.all(promises)
    return allResults
      .flat()
      .filter(this.betweenStartAndEndTime(args))
      .sort(this.sortTimeSlotsByStartTime)
  }

  sortTimeSlotsByStartTime = (a: TimeSlot, b: TimeSlot) =>
    a.startTime.getTime() - b.startTime.getTime()

  betweenStartAndEndTime =
    (args: QueryAvailableTimeslotsArgs) => (event: TimeSlot) => {
      if (!args.from && !args.to) {
        return true
      }
      if (!args.from) {
        return event.startTime <= args.to
      }
      if (!args.to) {
        return event.startTime >= args.from
      }
      return event.startTime >= args.from && event.startTime <= args.to
    }

  availableEventTypesOf(locationName: string): EventType[] {
    const resolver = this.resolvers.find((r) => r.name === locationName)
    if (!resolver) {
      throw new Error(`No resolver for location ${locationName}`)
    }
    return resolver.availableEventTypes
  }
}

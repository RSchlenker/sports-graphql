import {
  EventType,
  EventTypeInput,
  Location,
  QueryAvailableTimeslotsArgs,
  TimeSlot,
} from './schema/types'

export interface TimeSlotResolver {
  name: string
  link: string
  availableEventTypes: EventType[]
  resolve: (args: QueryAvailableTimeslotsArgs) => Promise<TimeSlot[]>
}
export default class TimeSlotLoader {
  private resolvers: TimeSlotResolver[]
  constructor(customResolvers: TimeSlotResolver[]) {
    this.resolvers = customResolvers
  }
  async loadAll(args: QueryAvailableTimeslotsArgs): Promise<TimeSlot[]> {
    const promises = this.resolvers
      .filter(this.resolvesForEventType(args))
      .map((r) => r.resolve(args))
    const allResults = await Promise.all(promises)
    return allResults
      .flat()
      .filter(this.betweenStartAndEndTime(args))
      .sort(this.sortTimeSlotsByStartTime)
  }

  resolvesForEventType =
    (args: QueryAvailableTimeslotsArgs) => (resolver: TimeSlotResolver) => {
      if (args.type === EventTypeInput.All) {
        return true
      }
      const eventTypeStrings = resolver.availableEventTypes.map((e) =>
        e.valueOf(),
      )
      return eventTypeStrings.includes(args.type.valueOf())
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

  getLocations(): Location[] {
    return this.resolvers.map((r) => ({
      name: r.name,
      eventTypes: r.availableEventTypes,
      link: r.link,
    }))
  }
}

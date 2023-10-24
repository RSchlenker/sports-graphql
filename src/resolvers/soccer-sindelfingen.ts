import { EventType, QueryTimeslotsArgs, TimeSlot } from '../schema/types'
import axios from 'axios'
import { TimeSlotResolver } from '../TimeSlotLoader'

const NAME = 'SoccerSindelfingen'
export default class SoccerSindelfingenResolver implements TimeSlotResolver {
  availableEventTypes: EventType[] = [EventType.Soccer]
  name = NAME
  link = 'https://www.dieeventarena.de/home/fußball/'

  async resolve(args: QueryTimeslotsArgs): Promise<TimeSlot[]> {
    console.log('Loading Soccer Sindelfingen timeslots')
    return this.getEvents()
  }

  async getEvents() {
    const response = await axios.get('https://www.eversports.de/api/slot', {
      params: {
        facilityId: 68498,
        startDate: new Date().toISOString().split('T')[0],
        courts: [46402, 46403, 46404],
      },
    })
    return response.data.slots.map((slot: any): TimeSlot => {
      const startTime = new Date(
        `${slot.date} ${slot.start.substring(0, 2)}:${slot.start.substring(
          2,
          5,
        )}`,
      )
      return {
        startTime,
        endTime: new Date(startTime.getTime() + 15 * 60 * 1000),
        type: EventType.Soccer,
        location: {
          link: 'https://www.dieeventarena.de/home/fußball/',
          name: NAME,
          eventTypes: [EventType.Soccer],
        },
      }
    })
  }
}

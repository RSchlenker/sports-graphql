import axios from 'axios'
import {
  EventType,
  EventTypeInput,
  QueryTimeslotsArgs,
  TimeSlot,
} from '../schema/types'
import { TimeSlotResolver } from '../TimeSlotLoader'

const RESOLVER_NAME = 'Puls'
export default class PulsResolver implements TimeSlotResolver {
  public availableEventTypes = [EventType.Badminton, EventType.Squash]
  public link = 'https://www.puls-stuttgart.de/'
  public name = RESOLVER_NAME
  async resolve({ type }: QueryTimeslotsArgs): Promise<TimeSlot[]> {
    console.log('Loading puls timeslots')
    const eventTypes = await this.getEventTypes()
    let result: TimeSlot[] = []
    if (type === EventTypeInput.Badminton || type === EventTypeInput.All) {
      const badmintonEvents = await this.getBadmintonData(eventTypes)
      result = result.concat(badmintonEvents)
    }
    if (type === EventTypeInput.Squash || type === EventTypeInput.All) {
      const squashEvents = await this.getSquashData(eventTypes)
      result = result.concat(squashEvents)
    }
    return result
  }

  private async getSquashData(eventTypes: any): Promise<TimeSlot[]> {
    const idOfSquash = this.getSquashEventId(eventTypes)
    const squashEvents = await this.getEventsOf(idOfSquash)
    return squashEvents.map(this.eventToTimeslot)
  }
  private async getBadmintonData(eventTypes: any): Promise<TimeSlot[]> {
    const idOfBadminton = this.getBadmintonEventId(eventTypes)
    const badmintonEvents = await this.getEventsOf(idOfBadminton)
    return badmintonEvents.map(this.eventToTimeslot)
  }

  private eventToTimeslot(event: any): TimeSlot {
    return {
      startTime: getDateFromResponse(event.date),
      endTime: getDateFromResponse(event.dateE),
      type: event.kursname.includes('Squash')
        ? EventType.Squash
        : EventType.Badminton,
      location: {
        link: 'https://www.puls-stuttgart.de/',
        name: RESOLVER_NAME,
        eventTypes: [EventType.Badminton, EventType.Squash],
      },
    }
  }

  async getEventsOf(id: string) {
    const responseOfActualData = await axios.get(
      `https://connect.e-app.eu:57319/easyWeb.svc/GetMitarbeiterZeiten/puls-fit-und-wellnessclub-boschareal/null/${id}/null?callback=__ng_jsonp__.__req3.finished`,
    )
    const stripped = responseOfActualData.data
      .replace('__ng_jsonp__.__req3.finished(', '')
      .replace(');', '')
    return JSON.parse(stripped)
  }

  async getEventTypes() {
    const response = await axios.get(
      'https://connect.e-app.eu:57319/easyWeb.svc/GetTerminartenOTV/puls-fit-und-wellnessclub-boschareal/null/-1/null?callback=__ng_jsonp__.__req2.finished',
    )
    const strippedResponse = response.data
      .replace('__ng_jsonp__.__req2.finished(', '')
      .replace(');', '')
    return JSON.parse(strippedResponse)
  }

  getSquashEventId(eventTypes: any) {
    return eventTypes.filter((item: any) => {
      return item.dauer === 60 && item.name.includes('Squash')
    })[0].id
  }

  getBadmintonEventId(eventTypes: any) {
    return eventTypes.filter((item: any) => {
      return item.dauer === 60 && item.name.includes('Badminton')
    })[0].id
  }
}

function getDateFromResponse(responseString: string): Date {
  const time = responseString.replace('/Date(', '').replace(')/', '')
  const millisWithoutTimezone = time.split('+')[0]
  return new Date(+millisWithoutTimezone)
}

import { TimeSlotResolver } from '../TimeSlotLoader'
import { EventType, QueryTimeslotsArgs, TimeSlot } from '../schema/types'
import axios from 'axios'
import { GraphQLError } from 'graphql/error'

export default class SoccerOlympResolver implements TimeSlotResolver {
  availableEventTypes = [EventType.Soccer]
  name = 'SoccerOlymp'
  link = 'https://www.soccerolymp.de/'

  async resolve(args: QueryTimeslotsArgs): Promise<TimeSlot[]> {
    const courtsResponse = await axios.get(
      'https://booking.soccerolymp.de/api/court/getCourts',
    )
    const courts = JSON.parse(courtsResponse.data)
    const courtIds = courts.map((court: any) => court.Id)
    let allSlotResponses: any = []
    for (const court in courtIds) {
      try {
        let url = `https://booking.soccerolymp.de/api/court/getCourtList?CourtId=${courtIds[court]}`
        console.log(url)
        const response = await axios.get(url)
        allSlotResponses.push(response)
      } catch (e) {
        // console.error(e)
        throw new GraphQLError('Error while loading SoccerOlymp timeslots')
      }
    }
    const allSlots = allSlotResponses.map((response: any) =>
      JSON.parse(response.data),
    )
    console.log(allSlots)
    return Promise.resolve([])
  }
}

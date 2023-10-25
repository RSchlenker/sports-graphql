import { TimeSlotResolver } from '../TimeSlotLoader'
import { EventType, QueryTimeslotsArgs, TimeSlot } from '../schema/types'
import axios from 'axios'
import { GraphQLError } from 'graphql/error'

export default class SoccerOlympResolver implements TimeSlotResolver {
  availableEventTypes = [EventType.Soccer]
  name = 'SoccerOlymp'
  link = 'https://www.soccerolymp.de/'

  async resolve(args: QueryTimeslotsArgs): Promise<TimeSlot[]> {
    const courtIds = await this.getCourtIds()
    const now = new Date()
    let allSlotResponses: any = []
    for (const court in courtIds) {
      try {
        let url = `https://booking.soccerolymp.de/api/court/getCourtList?CourtId=${courtIds[court]}`
        console.log(`Loading SoccerOlymp court ${courtIds[court]}`)
        const resp = await axios.get(
          `https://booking.soccerolymp.de/api/court/getCourtList`,
          {
            params: {
              TimeCourt: true,
              dateString: getDateStringForApi(now),
              CourtId: courtIds[court],
            },
            headers: {
              Pragma: 'no-cache',
              'Cache-Control': 'no-cache',
              Cookie:
                'DateString=27.12.2023; OrderSession=b9a87013-9899-4ece-aef2-68886f1cd25f; CurrentCourt=256f5f96-2aa4-4e32-ce19-08d6ad1e1661',
            },
          },
        )
        allSlotResponses.push(JSON.parse(resp.data))
      } catch (e) {
        // console.error(e)
        throw new GraphQLError('Error while loading SoccerOlymp timeslots')
      }
    }
    return allSlotResponses
      .map((court: any) =>
        court.Bookings.filter(freeSlots).map((booking: any): TimeSlot => {
          const startTime = getDate(booking.Date)
          return {
            startTime,
            endTime: new Date(startTime.getTime() + 60 * 60 * 1000),
            type: EventType.Soccer,
            court: court.Name,
            location: {
              link: 'https://www.soccerolymp.de/',
              name: 'SoccerOlymp',
            },
          }
        }),
      )
      .flat()
  }

  private async getCourtIds() {
    const courtsResponse = await axios.get(
      'https://booking.soccerolymp.de/api/court/getCourts',
    )
    const courts = JSON.parse(courtsResponse.data)
    return courts.map((court: any) => court.Id)
  }
}

const getDateStringForApi = (date: Date) => {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

const freeSlots = (booking: any) => booking.BookingStat === 0

function getDate(dateString: string) {
  let date = new Date(dateString)
  if (dateString.includes('00:00:00')) {
    date = new Date(date.getTime() + 24 * 60 * 60 * 1000)
  }
  return date
}

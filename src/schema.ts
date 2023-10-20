import { createSchema } from 'graphql-yoga'
import * as fs from 'fs'
import TimeSlotLoader from './TimeSlotLoader'
import PulsResolver from './resolvers/puls'
import SoccerSindelfingenResolver from './resolvers/soccer-sindelfingen'
import { DateTimeResolver } from 'graphql-scalars'

const file = fs.readFileSync(__dirname + '/schema/schema.graphql', 'utf8')
const timeslotLoader = new TimeSlotLoader([
  new PulsResolver(),
  new SoccerSindelfingenResolver(),
])
export const schema = createSchema({
  typeDefs: file,
  resolvers: {
    DateTime: DateTimeResolver,
    Query: {
      availableTimeslots: async (parent, args, context) => {
        return await timeslotLoader.loadAll(args)
      },
    },
  },
})

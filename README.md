# Available courts API

This project aims to provide a simple API to get information about the available courts in the city of Stuttgart.
To start, simply run:
```
yarn install
yarn start
```
and visit http://localhost:4000/graphql to access the GraphQL playground.
The idea is, to continuously add moe resolvers under `src/resolvers`. All resolvers are automatically requested.

## Example query

```graphql
query MyQuery {
    timeslots(type: All) {
        location {
            name
        }
        startTime
        endTime
        type
    }
    locations {
        name
        link
        eventTypes
    }
}
```
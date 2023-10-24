# Sports GraphQL

This project aims to provide a simple API to get information about available sport-courts.
It currently supports squash, badminton and soccer courts of some locations in Stuttgart.
To start, simply run:

```
yarn install
yarn start
```

and visit http://localhost:4000/graphql to access the GraphQL playground.

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

## Contribute

If you are missing a resolver, feel free to add it under `src/resolvers`. All resolvers are automatically requested.

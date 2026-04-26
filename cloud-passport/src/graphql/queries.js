/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      email
      full_name
      major
      year
      intake
      member_id
      public_slug
      xp
      tier
      avatar_url
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        email
        full_name
        major
        year
        intake
        member_id
        public_slug
        xp
        tier
        avatar_url
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getEvent = /* GraphQL */ `
  query GetEvent($id: ID!) {
    getEvent(id: $id) {
      id
      name
      track
      xp_reward
      emoji
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listEvents = /* GraphQL */ `
  query ListEvents(
    $filter: ModelEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        track
        xp_reward
        emoji
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getAttendance = /* GraphQL */ `
  query GetAttendance($id: ID!) {
    getAttendance(id: $id) {
      id
      userID
      eventID
      timestamp
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listAttendances = /* GraphQL */ `
  query ListAttendances(
    $filter: ModelAttendanceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAttendances(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userID
        eventID
        timestamp
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const attendancesByUserID = /* GraphQL */ `
  query AttendancesByUserID(
    $userID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelAttendanceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    attendancesByUserID(
      userID: $userID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userID
        eventID
        timestamp
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const attendancesByEventID = /* GraphQL */ `
  query AttendancesByEventID(
    $eventID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelAttendanceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    attendancesByEventID(
      eventID: $eventID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userID
        eventID
        timestamp
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;

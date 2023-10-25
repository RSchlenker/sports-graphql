import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  DateTime: { input: any; output: any }
}

export type Query = {
  __typename?: 'Query'
  locations?: Maybe<Array<Maybe<Location>>>
  timeslots?: Maybe<Array<Maybe<TimeSlot>>>
}

export type QueryTimeslotsArgs = {
  from?: InputMaybe<Scalars['DateTime']['input']>
  location?: InputMaybe<Scalars['String']['input']>
  to?: InputMaybe<Scalars['DateTime']['input']>
  type: EventTypeInput
}

export enum EventType {
  Badminton = 'Badminton',
  Soccer = 'Soccer',
  Squash = 'Squash',
}

export enum EventTypeInput {
  All = 'All',
  Badminton = 'Badminton',
  Soccer = 'Soccer',
  Squash = 'Squash',
}

export type Location = {
  __typename?: 'location'
  eventTypes?: Maybe<Array<Maybe<EventType>>>
  link: Scalars['String']['output']
  name: Scalars['String']['output']
}

export type TimeSlot = {
  __typename?: 'timeSlot'
  court?: Maybe<Scalars['String']['output']>
  endTime: Scalars['DateTime']['output']
  location: Location
  startTime: Scalars['DateTime']['output']
  type: EventType
}

export type ResolverTypeWrapper<T> = Promise<T> | T

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>
  Query: ResolverTypeWrapper<{}>
  String: ResolverTypeWrapper<Scalars['String']['output']>
  eventType: EventType
  eventTypeInput: EventTypeInput
  location: ResolverTypeWrapper<Location>
  timeSlot: ResolverTypeWrapper<TimeSlot>
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output']
  DateTime: Scalars['DateTime']['output']
  Query: {}
  String: Scalars['String']['output']
  location: Location
  timeSlot: TimeSlot
}

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export type QueryResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = {
  locations?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['location']>>>,
    ParentType,
    ContextType
  >
  timeslots?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['timeSlot']>>>,
    ParentType,
    ContextType,
    RequireFields<QueryTimeslotsArgs, 'type'>
  >
}

export type LocationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['location'] = ResolversParentTypes['location'],
> = {
  eventTypes?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['eventType']>>>,
    ParentType,
    ContextType
  >
  link?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TimeSlotResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['timeSlot'] = ResolversParentTypes['timeSlot'],
> = {
  court?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  endTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  location?: Resolver<ResolversTypes['location'], ParentType, ContextType>
  startTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  type?: Resolver<ResolversTypes['eventType'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type Resolvers<ContextType = any> = {
  DateTime?: GraphQLScalarType
  Query?: QueryResolvers<ContextType>
  location?: LocationResolvers<ContextType>
  timeSlot?: TimeSlotResolvers<ContextType>
}

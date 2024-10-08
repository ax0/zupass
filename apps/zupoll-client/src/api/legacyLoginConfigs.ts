import {
  BallotType,
  LegacyLoginCategoryName,
  LegacyLoginConfigName,
  LoginConfig
} from "@pcd/zupoll-shared";
import {
  DEVCONNECT_ADMINS_GROUP_URL,
  DEVCONNECT_ATTENDEES_GROUP_URL,
  EDGE_CITY_ORGANIZERS_GROUP_ID,
  EDGE_CITY_ORGANIZERS_GROUP_URL,
  EDGE_CITY_RESIDENTS_GROUP_ID,
  EDGE_CITY_RESIDENTS_GROUP_URL,
  ETH_LATAM_ATTENDEES_GROUP_ID,
  ETH_LATAM_ATTENDEES_GROUP_URL,
  ETH_LATAM_ORGANIZERS_GROUP_ID,
  ETH_LATAM_ORGANIZERS_GROUP_URL,
  SemaphoreGroups,
  ZUPASS_CLIENT_URL,
  ZUPASS_SERVER_URL,
  ZUZALU_ADMINS_GROUP_URL,
  ZUZALU_PARTICIPANTS_GROUP_URL
} from "../env";

export const ETH_LATAM_ATTENDEE_CONFIG: LoginConfig = {
  year: 2024,
  month: 3,
  day: 13,
  configCategoryId: LegacyLoginCategoryName.EthLatAm,
  groupId: ETH_LATAM_ATTENDEES_GROUP_ID,
  groupUrl: ETH_LATAM_ATTENDEES_GROUP_URL,
  passportServerUrl: ZUPASS_SERVER_URL,
  passportAppUrl: ZUPASS_CLIENT_URL,
  name: LegacyLoginConfigName.ETH_LATAM_ATTENDEE,
  buttonName: "Attendee",
  canCreateBallotTypes: [BallotType.ETH_LATAM_STRAWPOLL]
};

export const ETH_LATAM_ORGANIZER_CONFIG: LoginConfig = {
  year: 2024,
  month: 3,
  day: 13,
  configCategoryId: LegacyLoginCategoryName.EthLatAm,
  groupId: ETH_LATAM_ORGANIZERS_GROUP_ID,
  groupUrl: ETH_LATAM_ORGANIZERS_GROUP_URL,
  passportServerUrl: ZUPASS_SERVER_URL,
  passportAppUrl: ZUPASS_CLIENT_URL,
  name: LegacyLoginConfigName.ETH_LATAM_ORGANIZER,
  buttonName: "Staff",
  canCreateBallotTypes: [
    BallotType.ETH_LATAM_FEEDBACK,
    BallotType.ETH_LATAM_STRAWPOLL
  ]
};

export const EDGE_CITY_RESIDENT_CONFIG: LoginConfig = {
  year: 2024,
  month: 2,
  day: 26,
  configCategoryId: LegacyLoginCategoryName.EdgeCityDenver,
  groupId: EDGE_CITY_RESIDENTS_GROUP_ID,
  groupUrl: EDGE_CITY_RESIDENTS_GROUP_URL,
  passportServerUrl: ZUPASS_SERVER_URL,
  passportAppUrl: ZUPASS_CLIENT_URL,
  name: LegacyLoginConfigName.EDGE_CITY_RESIDENT,
  buttonName: "Resident/Visitor",
  canCreateBallotTypes: [BallotType.EDGE_CITY_RESIDENT]
};

export const EDGE_CITY_ORGANIZER_CONFIG: LoginConfig = {
  year: 2024,
  month: 2,
  day: 26,
  configCategoryId: LegacyLoginCategoryName.EdgeCityDenver,
  groupId: EDGE_CITY_ORGANIZERS_GROUP_ID,
  groupUrl: EDGE_CITY_ORGANIZERS_GROUP_URL,
  passportServerUrl: ZUPASS_SERVER_URL,
  passportAppUrl: ZUPASS_CLIENT_URL,
  name: LegacyLoginConfigName.EDGE_CITY_ORGANIZER,
  buttonName: "Staff",
  canCreateBallotTypes: [
    BallotType.EDGE_CITY_RESIDENT,
    BallotType.EDGE_CITY_ORGANIZER
  ]
};

export const ZUZALU_ORGANIZER_LOGIN_CONFIG: LoginConfig = {
  year: 2023,
  month: 3,
  day: 1,
  configCategoryId: LegacyLoginCategoryName.Zuzalu,
  groupId: SemaphoreGroups.ZuzaluOrganizers,
  groupUrl: ZUZALU_ADMINS_GROUP_URL,
  passportServerUrl: ZUPASS_SERVER_URL,
  passportAppUrl: ZUPASS_CLIENT_URL,
  name: LegacyLoginConfigName.ZUZALU_ORGANIZER,
  buttonName: "Staff",
  canCreateBallotTypes: [
    BallotType.STRAWPOLL,
    BallotType.ADVISORYVOTE,
    BallotType.ORGANIZERONLY
  ]
};

export const ZUZALU_PARTICIPANT_LOGIN_CONFIG: LoginConfig = {
  year: 2023,
  month: 3,
  day: 1,
  configCategoryId: LegacyLoginCategoryName.Zuzalu,
  groupId: SemaphoreGroups.ZuzaluParticipants,
  groupUrl: ZUZALU_PARTICIPANTS_GROUP_URL,
  passportServerUrl: ZUPASS_SERVER_URL,
  passportAppUrl: ZUPASS_CLIENT_URL,
  name: LegacyLoginConfigName.ZUZALU_PARTICIPANT,
  buttonName: "Resident",
  canCreateBallotTypes: [BallotType.STRAWPOLL]
};

export const DEVCONNECT_USER_CONFIG: LoginConfig = {
  year: 2023,
  month: 11,
  day: 13,
  configCategoryId: LegacyLoginCategoryName.Devconnect,
  groupId: SemaphoreGroups.DevconnectAttendees,
  groupUrl: DEVCONNECT_ATTENDEES_GROUP_URL,
  passportServerUrl: ZUPASS_SERVER_URL,
  passportAppUrl: ZUPASS_CLIENT_URL,
  name: LegacyLoginConfigName.DEVCONNECT_PARTICIPANT,
  buttonName: "Attendee",
  canCreateBallotTypes: [BallotType.DEVCONNECT_STRAW]
};

export const DEVCONNECT_ORGANIZER_CONFIG: LoginConfig = {
  year: 2023,
  month: 11,
  day: 13,
  configCategoryId: LegacyLoginCategoryName.Devconnect,
  groupId: SemaphoreGroups.DevconnectOrganizers,
  groupUrl: DEVCONNECT_ADMINS_GROUP_URL,
  passportServerUrl: ZUPASS_SERVER_URL,
  passportAppUrl: ZUPASS_CLIENT_URL,
  name: LegacyLoginConfigName.DEVCONNECT_ORGANIZER,
  buttonName: "Staff",
  canCreateBallotTypes: [
    BallotType.DEVCONNECT_STRAW,
    BallotType.DEVCONNECT_ORGANIZER
  ]
};

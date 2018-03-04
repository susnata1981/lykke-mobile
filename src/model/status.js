export const CHECKIN_STATUS = {
  COMPLETE : 'COMPLETE',
  INCOMPLETE: 'INCOMPLETE',
  NOT_STARTED: 'Not Started',
  NA: 'NA',
}

export const mapStatus = (status) => {
  switch (status) {
    case 'COMPLETE':
      return CHECKIN_STATUS.COMPLETE;
    case 'INCOMPLETE':
      return CHECKIN_STATUS.INCOMPLETE;
    case 'NOT_STARTED':
      return CHECKIN_STATUS.INCOMPLETE;
    default:
      return CHECKIN_STATUS.NA;
  }
}
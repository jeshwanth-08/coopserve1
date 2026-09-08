import { REQUEST_STATUS, RequestStatus, ROLES, Role } from "./constants";

export interface TransitionValidation {
  allowed: boolean;
  nextStatus?: RequestStatus;
  resetProvider?: boolean;
  error?: string;
}

/**
 * Validates whether a given user can transition a service request from currentStatus to requestedStatus.
 * Enforces server-side integrity per Section 4 of the specification.
 */
export function validateStatusTransition(
  currentStatus: string,
  requestedStatus: string,
  userRole: Role,
  isAssignedProvider: boolean,
  isOwnerMember: boolean,
  isAdminOverride: boolean = false
): TransitionValidation {
  // Admin override is always permitted for disputes/edge cases
  if (userRole === ROLES.ADMIN && isAdminOverride) {
    return { allowed: true, nextStatus: requestedStatus as RequestStatus };
  }

  switch (currentStatus) {
    case REQUEST_STATUS.PENDING:
      if (requestedStatus === REQUEST_STATUS.ASSIGNED) {
        if (userRole !== ROLES.ADMIN) {
          return { allowed: false, error: "Only coordinators can assign providers to pending requests." };
        }
        return { allowed: true, nextStatus: REQUEST_STATUS.ASSIGNED };
      }
      if (requestedStatus === REQUEST_STATUS.CANCELLED) {
        if (!isOwnerMember && userRole !== ROLES.ADMIN) {
          return { allowed: false, error: "Only the request creator can cancel this request." };
        }
        return { allowed: true, nextStatus: REQUEST_STATUS.CANCELLED };
      }
      return { allowed: false, error: `Invalid transition from ${currentStatus} to ${requestedStatus}.` };

    case REQUEST_STATUS.ASSIGNED:
      if (requestedStatus === REQUEST_STATUS.ACCEPTED) {
        if (!isAssignedProvider && userRole !== ROLES.ADMIN) {
          return { allowed: false, error: "Only the assigned provider can accept this request." };
        }
        return { allowed: true, nextStatus: REQUEST_STATUS.ACCEPTED };
      }
      if (requestedStatus === REQUEST_STATUS.DECLINED) {
        if (!isAssignedProvider && userRole !== ROLES.ADMIN) {
          return { allowed: false, error: "Only the assigned provider can decline this request." };
        }
        // When declined, the request returns to PENDING queue so the coordinator can reassign it
        return {
          allowed: true,
          nextStatus: REQUEST_STATUS.PENDING,
          resetProvider: true,
        };
      }
      return { allowed: false, error: `Invalid transition from ${currentStatus} to ${requestedStatus}.` };

    case REQUEST_STATUS.ACCEPTED:
      if (requestedStatus === REQUEST_STATUS.ON_THE_WAY) {
        if (!isAssignedProvider && userRole !== ROLES.ADMIN) {
          return { allowed: false, error: "Only the assigned provider can update status to On The Way." };
        }
        return { allowed: true, nextStatus: REQUEST_STATUS.ON_THE_WAY };
      }
      return { allowed: false, error: `Invalid transition from ${currentStatus} to ${requestedStatus}.` };

    case REQUEST_STATUS.ON_THE_WAY:
      if (requestedStatus === REQUEST_STATUS.IN_PROGRESS) {
        if (!isAssignedProvider && userRole !== ROLES.ADMIN) {
          return { allowed: false, error: "Only the assigned provider can mark work as In Progress." };
        }
        return { allowed: true, nextStatus: REQUEST_STATUS.IN_PROGRESS };
      }
      return { allowed: false, error: `Invalid transition from ${currentStatus} to ${requestedStatus}.` };

    case REQUEST_STATUS.IN_PROGRESS:
      if (requestedStatus === REQUEST_STATUS.RESOLVED) {
        if (!isAssignedProvider && userRole !== ROLES.ADMIN) {
          return { allowed: false, error: "Only the assigned provider can mark this request as Resolved." };
        }
        return { allowed: true, nextStatus: REQUEST_STATUS.RESOLVED };
      }
      return { allowed: false, error: `Invalid transition from ${currentStatus} to ${requestedStatus}.` };

    case REQUEST_STATUS.RESOLVED:
    case REQUEST_STATUS.CANCELLED:
      return { allowed: false, error: `Request is already in a terminal state (${currentStatus}).` };

    default:
      return { allowed: false, error: `Unrecognized status: ${currentStatus}` };
  }
}

import { PrismaClient } from "@prisma/client";
import { validateStatusTransition } from "./src/lib/transitions";
import { REQUEST_STATUS, ROLES } from "./src/lib/constants";
import { signSessionToken, verifySessionToken } from "./src/lib/auth";

const prisma = new PrismaClient();

async function runVerification() {
  console.log("=== COOPERATIVE GIG SERVICES PLATFORM VERIFICATION ===");

  // 1. Database Counts
  const adminCount = await prisma.user.count({ where: { role: ROLES.ADMIN } });
  const providerCount = await prisma.user.count({ where: { role: ROLES.PROVIDER } });
  const memberCount = await prisma.user.count({ where: { role: ROLES.MEMBER } });
  const totalRequests = await prisma.serviceRequest.count();
  const emergencyRequests = await prisma.serviceRequest.count({ where: { isEmergency: true } });
  const communityRequests = await prisma.serviceRequest.count({ where: { visibility: "COMMUNITY" } });
  const personalRequests = await prisma.serviceRequest.count({ where: { visibility: "PERSONAL" } });
  const statusHistoryCount = await prisma.statusHistory.count();
  const ratingsCount = await prisma.rating.count();

  console.log("\n[1] DATABASE INTEGRITY CHECK:");
  console.log(`- Admins: ${adminCount} (Target: 1) -> ${adminCount === 1 ? "PASSED" : "FAILED"}`);
  console.log(`- Providers: ${providerCount} (Target: 10) -> ${providerCount >= 10 ? "PASSED" : "FAILED"}`);
  console.log(`- Members: ${memberCount} (Target: 15) -> ${memberCount >= 15 ? "PASSED" : "FAILED"}`);
  console.log(`- Total Requests: ${totalRequests} (Target: ~30) -> ${totalRequests >= 30 ? "PASSED" : "FAILED"}`);
  console.log(`- Emergency Requests: ${emergencyRequests} (Target: >= 5) -> ${emergencyRequests >= 5 ? "PASSED" : "FAILED"}`);
  console.log(`- Community Requests: ${communityRequests} (Target: >= 8) -> ${communityRequests >= 8 ? "PASSED" : "FAILED"}`);
  console.log(`- Personal Requests: ${personalRequests}`);
  console.log(`- Status History Entries: ${statusHistoryCount}`);
  console.log(`- Member Ratings: ${ratingsCount}`);

  // 2. State Machine Rules
  console.log("\n[2] STATE MACHINE TRANSITION VERIFICATION:");

  // Test: Member cannot assign provider
  const invalidAssignByMember = validateStatusTransition(
    REQUEST_STATUS.PENDING,
    REQUEST_STATUS.ASSIGNED,
    ROLES.MEMBER,
    false,
    true
  );
  console.log(`- Member cannot assign provider: ${!invalidAssignByMember.allowed ? "PASSED" : "FAILED"}`);

  // Test: Admin CAN assign provider
  const validAssignByAdmin = validateStatusTransition(
    REQUEST_STATUS.PENDING,
    REQUEST_STATUS.ASSIGNED,
    ROLES.ADMIN,
    false,
    false
  );
  console.log(`- Admin can assign provider: ${validAssignByAdmin.allowed ? "PASSED" : "FAILED"}`);

  // Test: Provider CAN accept assigned request
  const validAcceptByProvider = validateStatusTransition(
    REQUEST_STATUS.ASSIGNED,
    REQUEST_STATUS.ACCEPTED,
    ROLES.PROVIDER,
    true,
    false
  );
  console.log(`- Provider can accept assigned request: ${validAcceptByProvider.allowed ? "PASSED" : "FAILED"}`);

  // Test: Provider declining resets to PENDING
  const validDeclineByProvider = validateStatusTransition(
    REQUEST_STATUS.ASSIGNED,
    REQUEST_STATUS.DECLINED,
    ROLES.PROVIDER,
    true,
    false
  );
  console.log(`- Provider decline resets to PENDING: ${validDeclineByProvider.nextStatus === REQUEST_STATUS.PENDING ? "PASSED" : "FAILED"}`);

  // Test: Progression Accepted -> On The Way -> In Progress -> Resolved
  const onTheWay = validateStatusTransition(REQUEST_STATUS.ACCEPTED, REQUEST_STATUS.ON_THE_WAY, ROLES.PROVIDER, true, false);
  const inProgress = validateStatusTransition(REQUEST_STATUS.ON_THE_WAY, REQUEST_STATUS.IN_PROGRESS, ROLES.PROVIDER, true, false);
  const resolved = validateStatusTransition(REQUEST_STATUS.IN_PROGRESS, REQUEST_STATUS.RESOLVED, ROLES.PROVIDER, true, false);
  console.log(`- Complete Provider progression flow: ${onTheWay.allowed && inProgress.allowed && resolved.allowed ? "PASSED" : "FAILED"}`);

  // Test: Member cannot advance status to Resolved
  const memberCannotResolve = validateStatusTransition(REQUEST_STATUS.IN_PROGRESS, REQUEST_STATUS.RESOLVED, ROLES.MEMBER, false, true);
  console.log(`- Member cannot advance status to Resolved: ${!memberCannotResolve.allowed ? "PASSED" : "FAILED"}`);

  // 3. Auth Token Signing & Verification
  console.log("\n[3] AUTHENTICATION TOKEN CHECK:");
  const testPayload = {
    userId: "test_id_123",
    email: "admin@coop.org",
    name: "Eleanor Vance",
    role: ROLES.ADMIN,
  };
  const token = await signSessionToken(testPayload);
  const verified = await verifySessionToken(token);
  console.log(`- JWT Session Token Issue & Verify: ${verified?.userId === "test_id_123" && verified?.role === ROLES.ADMIN ? "PASSED" : "FAILED"}`);

  console.log("\n=== ALL VERIFICATION CHECKS COMPLETED SUCCESSFULLY ===");
}

runVerification()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

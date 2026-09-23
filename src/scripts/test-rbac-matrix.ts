/**
 * Automated RBAC Verification Test Suite
 *
 * Validates the Principle of Least Privilege across Anonymous, Editor, and Admin roles:
 * - Anonymous cannot access private member data, rosters, or mutate CMS content.
 * - Editor can read rosters and operational member summaries, but CANNOT view studentId/phone/adminNotes,
 *   CANNOT update member status/PII, CANNOT mutate registration attendee details, and CANNOT delete anything.
 * - Editor CAN update attendance status ('attended', 'no_show').
 * - Admin has complete operational authority and full CRUD.
 * - Public API endpoints (/api/join, /api/events/[slug]/rsvp) continue to function normally.
 */

const BASE_URL = process.env.TEST_SERVER_URL || "http://localhost:3001";

interface LoginResult {
  token: string;
  user: {
    id: number | string;
    email: string;
    role: string;
    name: string;
  };
}

let passedAssertions = 0;
let failedAssertions = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedAssertions++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failedAssertions++;
  }
}

async function login(email: string, password = "OzuRunning2026!"): Promise<LoginResult> {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error(`Failed to login as ${email}: HTTP ${res.status}`);
  }
  const data = await res.json();
  return {
    token: data.token,
    user: data.user,
  };
}

async function api(
  path: string,
  options: {
    method?: string;
    token?: string;
    body?: any;
  } = {}
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (options.token) {
    headers["Authorization"] = `JWT ${options.token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const contentType = res.headers.get("content-type") || "";
  let json: any = null;
  if (contentType.includes("application/json")) {
    json = await res.json().catch(() => null);
  }

  return {
    status: res.status,
    ok: res.ok,
    json,
  };
}

async function runRbacTests() {
  console.log("==================================================");
  console.log("🔒 RBAC SECURITY MATRIX VERIFICATION SUITE");
  console.log(`Target Server: ${BASE_URL}`);
  console.log("==================================================\n");

  // 1. Authenticate users
  console.log("1. Authenticating test users...");
  const adminAuth = await login("admin@ozurunning.com");
  assert(adminAuth.user.role === "admin", "Admin logged in with 'admin' role");

  const editorAuth = await login("editor@ozurunning.com");
  assert(editorAuth.user.role === "editor", "Editor logged in with 'editor' role");
  console.log("");

  // 2. Test Anonymous Role
  console.log("2. Testing ANONYMOUS (Public) Access Restrictions...");

  // Anonymous -> /api/users
  const anonUsers = await api("/api/users");
  assert(
    anonUsers.status === 401 || anonUsers.status === 403 || anonUsers.json?.docs?.length === 0,
    `Anonymous reading /api/users is denied (Status: ${anonUsers.status})`
  );

  // Anonymous -> /api/club-members
  const anonMembers = await api("/api/club-members");
  assert(
    anonMembers.status === 401 || anonMembers.status === 403 || anonMembers.json?.docs?.length === 0,
    `Anonymous reading /api/club-members is denied (Status: ${anonMembers.status})`
  );

  // Anonymous -> /api/event-registrations
  const anonRegs = await api("/api/event-registrations");
  assert(
    anonRegs.status === 401 || anonRegs.status === 403 || anonRegs.json?.docs?.length === 0,
    `Anonymous reading /api/event-registrations is denied (Status: ${anonRegs.status})`
  );

  // Anonymous -> POST /api/club-members (Direct REST mutation)
  const anonCreateMember = await api("/api/club-members", {
    method: "POST",
    body: {
      fullName: "Hacker Member",
      email: "hacker@test.com",
      studentId: "S99999",
      phone: "+905550000000",
      faculty: "Engineering",
      experienceLevel: "beginner",
    },
  });
  assert(
    anonCreateMember.status === 401 || anonCreateMember.status === 403,
    `Anonymous direct creation on /api/club-members is forbidden (Status: ${anonCreateMember.status})`
  );

  // Anonymous -> DELETE /api/events/1
  const anonDeleteEvent = await api("/api/events/1", { method: "DELETE" });
  assert(
    anonDeleteEvent.status === 401 || anonDeleteEvent.status === 403,
    `Anonymous deletion of events is forbidden (Status: ${anonDeleteEvent.status})`
  );
  console.log("");

  // 3. Setup Seed Member & Event for Testing
  console.log("3. Preparing test fixture member and event via Admin...");
  const fixtureEmail = `rbac_fixture_${Date.now()}@ozu.edu.tr`;
  const fixtureStudentId = `S_RBAC_${Date.now().toString().slice(-5)}`;

  const createMemberRes = await api("/api/club-members", {
    method: "POST",
    token: adminAuth.token,
    body: {
      fullName: "RBAC Test Member",
      email: fixtureEmail,
      studentId: fixtureStudentId,
      phone: "+90 532 999 8877",
      faculty: "Business Administration",
      studentRole: "undergraduate",
      experienceLevel: "intermediate",
      adminNotes: "Secret internal staff note: excellent candidate",
      status: "pending",
    },
  });
  assert(createMemberRes.status === 201, `Admin created test club member (Status: ${createMemberRes.status})`);
  const testMemberId = createMemberRes.json?.doc?.id;
  assert(Boolean(testMemberId), `Test member ID obtained: ${testMemberId}`);

  // Fetch an existing event to use for registration tests
  const eventsRes = await api("/api/events?limit=1", { token: adminAuth.token });
  assert(eventsRes.ok && eventsRes.json?.docs?.length > 0, "Retrieved existing event for test");
  const testEvent = eventsRes.json?.docs?.[0];
  const testEventId = testEvent?.id;
  const testEventSlug = testEvent?.slug;
  const testEventPaceGroup = testEvent?.paceGroups?.[0]?.name || "Sub 5:00";

  // Create test registration via Admin
  const regEmail = `rbac_attendee_${Date.now()}@ozu.edu.tr`;
  const createRegRes = await api("/api/event-registrations", {
    method: "POST",
    token: adminAuth.token,
    body: {
      event: testEventId,
      fullName: "Test Attendee",
      email: regEmail,
      studentId: "S12345",
      phone: "+90 555 111 2233",
      paceGroup: "Sub 5:00",
      status: "confirmed",
    },
  });
  assert(createRegRes.status === 201, `Admin created test registration (Status: ${createRegRes.status})`);
  const testRegId = createRegRes.json?.doc?.id;
  assert(Boolean(testRegId), `Test registration ID obtained: ${testRegId}`);
  console.log("");

  // 4. Test Editor Role: ClubMembers PII Redaction & Status Lockdown
  console.log("4. Testing EDITOR Role on ClubMembers (PII Redaction & Status Protection)...");

  // Editor reads member
  const editorReadMember = await api(`/api/club-members/${testMemberId}`, {
    token: editorAuth.token,
  });
  assert(editorReadMember.status === 200, `Editor can read club member record (Status: 200)`);
  const memberData = editorReadMember.json;
  assert(memberData?.fullName === "RBAC Test Member", `Editor sees operational fullName ('${memberData?.fullName}')`);
  assert(memberData?.faculty === "Business Administration", `Editor sees operational faculty ('${memberData?.faculty}')`);

  // Verify PII fields are REDACTED / undefined
  assert(
    memberData?.studentId === undefined || memberData?.studentId === null,
    `PII Protection: Editor CANNOT see studentId (Value: ${memberData?.studentId})`
  );
  assert(
    memberData?.phone === undefined || memberData?.phone === null,
    `PII Protection: Editor CANNOT see phone (Value: ${memberData?.phone})`
  );
  assert(
    memberData?.adminNotes === undefined || memberData?.adminNotes === null,
    `PII Protection: Editor CANNOT see adminNotes (Value: ${memberData?.adminNotes})`
  );

  // Editor tries to approve/update member status
  const editorUpdateStatus = await api(`/api/club-members/${testMemberId}`, {
    method: "PATCH",
    token: editorAuth.token,
    body: {
      status: "active",
    },
  });
  assert(
    editorUpdateStatus.status === 403 || editorUpdateStatus.status === 401 || !editorUpdateStatus.ok,
    `Editor is FORBIDDEN from updating club member status (Status: ${editorUpdateStatus.status})`
  );

  // Editor tries to delete member
  const editorDeleteMember = await api(`/api/club-members/${testMemberId}`, {
    method: "DELETE",
    token: editorAuth.token,
  });
  assert(
    editorDeleteMember.status === 403 || editorDeleteMember.status === 401,
    `Editor is FORBIDDEN from deleting club member (Status: ${editorDeleteMember.status})`
  );
  console.log("");

  // 5. Test Editor Role: EventRegistrations Attendance vs Roster Tampering
  console.log("5. Testing EDITOR Role on EventRegistrations (Attendance Workflow vs Lockdown)...");

  // Editor reads registration roster
  const editorReadReg = await api(`/api/event-registrations/${testRegId}`, {
    token: editorAuth.token,
  });
  assert(editorReadReg.status === 200, `Editor can read registration roster (Status: 200)`);

  // Editor marks attendance: 'attended' -> MUST SUCCEED
  const editorMarkAttended = await api(`/api/event-registrations/${testRegId}`, {
    method: "PATCH",
    token: editorAuth.token,
    body: {
      status: "attended",
    },
  });
  assert(
    editorMarkAttended.status === 200 && editorMarkAttended.json?.doc?.status === "attended",
    `Editor CAN mark attendee status as 'attended' (Status: ${editorMarkAttended.status})`
  );

  // Editor marks attendance: 'no_show' -> MUST SUCCEED
  const editorMarkNoShow = await api(`/api/event-registrations/${testRegId}`, {
    method: "PATCH",
    token: editorAuth.token,
    body: {
      status: "no_show",
    },
  });
  assert(
    editorMarkNoShow.status === 200 && editorMarkNoShow.json?.doc?.status === "no_show",
    `Editor CAN mark attendee status as 'no_show' (Status: ${editorMarkNoShow.status})`
  );

  // Editor attempts unauthorized status change (e.g. promoting to 'confirmed' or arbitrary status)
  const editorIllegalStatus = await api(`/api/event-registrations/${testRegId}`, {
    method: "PATCH",
    token: editorAuth.token,
    body: {
      status: "confirmed",
    },
  });
  assert(
    editorIllegalStatus.status === 403,
    `Editor is FORBIDDEN from setting status to 'confirmed' (Status: ${editorIllegalStatus.status})`
  );

  // Editor attempts to alter attendee identity/email
  const editorTamperEmail = await api(`/api/event-registrations/${testRegId}`, {
    method: "PATCH",
    token: editorAuth.token,
    body: {
      email: "hijacked@email.com",
    },
  });
  // Field access on email has update: isAdminField; Payload ignores/forbids it
  const verifyRegAfterTamper = await api(`/api/event-registrations/${testRegId}`, {
    token: adminAuth.token,
  });
  const actualEmail = verifyRegAfterTamper.json?.email || verifyRegAfterTamper.json?.doc?.email;
  assert(
    actualEmail === regEmail,
    `Editor CANNOT tamper with attendee email (Remains: ${actualEmail})`
  );

  // Editor attempts to create registration directly
  const editorCreateReg = await api("/api/event-registrations", {
    method: "POST",
    token: editorAuth.token,
    body: {
      event: testEventId,
      fullName: "Editor Direct Created",
      email: "direct_created@test.com",
    },
  });
  assert(
    editorCreateReg.status === 403 || editorCreateReg.status === 401,
    `Editor CANNOT create event registrations directly (Status: ${editorCreateReg.status})`
  );

  // Editor attempts to delete registration
  const editorDeleteReg = await api(`/api/event-registrations/${testRegId}`, {
    method: "DELETE",
    token: editorAuth.token,
  });
  assert(
    editorDeleteReg.status === 403 || editorDeleteReg.status === 401,
    `Editor CANNOT delete registrations (Status: ${editorDeleteReg.status})`
  );
  console.log("");

  // 6. Test Editor Role: General Collections & Universal Delete Lockdown
  console.log("6. Testing Universal Delete Lockdown for Editor...");

  const editorDeleteEvent = await api(`/api/events/${testEventId}`, {
    method: "DELETE",
    token: editorAuth.token,
  });
  assert(
    editorDeleteEvent.status === 403 || editorDeleteEvent.status === 401,
    `Editor CANNOT delete events (Status: ${editorDeleteEvent.status})`
  );

  const editorDeletePartner = await api("/api/partners/1", {
    method: "DELETE",
    token: editorAuth.token,
  });
  assert(
    editorDeletePartner.status === 403 || editorDeletePartner.status === 401,
    `Editor CANNOT delete partners (Status: ${editorDeletePartner.status})`
  );

  const editorDeleteMedia = await api("/api/media/1", {
    method: "DELETE",
    token: editorAuth.token,
  });
  assert(
    editorDeleteMedia.status === 403 || editorDeleteMedia.status === 401,
    `Editor CANNOT delete media assets (Status: ${editorDeleteMedia.status})`
  );

  // Editor User Access: only reads own record, cannot read admin record
  const editorUsers = await api("/api/users", { token: editorAuth.token });
  assert(
    editorUsers.ok &&
      editorUsers.json?.docs?.every((u: any) => u.id === editorAuth.user.id),
    `Editor only sees own user record in /api/users (Docs count: ${editorUsers.json?.docs?.length})`
  );
  console.log("");

  // 7. Test Admin Authority
  console.log("7. Testing ADMIN Full Authority...");

  // Admin reads member: studentId, phone, adminNotes MUST BE VISIBLE
  const adminReadMember = await api(`/api/club-members/${testMemberId}`, {
    token: adminAuth.token,
  });
  assert(adminReadMember.status === 200, "Admin can read club member");
  assert(
    adminReadMember.json?.studentId === fixtureStudentId,
    `Admin sees studentId ('${adminReadMember.json?.studentId}')`
  );
  assert(
    adminReadMember.json?.phone === "+90 532 999 8877",
    `Admin sees phone ('${adminReadMember.json?.phone}')`
  );
  assert(
    adminReadMember.json?.adminNotes === "Secret internal staff note: excellent candidate",
    `Admin sees internal adminNotes ('${adminReadMember.json?.adminNotes}')`
  );

  // Admin updates member status: pending -> active
  const adminUpdateStatus = await api(`/api/club-members/${testMemberId}`, {
    method: "PATCH",
    token: adminAuth.token,
    body: {
      status: "active",
    },
  });
  assert(
    adminUpdateStatus.status === 200 && adminUpdateStatus.json?.doc?.status === "active",
    `Admin successfully promoted member to 'active' (Status: ${adminUpdateStatus.status})`
  );

  // Admin can update registration status to any status
  const adminUpdateReg = await api(`/api/event-registrations/${testRegId}`, {
    method: "PATCH",
    token: adminAuth.token,
    body: {
      status: "confirmed",
    },
  });
  assert(
    adminUpdateReg.status === 200 && adminUpdateReg.json?.doc?.status === "confirmed",
    `Admin successfully updated registration status to 'confirmed' (Status: ${adminUpdateReg.status})`
  );

  // Admin can delete test fixtures
  const adminDeleteReg = await api(`/api/event-registrations/${testRegId}`, {
    method: "DELETE",
    token: adminAuth.token,
  });
  assert(adminDeleteReg.status === 200, `Admin successfully cleaned up test registration (Status: ${adminDeleteReg.status})`);

  const adminDeleteMember = await api(`/api/club-members/${testMemberId}`, {
    method: "DELETE",
    token: adminAuth.token,
  });
  assert(adminDeleteMember.status === 200, `Admin successfully cleaned up test member (Status: ${adminDeleteMember.status})`);
  console.log("");

  // 8. Test Public Ingestion Regression (Join & RSVP routes)
  console.log("8. Verifying Public Application Routes (/api/join & /api/events/[slug]/rsvp)...");

  const publicJoinEmail = `public_applicant_${Date.now()}@ozu.edu.tr`;
  const publicJoinRes = await fetch(`${BASE_URL}/api/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "Public Applicant",
      email: publicJoinEmail,
      studentId: `S${Date.now().toString().slice(-6)}`,
      phone: "+90 533 111 2233",
      faculty: "Faculty of Engineering",
      studentRole: "undergraduate",
      experienceLevel: "beginner",
    }),
  });
  const publicJoinData = await publicJoinRes.json().catch(() => ({}));
  assert(
    publicJoinRes.status === 201 && publicJoinData.success,
    `Public /api/join route succeeds (Status: ${publicJoinRes.status})`
  );

  // Clean up public join applicant via Admin
  if (publicJoinData.doc?.id) {
    await api(`/api/club-members/${publicJoinData.doc.id}`, {
      method: "DELETE",
      token: adminAuth.token,
    });
  }

  // Public RSVP
  if (testEventSlug) {
    const publicRsvpEmail = `public_runner_${Date.now()}@ozu.edu.tr`;
    const publicRsvpRes = await fetch(`${BASE_URL}/api/events/${testEventSlug}/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Public Runner",
        email: publicRsvpEmail,
        studentId: `S${Date.now().toString().slice(-6)}`,
        paceGroup: testEventPaceGroup,
      }),
    });
    const publicRsvpData = await publicRsvpRes.json().catch(() => ({}));
    assert(
      publicRsvpRes.status === 201 && publicRsvpData.success,
      `Public /api/events/[slug]/rsvp route succeeds (Status: ${publicRsvpRes.status}${publicRsvpData.error ? `, Error: ${publicRsvpData.error}` : ""})`
    );

    // Clean up public rsvp via Admin
    if (publicRsvpData.doc?.id) {
      await api(`/api/event-registrations/${publicRsvpData.doc.id}`, {
        method: "DELETE",
        token: adminAuth.token,
      });
    }
  }

  console.log("\n==================================================");
  console.log(`RBAC Verification Results:`);
  console.log(`Passed Assertions: ${passedAssertions}`);
  console.log(`Failed Assertions: ${failedAssertions}`);
  console.log("==================================================");

  if (failedAssertions > 0) {
    process.exit(1);
  } else {
    console.log("🎉 ALL RBAC LEAST-PRIVILEGE INVARIANTS SATISFIED!\n");
    process.exit(0);
  }
}

runRbacTests().catch((err) => {
  console.error("Fatal error during RBAC test execution:", err);
  process.exit(1);
});

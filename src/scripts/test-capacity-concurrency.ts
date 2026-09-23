import pg from "pg";

const { Pool } = pg;

const BASE_URL = process.env.TEST_SERVER_URL || "http://localhost:3001";
const DATABASE_URI =
  process.env.DATABASE_URI ||
  "postgres://postgres:ozu_running_secret@127.0.0.1:5433/ozu_running_db";

async function main() {
  console.log("==================================================");
  console.log("🧪 RUNNING CONCURRENCY & CAPACITY INVARIANT TEST");
  console.log(`Target Server: ${BASE_URL}`);
  console.log("==================================================\n");

  const pool = new Pool({ connectionString: DATABASE_URI });

  const testSlug = `concurrency-test-${Date.now()}`;
  let testEventId: number | null = null;

  try {
    // 1. Create temporary test event with max_participants = 1
    console.log("1. Setting up temporary test event with max_participants = 1...");
    const createEventRes = await pool.query(
      `INSERT INTO events (
         title, slug, event_type, date, meeting_point, distance_km, max_participants, 
         is_registration_enabled, status, is_published, created_at, updated_at
       ) VALUES (
         'Atomic Concurrency Test Run', $1, 'campus_social', NOW() + INTERVAL '5 days', 
         'Athletic Steps', 5, 1, true, 'scheduled', true, NOW(), NOW()
       ) RETURNING id, slug`,
      [testSlug]
    );

    testEventId = createEventRes.rows[0].id;
    console.log(`   Created test event [ID: ${testEventId}, Slug: ${testSlug}]\n`);

    // 2. Dispatch N = 10 simultaneous concurrent RSVPs for 1 available spot
    const N = 10;
    console.log(`2. Dispatching ${N} SIMULTANEOUS RSVP requests against 1 available spot...`);

    const promises = Array.from({ length: N }, (_, i) => {
      const email = `concurrent_runner_${i + 1}_${Date.now()}@ozu.edu.tr`;
      const fullName = `Concurrent Runner ${i + 1}`;
      const clientIp = `192.168.10.${(i + 1) % 250}`;
      return fetch(`${BASE_URL}/api/events/${testSlug}/rsvp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": clientIp,
        },
        body: JSON.stringify({
          fullName,
          email,
          studentId: `S0000${i + 1}`,
          paceGroup: "Open Pace",
        }),
      }).then(async (res) => {
        const json = await res.json().catch(() => ({}));
        return {
          status: res.status,
          body: json,
          runnerIndex: i + 1,
        };
      });
    });

    const results = await Promise.all(promises);

    let confirmedResponses = 0;
    let waitlistResponses = 0;
    let failedResponses = 0;

    results.forEach((r) => {
      if (r.status === 201 && r.body?.status === "confirmed") {
        confirmedResponses++;
        console.log(`   Runner ${r.runnerIndex}: HTTP ${r.status} -> CONFIRMED ✅`);
      } else if (r.status === 201 && r.body?.status === "waitlist") {
        waitlistResponses++;
        console.log(`   Runner ${r.runnerIndex}: HTTP ${r.status} -> WAITLIST (Cap reached) ⏳`);
      } else {
        failedResponses++;
        console.error(`   Runner ${r.runnerIndex}: FAILED -> HTTP ${r.status}`, r.body);
      }
    });

    console.log("\n--- Burst Test 1 Summary ---");
    console.log(`Total Requests:      ${N}`);
    console.log(`Confirmed Responses: ${confirmedResponses}`);
    console.log(`Waitlist Responses:  ${waitlistResponses}`);
    console.log(`Failed Responses:    ${failedResponses}`);

    // Verify DB records
    const dbOccupancyRes = await pool.query(
      `SELECT status, count(*)::int as count 
       FROM event_registrations 
       WHERE event_id = $1 
       GROUP BY status`,
      [testEventId]
    );

    const counts: Record<string, number> = {};
    dbOccupancyRes.rows.forEach((row) => {
      counts[row.status] = row.count;
    });

    console.log("\nDatabase Persisted State:", counts);

    if (confirmedResponses !== 1) {
      throw new Error(
        `ASSERTION FAILED: Expected exactly 1 confirmed response, got ${confirmedResponses}!`
      );
    }

    if (waitlistResponses !== N - 1) {
      throw new Error(
        `ASSERTION FAILED: Expected ${N - 1} waitlist responses, got ${waitlistResponses}!`
      );
    }

    if (counts["confirmed"] !== 1) {
      throw new Error(
        `ASSERTION FAILED: Database confirmed count is ${counts["confirmed"]} (must be exactly 1)!`
      );
    }

    console.log("\n✅ CAPACITY INVARIANT VERIFIED: confirmed occupancy <= maxParticipants under concurrent burst load!\n");

    // 3. Test Concurrent Duplicate Rejection (Double-click race condition)
    console.log("3. Testing Concurrent Duplicate Submissions (5 simultaneous requests with SAME email)...");
    const duplicateEmail = `duplicate_burst_${Date.now()}@ozu.edu.tr`;

    const dupPromises = Array.from({ length: 5 }, (_, i) => {
      const dupIp = `10.99.1.${i + 1}`;
      return fetch(`${BASE_URL}/api/events/${testSlug}/rsvp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": dupIp,
        },
        body: JSON.stringify({
          fullName: "Duplicate Burst Runner",
          email: duplicateEmail,
          studentId: "S99999",
          paceGroup: "Open Pace",
        }),
      }).then(async (res) => {
        const json = await res.json().catch(() => ({}));
        return {
          status: res.status,
          code: json.code,
          runnerIndex: i + 1,
        };
      });
    });

    const dupResults = await Promise.all(dupPromises);

    let dupSuccess = 0;
    let dup409Conflict = 0;

    dupResults.forEach((r) => {
      if (r.status === 201) {
        dupSuccess++;
        console.log(`   Dup Attempt ${r.runnerIndex}: HTTP 201 (Initial Accepted)`);
      } else if (r.status === 409 && r.code === "DUPLICATE_REGISTRATION") {
        dup409Conflict++;
        console.log(`   Dup Attempt ${r.runnerIndex}: HTTP 409 DUPLICATE_REGISTRATION (Rejected) 🛡️`);
      } else {
        console.error(`   Dup Attempt ${r.runnerIndex}: Unexpected status ${r.status}`, r);
      }
    });

    console.log("\n--- Duplicate Burst Test Summary ---");
    console.log(`Accepted: ${dupSuccess} (Expected: 1)`);
    console.log(`Rejected (409 Conflict): ${dup409Conflict} (Expected: 4)`);

    const dbDupCountRes = await pool.query(
      `SELECT count(*)::int as count 
       FROM event_registrations 
       WHERE event_id = $1 AND lower(email) = lower($2)`,
      [testEventId, duplicateEmail]
    );

    const persistedDupCount = dbDupCountRes.rows[0].count;
    console.log(`Persisted DB records for duplicate email: ${persistedDupCount}`);

    if (dupSuccess !== 1 || dup409Conflict !== 4 || persistedDupCount !== 1) {
      throw new Error(
        `ASSERTION FAILED: Duplicate burst handling failed. Accepted: ${dupSuccess}, 409s: ${dup409Conflict}, DB: ${persistedDupCount}`
      );
    }

    console.log("\n✅ DUPLICATE INVARIANT VERIFIED: Exact single registration persisted; concurrent attempts rejected with HTTP 409!\n");

    console.log("🎉 ALL CONCURRENCY AND CAPACITY INVARIANT TESTS PASSED WITH 100% RELIABILITY!");
  } finally {
    // 4. Cleanup test data
    if (testEventId) {
      console.log(`\nCleaning up test registrations and event [ID: ${testEventId}]...`);
      await pool.query("DELETE FROM event_registrations WHERE event_id = $1", [testEventId]);
      await pool.query("DELETE FROM events WHERE id = $1", [testEventId]);
      console.log("Cleanup complete.");
    }
    await pool.end();
  }
}

main().catch((err) => {
  console.error("\n❌ TEST SUITE FAILED:", err);
  process.exit(1);
});

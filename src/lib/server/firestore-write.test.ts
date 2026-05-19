import assert from "node:assert/strict";
import test from "node:test";
import type { DocumentReference } from "firebase-admin/firestore";
import { setDocSafe, updateDocSafe } from "@/lib/server/firestore-write";

test("setDocSafe writes sanitized payload", async () => {
  let written: unknown = null;
  const docRef = {
    set: async (value: unknown) => {
      written = value;
    },
  } as unknown as DocumentReference;

  await setDocSafe({
    docRef,
    collection: "shoot_messages",
    docId: "msg_1",
    data: {
      content: "ok",
      imageUrl: undefined,
      meta: { key: "value", drop: undefined },
    },
  });

  assert.deepEqual(written, {
    content: "ok",
    meta: { key: "value" },
  });
});

test("updateDocSafe skips undefined values", async () => {
  let written: unknown = null;
  const docRef = {
    update: async (value: unknown) => {
      written = value;
    },
  } as unknown as DocumentReference;

  await updateDocSafe({
    docRef,
    collection: "shoot_jobs",
    docId: "job_1",
    data: {
      status: "working",
      latestOutputUrl: undefined,
    },
  });

  assert.deepEqual(written, {
    status: "working",
  });
});


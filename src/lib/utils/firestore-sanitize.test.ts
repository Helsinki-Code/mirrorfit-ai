import assert from "node:assert/strict";
import test from "node:test";
import { sanitizeFirestoreData } from "@/lib/utils/firestore-sanitize";

test("sanitizeFirestoreData omits undefined in flat objects", () => {
  const input = {
    id: "row_1",
    imageUrl: undefined,
    status: "completed",
  };
  const result = sanitizeFirestoreData(input);
  assert.deepEqual(result, {
    id: "row_1",
    status: "completed",
  });
});

test("sanitizeFirestoreData omits undefined recursively", () => {
  const input = {
    nested: {
      keep: "yes",
      drop: undefined,
    },
    list: [
      { key: "value", optional: undefined },
      undefined,
      "ok",
    ],
  };
  const result = sanitizeFirestoreData(input);
  assert.deepEqual(result, {
    nested: { keep: "yes" },
    list: [{ key: "value" }, "ok"],
  });
});


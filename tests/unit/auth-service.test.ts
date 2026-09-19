import { describe, expect, it } from "vitest";

import {
  createPasswordHash,
  verifyPassword,
} from "@/lib/services/auth.service";

describe("password hashing", () => {
  it("produces a salt:key hash distinct from the plaintext password", async () => {
    const hash = await createPasswordHash("correct horse battery staple");

    expect(hash).toContain(":");
    expect(hash).not.toBe("correct horse battery staple");

    const [salt, key] = hash.split(":");
    expect(salt).toHaveLength(32); // 16 bytes hex-encoded
    expect(key).toHaveLength(128); // 64 bytes hex-encoded
  });

  it("produces a different hash for the same password each time (random salt)", async () => {
    const hashA = await createPasswordHash("same-password");
    const hashB = await createPasswordHash("same-password");

    expect(hashA).not.toBe(hashB);
  });

  it("verifies a correct password against its hash", async () => {
    const hash = await createPasswordHash("hunter2");

    await expect(verifyPassword("hunter2", hash)).resolves.toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await createPasswordHash("hunter2");

    await expect(verifyPassword("wrong-password", hash)).resolves.toBe(
      false,
    );
  });

  it("rejects a malformed stored hash instead of throwing", async () => {
    await expect(
      verifyPassword("anything", "not-a-valid-hash"),
    ).resolves.toBe(false);
  });
});

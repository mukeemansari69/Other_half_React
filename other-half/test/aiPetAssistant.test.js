import assert from "node:assert/strict";
import test from "node:test";

delete process.env.OPENAI_API_KEY;
delete process.env.AI_ASSISTANT_API_KEY;

const { buildDogHealthAssistantReply } = await import("../server/lib/aiPetAssistant.js");

test("dog health assistant returns structured guidance for dental concerns", async () => {
  const response = await buildDogHealthAssistantReply({
    description: "My 8 year old Labrador has bad breath, plaque on the teeth, and hates chewing.",
  });

  assert.equal(typeof response.problemUnderstanding, "string");
  assert.ok(response.problemUnderstanding.length > 20);
  assert.equal(typeof response.dailyRoutine.morning, "string");
  assert.ok(Array.isArray(response.dietAndCareTips));
  assert.ok(response.recommendedProducts.some((product) => product.productId === "doggie-dental"));
});

test("dog health assistant adds a safety note when urgent symptoms are mentioned", async () => {
  const response = await buildDogHealthAssistantReply({
    description:
      "My dog has blood in the stool, is not eating, and seems too weak to stand properly.",
  });

  assert.equal(typeof response.safetyNote, "string");
  assert.ok(response.safetyNote.length > 20);
});


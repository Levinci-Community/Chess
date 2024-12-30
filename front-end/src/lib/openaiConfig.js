import { Configuration, OpenAI } from "openai";
import appSettings from "../settings/appSettings";

const openai = new OpenAI({
  apiKey: appSettings.OPENAI_KEY,
  dangerouslyAllowBrowser: true,
});

async function getAssistant() {
  try {
    const assistant = await openai.beta.assistants.retrieve(
      "asst_Q1pdDHBdpZWunosrvWzU65Nf",
    );
    console.log(assistant);
    return assistant;
  } catch (error) {
    console.error("Error get assistant:", error);
    return null;
  }
}

// Function to create a new thread
async function createThread() {
  try {
    const thread = await openai.beta.threads.create();
    return thread;
  } catch (error) {
    console.error("Error creating thread:", error);
    return null;
  }
}

// Function to add a message to an existing thread
async function addMessageToThread(threadId, content) {
  try {
    const message = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: content,
    });
    return message;
  } catch (error) {
    console.error("Error adding message to thread:", error);
    return null;
  }
}

// Function to create and stream a run
async function createAndStreamRun(
  threadId,
  assistantId,
  onTextCreated,
  onTextDelta,
  onToolCallCreated,
  onToolCallDelta,
) {
  try {
    const run = openai.beta.threads.runs
      .stream(threadId, {
        assistant_id: assistantId,
      })
      .on("textCreated", onTextCreated)
      .on("textDelta", onTextDelta)
      .on("toolCallCreated", onToolCallCreated)
      .on("toolCallDelta", onToolCallDelta);

    return run;
  } catch (error) {
    console.error("Error creating and streaming run:", error);
    return null;
  }
}

export {
  openai,
  getAssistant,
  createThread,
  addMessageToThread,
  createAndStreamRun,
};

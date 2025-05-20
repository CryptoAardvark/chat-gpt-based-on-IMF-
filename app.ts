const express = require("express");
const axios = require("axios");
const app = express();

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

import { ImfGenerator } from "./utils/imfdata";
import * as dotenv from "dotenv";
dotenv.config();

const pineconeApiKey = process.env.PINECONE_API_KEY;
const openaiApikey = process.env.OPENAI_API_KEY;
if (!pineconeApiKey || !openaiApikey) {
  throw new Error("API key was not defined!");
}

const generator = new ImfGenerator(
  openaiApikey,
  pineconeApiKey
);

async function main() {
  const result = await generator.generateFromPrompt(
    "I want to know about Co2 emissions of the nearest countries of United states"
  );
}

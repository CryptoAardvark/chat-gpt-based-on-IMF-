import { OpenAI } from "openai";
import {
  DateParams,
  APIResponse,
  PineconeParams,
  ResultParams,
} from "../types/type";
import { Pinecone } from "@pinecone-database/pinecone";

export class ImfGenerator {
  private openai: OpenAI;
  private pineconeassist: Pinecone;

  constructor(apiKey: string, pineconeApiKey: string) {
    this.openai = new OpenAI({ apiKey: apiKey });
    this.pineconeassist = new Pinecone({ apiKey: pineconeApiKey });
  }

 
}

import { OpenAI } from "openai";
import {
  DateParams,
  APIResponse,
  PineconeParams,
  Message,
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

  //Function to generate WDI and IMF URLs based on user prompt
  async generateFromPrompt(prompt: string): Promise<APIResponse<string>> {
    try {
      //AI Parsing using openai
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: [
          {
            role: "system",
            content: `When user's query is given, extract year period or single year in user's query. If user's query includes single year, return "start" and "end" as this year. Identify all economic and financial topics (growth rates, inflation, sector-specific metrics).And set "imf_years" to all years in the given period or to a specific year provided (e.g. if the start date is 2020 and the end date is 2022, then "imf_years":["2020", "2021", "2022"]). If a user's question mentions a topic and specific countries or regions but doesn't specify a time period, automatically use the most recent or recent year(latest updated data) as the default time range unless instructed otherwise. Return JSON: {
              "wdi_years": {"start":YYYY,"end":YYYY},
              "imf_years": ["YYYY", "YYYY", "YYYY"],
              "topics": ""topic_name1" and "topic_name2" and "topic_name3"",
              "countries": ["country_iso3code1","country_iso3code2","country_iso3code3"],
              "simpleAnswer": "Type: string | Desc: Human-friendly response to general/non-data questions",
            }
              In above JSON, if the user's query is a general question (e.g., 'hello') or lacks specific parameters (years/countries) or isn't related to IMF/WDI data: 1. Fill ONLY 'simpleAnswer' with a response.
              2. Set all other fields ('wdi_years', 'imf_years', 'topics', 'countries') to null
              3. Other case, not response for 'simpleAnswer'`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 1,
      });

      if (!completion.choices[0].message.content) {
        throw new Error("AI response content is null");
      }

      let sanitizedContent = completion.choices[0].message.content
        .replace(/```json/g, "") // Remove JSON code block markers
        .replace(/```/g, "") // Remove stray backticks
        .trim();
      let params: DateParams = JSON.parse(sanitizedContent);
      console.log("params ->", params);

      //Case response includes only simple answer.
      if (params.simpleAnswer !== null) {
        return { data: { imf: "", topics: params.topics } };
      } else {
        //AI Parsing using pinecone
        const assistant = this.pineconeassist.Assistant("financial-assistant");

        const msg: Message = {
          role: "user",
          content: params.topics,
        };

        const resp = await assistant._chat({ messages: [msg] });
        if (!resp.message) {
          throw new Error("Pinecone response content is null");
        }

        const pineconeParams: PineconeParams = JSON.parse(
          resp.message.content!
        );

        console.log("pineconeParams ->", pineconeParams);

        //URL Construction
        let IMFurl: string = "";
        if (
          params.countries !== null &&
          pineconeParams.imf_indicators.length !== 0 &&
          params.imf_years.length !== 0
        ) {
          IMFurl =
            `https://www.imf.org/external/datamapper/api/v2/${pineconeParams.imf_indicators.join(
              "/"
            )}/${params.countries.join("/")}` +
            `?periods=${params.imf_years.join(",")}`;
        }
        return { data: { imf: IMFurl, topics: params.topics } };
      }
    } catch (error) {
      console.log("error ->", " error is ready");
      let errorMessage = "Unknown error";
      if (error instanceof Error) errorMessage = error.message;
      return { data: {imf: "", topics: "" }, error: errorMessage };
    }
  }
}

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import requests  # we'll use this to call Gemini API
import google.generativeai as genai





#Gemini config
 
API_KEY = "AIzaSyBiZn8hHDEX-LldSzoiy6dByiQXghTYssQ"
genai.configure(api_key=API_KEY)
def ask_gemini(prompt: str) -> str:
  model = genai.GenerativeModel("gemini-2.5-flash")
  response = model.generate_content(prompt)

  return response.text



app = FastAPI()

# Enable CORS for your React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

# Load your feedback responses
with open("responses.json", "r", encoding="utf-8") as f:
    responses_data = json.load(f)


@app.post("/query")


def query_gemini(request: QueryRequest):
    user_query = request.query

    # Combine user query + JSON data as context
    context = {
        "user_query": user_query,
        "responses_json": responses_data
    }


    
    prompt = f"Answer the question using only the following JSON as reference:\n{json.dumps(responses_data)}\nThis json contains the feedback data collected from oraganization's employees.\nQuestion: {user_query}"
    

    try:
        resp = ask_gemini(prompt)
        return {"response": resp}

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error calling Gemini API: {e}")



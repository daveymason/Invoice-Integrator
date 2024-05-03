import base64
from binascii import a2b_base64
import vertexai
from vertexai.generative_models import GenerativeModel, Part
import vertexai.preview.generative_models as generative_models

def generate(pdf_base64):
  pdf_data = base64.b64decode(pdf_base64)
  document1 = Part.from_data(
        mime_type="application/pdf",
        data=pdf_data  # Binary PDF data
    )
  
  text1 = """You are a document entity extraction specialist. Given a document, your task is to extract the text value and of and then translate the extracted text into Engglish. 
 Develop a machine learning model that takes as input a PDF invoice and extracts all textual content without assuming a fixed structure. 
 The extracted text should then be structured into a JSON format where each discernible piece of data is assigned a probable field name based on its content (e.g., 'date', 'total', 'invoice number'). 
 The JSON should include all text elements found in the PDF to ensure no data is missed. 
 If certain data cannot be confidently assigned to a field, set to null but include the data that can be extracted.  
 The output should be easily readable JSON that presents all extracted data in a structured form. The model should be able to handle a variety of invoice formats and layouts, including those with multiple pages, tables, and images.

- The values must only include text found in the document
- Do not normalize any entity value.
- The output should be in English."""

  vertexai.init(project="invoice-integrator", location="us-central1")
  model = GenerativeModel("gemini-1.5-pro-preview-0409")
  
  generation_config = {
    "max_output_tokens": 800,  #  $0.000004 per 50 invoices. $1 per 250,000 invoices.
    "temperature": 1,
    "top_p": 0.95,
  }

  safety_settings = {
    generative_models.HarmCategory.HARM_CATEGORY_HATE_SPEECH: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    generative_models.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    generative_models.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    generative_models.HarmCategory.HARM_CATEGORY_HARASSMENT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  }

  responses = model.generate_content(
        [document1, text1],
        generation_config=generation_config,
        safety_settings=safety_settings,
        stream=True,
    )

  extracted_data = ""
  for response in responses:
        extracted_data += response.text

  return extracted_data
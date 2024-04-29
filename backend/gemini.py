import base64
from binascii import a2b_base64
import vertexai
from vertexai.generative_models import GenerativeModel, Part, FinishReason
import vertexai.preview.generative_models as generative_models

def generate(pdf_base64):
  pdf_data = base64.b64decode(pdf_base64)
  document1 = Part.from_data(
        mime_type="application/pdf",
        data=pdf_data  # Binary PDF data
    )
  
  text1 = """You are a document entity extraction specialist. Given a document, your task is to extract the text value of the following entities:
  {
	\"amount_paid_since_last_invoice\": \"\",
	\"carrier\": \"\",
	\"currency\": \"\",
	\"currency_exchange_rate\": \"\",
	\"delivery_date\": \"\",
	\"due_date\": \"\",
	\"freight_amount\": \"\",
	\"invoice_date\": \"\",
	\"invoice_id\": \"\",
	\"line_items\": [
		{
			\"amount\": \"\",
			\"description\": \"\",
			\"product_code\": \"\",
			\"purchase_order\": \"\",
			\"quantity\": \"\",
			\"unit\": \"\",
			\"unit_price\": \"\"
		}
	],
	\"net_amount\": \"\",
	\"payment_terms\": \"\",
	\"purchase_order\": \"\",
	\"receiver_address\": \"\",
	\"receiver_email\": \"\",
	\"receiver_name\": \"\",
	\"receiver_phone\": \"\",
	\"receiver_tax_id\": \"\",
	\"receiver_website\": \"\",
	\"remit_to_address\": \"\",
	\"remit_to_name\": \"\",
	\"ship_from_address\": \"\",
	\"ship_from_name\": \"\",
	\"ship_to_address\": \"\",
	\"ship_to_name\": \"\",
	\"supplier_address\": \"\",
	\"supplier_email\": \"\",
	\"supplier_iban\": \"\",
	\"supplier_name\": \"\",
	\"supplier_payment_ref\": \"\",
	\"supplier_phone\": \"\",
	\"supplier_registration\": \"\",
	\"supplier_tax_id\": \"\",
	\"supplier_website\": \"\",
	\"total_amount\": \"\",
	\"total_tax_amount\": \"\",
	\"vat\": [
		{
			\"amount\": \"\",
			\"category_code\": \"\",
			\"tax_amount\": \"\",
			\"tax_rate\": \"\",
			\"total_amount\": \"\"
		}
	]
  }

- The JSON schema must be followed EXACTLY during the extraction.
- The values must only include text found in the document
- Do not normalize any entity value.
- If an entity is not found in the document, set the entity value to null."""

  vertexai.init(project="invoice-integrator", location="us-central1")
  model = GenerativeModel("gemini-1.5-pro-preview-0409")
  
  generation_config = {
    "max_output_tokens": 800,
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


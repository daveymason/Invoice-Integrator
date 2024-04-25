import base64
import vertexai
from vertexai.generative_models import GenerativeModel, Part, FinishReason
import vertexai.preview.generative_models as generative_models

def generate():
	vertexai.init(project="invoice-integrator", location="us-central1")
	model = GenerativeModel("gemini-1.5-pro-preview-0409")
	responses = model.generate_content(
		[text1],
		generation_config=generation_config,
		safety_settings=safety_settings,
		stream=True,
	)

	generated_content = []
	for response in responses:
		generated_content.append(response.text)
	
	return ''.join(generated_content)


text1 = """Please suggest 5 managers for Liverpool FC. The managers should have experience in Europe and have won at least one major trophy. The managers should also have a win percentage of at least 50% in their last 3 seasons."""

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

generate()
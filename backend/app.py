from flask import Flask, send_from_directory, request, jsonify
import os
import base64
import logging
from werkzeug.utils import secure_filename
from gemini import generate

app = Flask(__name__, static_folder='../dist')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        app.logger.error('No file part in the request')
        return jsonify({'error': 'No file provided.'}), 400

    file = request.files['file']

    if file.filename == '':
        app.logger.error('No file selected for uploading')
        return jsonify({'error': 'No selected file.'}), 400

    if file:
        filename = secure_filename(file.filename)
        upload_dir = '/uploads'
        os.makedirs(upload_dir, exist_ok=True)
        filepath = os.path.join(upload_dir, filename)
        try:
            file.save(filepath)
            app.logger.info(f'File saved successfully at {filepath}')
        except Exception as e:
            app.logger.error(f'Failed to save file at {filepath}: {e}')
            return jsonify({'error': str(e)}), 500

        try:
            with open(filepath, "rb") as pdf_file:
                pdf_content = pdf_file.read()
            pdf_content_base64 = base64.b64encode(pdf_content).decode('utf-8')
            extracted_data = generate(pdf_content_base64)
            app.logger.info('File processed successfully')
            return jsonify({'message': 'File processed successfully.', 'data': extracted_data}), 200
        except Exception as e:
            app.logger.error('Error processing file', exc_info=True)
            return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    app.run(debug=False)  # Ensure this is set to False in your production deployment

from google.cloud import storage
import uuid  # for generating unique filenames (optional)

def handle_pdf_upload(request):
    """Handles PDF uploads and stores them in Cloud Storage."""

    # Access uploaded file (assuming request.files contains the data)
    uploaded_file = request.files.get('pdf_file')  # Replace 'pdf_file' with your actual field name

    # Check if a file was uploaded
    if not uploaded_file:
        return "No file uploaded!", 400  # Return error if no file found

    # Validate file extension (optional)
    if not uploaded_file.filename.lower().endswith(".pdf"):
        return "Invalid file format. Only PDFs allowed!", 400

    # Get Cloud Storage bucket name (replace with your actual bucket name)
    bucket_name = "your-bucket-name"

    # Create a Cloud Storage client
    storage_client = storage.Client()

    # Get a reference to the bucket
    bucket = storage_client.bucket(bucket_name)

    # Generate a unique filename (optional)
    filename = f"{uuid.uuid4()}.pdf"  # Using uuid for uniqueness

    # Create a blob object representing the file in Cloud Storage
    blob = bucket.blob(filename)

    # Upload the file data to the blob
    blob.upload_from_string(uploaded_file.read())

    # Return a success message
    return f"PDF uploaded successfully! (Filename: {filename})", 201
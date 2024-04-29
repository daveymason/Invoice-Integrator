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
        upload_dir = '/tmp/uploads'
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

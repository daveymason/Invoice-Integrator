from flask import Flask, send_from_directory, request, jsonify
import os
import base64
import logging
from werkzeug.utils import secure_filename
from gemini import generate


app = Flask(__name__, static_folder='../dist')  # Pointing to the dist directory

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
        return jsonify({'error': 'No file provided.'}), 400

    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file.'}), 400

    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join('uploads', filename)
        file.save(filepath)
        
        with open(filepath, "rb") as pdf_file:
            pdf_content = pdf_file.read()
        pdf_content_base64 = base64.b64encode(pdf_content).decode('utf-8')

    try:
        app.logger.info('Processing file: %s', filename)
        extracted_data = generate(pdf_content_base64)
        app.logger.info('File processed successfully')
        return jsonify({'message': 'File processed successfully.', 'data': extracted_data}), 200
    except Exception as e:
        app.logger.error('Error processing file', exc_info=e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    app.run(debug=True)
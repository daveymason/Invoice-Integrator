from flask import Flask, send_from_directory, request, jsonify
import os
from werkzeug.utils import secure_filename
from gemini import generate  # Make sure this import matches the name of your actual function


app = Flask(__name__, static_folder='../dist')  # Pointing to the dist directory

@app.route('/generate-suggestions', methods=['GET'])
def generate_suggestions_route():
    try:
        suggestions = generate()
        response = jsonify({'suggestions': suggestions})
        response.headers['Cache-Control'] = 'no-store'
        return response, 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


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
        filepath = os.path.join('backend/uploads', filename)
        file.save(filepath)
        
        try:
            # Here you call your model processing function, ensure it takes the file path
            # as the argument, or adjust it to send the file content if necessary.
            response = generate(filepath)  # Adjust if your function expects different input
            return jsonify({'message': 'File processed successfully.', 'data': response}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
 


    

if __name__ == '__main__':
    app.run(debug=True)
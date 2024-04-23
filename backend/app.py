from flask import Flask, send_from_directory, request, jsonify
import os

app = Flask(__name__, static_folder='../dist')  # Pointing to the dist directory

# This route serves your SPA's static files.
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# This route will handle file uploads.
@app.route('/upload', methods=['POST'])
def upload_file():
    # Check if a file is present in the request
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided.'}), 400

    # Get the file from the request
    file = request.files['file']
    
    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file.filename == '':
        return jsonify({'error': 'No selected file.'}), 400

    # Save the file to a directory on the server
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join('/path/to/your/uploads', filename)
        file.save(filepath)
        return jsonify({'message': 'File uploaded successfully.'}), 200

if __name__ == '__main__':
    app.run(debug=True)

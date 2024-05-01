import os
from flask import Blueprint, request, current_app

upload_bp = Blueprint('upload_bp', __name__)

@upload_bp.route('/tmp/upload', methods=['POST'])

def handle_upload():
    for uploaded_file in request.files.getlist('file'):
        if uploaded_file.filename != '':
            filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], uploaded_file.filename)
            uploaded_file.save(filepath)
    return {'message': 'Files uploaded successfully'}, 200
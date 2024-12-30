from flask import Blueprint, request, send_from_directory, jsonify
import os

# Create a blueprint for image-related routes
image_bp = Blueprint('image', __name__)

# Define the upload folder
UPLOAD_FOLDER = 'uploads/images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Function to check if the file extension is allowed
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@image_bp.route('/api/images/upload', methods=['POST'])
def upload_image():
    file = request.files['file']
    if not file:
        return 'No file part', 400
    
    if file.filename == '':
        return 'No selected file', 400

    if file and allowed_file(file.filename):
        filename = file.filename
        for ext in ALLOWED_EXTENSIONS:
            fullfilename = f"{filename}.{ext}"
            filepath = os.path.join(UPLOAD_FOLDER, fullfilename)
            if os.path.isfile(filepath):
                os.remove(filepath)
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        return jsonify({"image": f"/images/{filename}"}), 200
    else:
        return 'Invalid file type', 400

def find_matching_file(filename):
    for ext in ALLOWED_EXTENSIONS:
        full_filename = filename + '.' + ext
        filepath = os.path.join(UPLOAD_FOLDER, full_filename)
        if os.path.isfile(filepath):
            return full_filename
    return None

@image_bp.route('/api/images/<filename>', methods=['GET'])
def download_image(filename):
    full_filename = find_matching_file(filename)
    if full_filename:
        return send_from_directory(UPLOAD_FOLDER, full_filename)
    else:
        return 'File not found', 404
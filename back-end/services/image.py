import os
class ImageService():
    def __init__(self) -> None:
        self.UPLOAD_FOLDER = 'uploads/images'
        self.ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
        pass

    def allowed_file(self, filename):
        return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in self.ALLOWED_EXTENSIONS

    def save_file(self, file, filename, extension):
        if not file:
            return False, 'No file part'
        
        if file.filename == '':
            return False, 'No selected file'
        
        if file and self.allowed_file(file.filename):
            for ext in self.ALLOWED_EXTENSIONS:
                fullfilename = f"{filename}.{ext}"
                filepath = os.path.join(self.UPLOAD_FOLDER, fullfilename)
            if os.path.isfile(filepath):
                os.remove(filepath)
            file.save(os.path.join(self.UPLOAD_FOLDER, f'{filename}.{extension}'))
            return True, filename
        else:
            return False, 'Invalid file type'
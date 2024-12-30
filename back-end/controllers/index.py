from flask import Blueprint

index_bp = Blueprint('index', __name__)

@index_bp.route('/api')
def health():
    return "Server is living", 200
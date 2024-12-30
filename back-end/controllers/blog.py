from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.blog import BlogService

blog_bp = Blueprint('blog', __name__)
blog_service = BlogService()

@blog_bp.route('/api/blogs', methods=['GET'])
def get_all_blogs():
    try:
        blogs = blog_service.get_all()
        return jsonify({
            "message": "success",
            "blogs": blogs
        }), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@blog_bp.route('/api/blogs/<blog_id>', methods=['GET'])
def get_blog_by_id(blog_id):
    try:
        blog = blog_service.get(blog_id)
        if blog:
            return jsonify({
                "message": "success",
                "blog": blog
            }), 200
        else:
            return jsonify({'message': 'blog not found'}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@blog_bp.post('/api/blogs')
@jwt_required()
def create_blog():
    user_id = get_jwt_identity()
    try:
        data = {
            "title": request.form.get('title'),
            "description": request.form.get('description'),
            "image": request.files.get('image'),
            "content": request.form.get('content'),
            "author_id": str(user_id)
        }
        new_blog = blog_service.create(data)
        return jsonify({
            "message": "success",
            "blog": new_blog
        }), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@blog_bp.route('/api/blogs/<blog_id>', methods=['PUT'])
@jwt_required()
def update_blog(blog_id):
    try:
        data = {
            "title": request.form.get('title'),
            "description": request.form.get('description'),
            "image": request.files.get('image'),
            "content": request.form.get('content'),
        }
        updated = blog_service.update(blog_id, data)
        if updated:
            return jsonify({
                "message": "success",
            }), 200
        else:
            return jsonify({'message': 'blog not found'}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@blog_bp.route('/api/blogs/<blog_id>', methods=['DELETE'])
@jwt_required()
def delete_blog(blog_id):
    try:
        success = blog_service.delete(blog_id)
        if success:
            return jsonify({'message': 'blog deleted successfully'}), 200
        else:
            return jsonify({'message': 'blog not found'}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@blog_bp.post('/api/blogs/<blog_id>/comment')
@jwt_required()
def add_comment(blog_id):
    user_id = get_jwt_identity()
    try:
        comment_data = request.get_json()
        blog = blog_service.add_comment(blog_id, comment_data, user_id)
        return jsonify(blog), 200
    except Exception as e:
        return str(e), 500

@blog_bp.put('/api/blogs/<blog_id>/like')
@jwt_required()
def toggle_like_blog(blog_id):
    user_id = get_jwt_identity()
    try:
        blog = blog_service.toggle_like(blog_id, user_id)
        return jsonify(blog), 200
    except Exception as e:
        return str(e), 500
    
@blog_bp.route('/api/blogs/top/<number>', methods=['GET'])
def get_top_blogs(number):
    try:
        blogs = blog_service.get_top(int(number))
        return jsonify({
            "message": "success",
            "blogs": blogs
        }), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
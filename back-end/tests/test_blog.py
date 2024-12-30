import pytest
from unittest.mock import patch
from flask import url_for
from flask_jwt_extended import create_access_token

def get_auth_headers(user_id):
    access_token = create_access_token(identity=user_id)
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    return headers

def test_get_all_blogs(test_client):
    with patch('services.blog.BlogService.get_all') as mock_get_all:
        mock_get_all.return_value = [{"title": "Test Blog"}]

        response = test_client.get('/api/blogs')
        assert response.status_code == 200
        assert response.json['message'] == 'success'
        assert 'blogs' in response.json

def test_get_blog_by_id(test_client):
    blog_id = 'test_blog_id'
    with patch('services.blog.BlogService.get') as mock_get:
        mock_get.return_value = {"title": "Test Blog"}

        response = test_client.get(f'/api/blogs/{blog_id}')
        assert response.status_code == 200
        assert response.json['message'] == 'success'
        assert 'blog' in response.json

def test_create_blog(test_client):
    user_id = 'test_user_id'
    headers = get_auth_headers(user_id)
    
    with patch('services.blog.BlogService.create') as mock_create:
        mock_create.return_value = {"title": "New Blog"}

        response = test_client.post('/api/blogs', headers=headers, data={
            'title': 'New Blog',
            'description': 'Blog Description',
            'content': 'Blog Content'
        })
        assert response.status_code == 201
        assert response.json['message'] == 'success'
        assert 'blog' in response.json

def test_update_blog(test_client):
    blog_id = 'test_blog_id'
    user_id = 'test_user_id'
    headers = get_auth_headers(user_id)

    with patch('services.blog.BlogService.update') as mock_update:
        mock_update.return_value = True

        response = test_client.put(f'/api/blogs/{blog_id}', headers=headers, data={
            'title': 'Updated Blog',
            'description': 'Updated Description',
            'content': 'Updated Content'
        })
        assert response.status_code == 200
        assert response.json['message'] == 'success'

def test_delete_blog(test_client):
    blog_id = 'test_blog_id'
    user_id = 'test_user_id'
    headers = get_auth_headers(user_id)

    with patch('services.blog.BlogService.delete') as mock_delete:
        mock_delete.return_value = True

        response = test_client.delete(f'/api/blogs/{blog_id}', headers=headers)
        assert response.status_code == 200
        assert response.json['message'] == 'blog deleted successfully'

def test_add_comment(test_client):
    blog_id = 'test_blog_id'
    user_id = 'test_user_id'
    headers = get_auth_headers(user_id)

    with patch('services.blog.BlogService.add_comment') as mock_add_comment:
        mock_add_comment.return_value = {"title": "Test Blog", "comments": ["New Comment"]}

        response = test_client.post(f'/api/blogs/{blog_id}/comment', headers=headers, json={
            'content': 'New Comment'
        })
        assert response.status_code == 200
        assert 'comments' in response.json

def test_toggle_like_blog(test_client):
    blog_id = 'test_blog_id'
    user_id = 'test_user_id'
    headers = get_auth_headers(user_id)

    with patch('services.blog.BlogService.toggle_like') as mock_toggle_like:
        mock_toggle_like.return_value = {"title": "Test Blog", "likes": 1}

        response = test_client.put(f'/api/blogs/{blog_id}/like', headers=headers)
        assert response.status_code == 200
        assert 'likes' in response.json

def test_get_top_blogs(test_client):
    number = 5
    with patch('services.blog.BlogService.get_top') as mock_get_top:
        mock_get_top.return_value = [{"title": "Top Blog"}]

        response = test_client.get(f'/api/blogs/top/{number}')
        assert response.status_code == 200
        assert response.json['message'] == 'success'
        assert 'blogs' in response.json

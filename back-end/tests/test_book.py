from unittest.mock import patch
from flask_jwt_extended import create_access_token


def get_auth_headers(user_id):
    access_token = create_access_token(identity=user_id)
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    return headers

def test_get_all_books(test_client):
    with patch('services.book.BookService.get_all') as mock_get_all:
        mock_get_all.return_value = [{"title": "Test Book"}]

        response = test_client.get('/api/books')
        assert response.status_code == 200
        assert response.json['message'] == 'success'
        assert 'books' in response.json

def test_get_book_by_id(test_client):
    book_id = 'test_book_id'
    with patch('services.book.BookService.get') as mock_get:
        mock_get.return_value = {"title": "Test Book"}

        response = test_client.get(f'/api/books/{book_id}')
        assert response.status_code == 200
        assert response.json['message'] == 'success'
        assert 'book' in response.json

def test_create_book(test_client):
    user_id = 'test_user_id'
    headers = get_auth_headers(user_id)
    
    with patch('services.book.BookService.create') as mock_create:
        mock_create.return_value = {"title": "New Book"}

        response = test_client.post('/api/books', headers=headers, data={
            'title': 'New Book',
            'description': 'Book Description',
            'content': 'Book Content'
        })
        assert response.status_code == 201
        assert response.json['message'] == 'success'
        assert 'book' in response.json

def test_update_book(test_client):
    book_id = 'test_book_id'
    user_id = 'test_user_id'
    headers = get_auth_headers(user_id)

    with patch('services.book.BookService.update') as mock_update:
        mock_update.return_value = True

        response = test_client.put(f'/api/books/{book_id}', headers=headers, data={
            'title': 'Updated Book',
            'description': 'Updated Description',
            'content': 'Updated Content'
        })
        assert response.status_code == 200
        assert response.json['message'] == 'success'

def test_delete_book(test_client):
    book_id = 'test_book_id'
    user_id = 'test_user_id'
    headers = get_auth_headers(user_id)

    with patch('services.book.BookService.delete') as mock_delete:
        mock_delete.return_value = True

        response = test_client.delete(f'/api/books/{book_id}', headers=headers)
        assert response.status_code == 200
        assert response.json['message'] == 'Book deleted successfully'

def test_get_top_books(test_client):
    number = 5
    with patch('services.book.BookService.get_top') as mock_get_top:
        mock_get_top.return_value = [{"title": "Top Book"}]

        response = test_client.get(f'/api/books/top/{number}')
        assert response.status_code == 200
        assert response.json['message'] == 'success'
        assert 'books' in response.json

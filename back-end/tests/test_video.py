import json
created_video_id = None

def test_get_all_videos(test_client):
    # Make GET request to fetch all videos
    response = test_client.get('/api/videos')
    assert response.status_code == 200
    assert b'success' in response.data

def test_get_video_by_id(test_client):
    # Make GET request to fetch video by ID
    response = test_client.get('/api/videos/6663c405180790be0683de4b')  # Replace '1' with an existing video ID for testing
    assert response.status_code in [200, 404]  # Assuming 404 for video not found is valid too

def test_create_video(test_client, admin_access_token):
    global created_video_id
    new_video_data = {
        'title': 'New Video',
        'description': 'Description of the new video',
        'link': 'https://www.youtube.com/new_video',
        'content': 'Video content'
    }
    headers = {
        'Authorization': f'Bearer {admin_access_token}',
        'Content-Type': 'application/json'
    }

    response = test_client.post('/api/videos', headers=headers, json=new_video_data)
    assert response.status_code == 201
    assert b'success' in response.data
    data = json.loads(response.data)
    created_video_id = data['video']['_id']

def test_update_video(test_client, admin_access_token):
    global created_video_id
    update_data = {
        'title': 'Updated Video Title',
        'description': 'Updated description of the video',
        'link': 'https://www.youtube.com/updated_video',
        'content': 'Updated video content'
    }
    headers = {
        'Authorization': f'Bearer {admin_access_token}',
        'Content-Type': 'application/json'
    }
    response = test_client.put(f'/api/videos/{created_video_id}',headers=headers, json=update_data)
    assert response.status_code in [200, 404]

def test_delete_video(test_client, admin_access_token):
    global created_video_id
    headers = {
        'Authorization': f'Bearer {admin_access_token}',
        'Content-Type': 'application/json'
    }
    response = test_client.delete(f'/api/videos/{created_video_id}', headers=headers) 
    assert response.status_code in [200, 404]  

def test_get_top_videos(test_client, admin_access_token):
    headers = {
        'Authorization': f'Bearer {admin_access_token}',
        'Content-Type': 'application/json'
    }
    response = test_client.get('/api/videos/top/5', headers=headers)  
    assert response.status_code == 200
    assert b'success' in response.data
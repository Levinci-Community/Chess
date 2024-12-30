import json

def test_get_all_achievements(test_client):
    response = test_client.get('/api/achievements')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'message' in data
    assert 'achievements' in data
    assert data['message'] == 'success'

def test_get_honor_list(test_client):
    response = test_client.get('/api/achievements/honor-list')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'message' in data
    assert 'honor_list' in data
    assert 'events' in data
    assert data['message'] == 'success'

def test_get_achievement_by_id(test_client):
    # Assuming there's an achievement with ID '1' in the test database
    achievement_id = '6679a1890554130fed1d000d'
    response = test_client.get(f'/api/achievements/{achievement_id}')
    assert response.status_code in [200, 404]
    data = json.loads(response.data)
    assert 'message' in data
    if response.status_code == 200:
        assert 'achievement' in data
        assert data['message'] == 'success'
    elif response.status_code == 404:
        assert data['message'] == 'achievement not found'

def test_create_achievement(test_client, admin_access_token):
    data = {
        "event": "New Achievement",
        "time": "2024-06-24",
        "member": "John Doe",
        "reward": "Gold Medal"
    }
    response = test_client.post('/api/achievements',headers={
        'Authorization': f'Bearer {admin_access_token}'
    }, json=data)
    assert response.status_code == 201
    data = json.loads(response.data)
    assert 'message' in data
    assert 'achievement' in data
    assert data['message'] == 'success'

def test_update_achievement(test_client,admin_access_token):
    achievement_id = '6672eb060ae70c1a26c15dca'
    data = {
        "event": "Updated Achievement",
        "time": "2024-06-25",
        "member": "Jane Doe",
        "reward": "Silver Medal"
    }
    response = test_client.put(f'/api/achievements/{achievement_id}',headers={
        'Authorization': f'Bearer {admin_access_token}'
    }, json=data)
    assert response.status_code in [200, 404]
    data = json.loads(response.data)
    assert 'message' in data
    if response.status_code == 200:
        assert data['message'] == 'success'
    elif response.status_code == 404:
        assert data['message'] == 'achievement not found'

# def test_delete_achievement(test_client):
#     achievement_id = '6672eb060ae70c1a26c15dca'
#     response = test_client.delete(f'/api/achievements/{achievement_id}')
#     assert response.status_code in [200, 404]
#     data = json.loads(response.data)
#     assert 'message' in data
#     if response.status_code == 200:
#         assert data['message'] == 'achievement deleted successfully'
#     elif response.status_code == 404:
#         assert data['message'] == 'achievement not found'

def test_get_top_achievements(test_client):
    number = 5  # Number of top achievements to fetch
    response = test_client.get(f'/api/achievements/top/{number}')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'message' in data
    assert 'achievements' in data
    assert data['message'] == 'success'

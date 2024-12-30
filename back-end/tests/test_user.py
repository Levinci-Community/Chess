
def test_update_profile(test_client, admin_access_token):
    headers = {
        'Authorization': f'Bearer {admin_access_token}',
        'Content-Type': 'application/json'
    }
    update_data = {
        
    }
    response = test_client.put('/api/update-profile',headers=headers, json=update_data)
    assert response.status_code == 400

def test_get_profile(test_client, admin_access_token):
    headers = {
        'Authorization': f'Bearer {admin_access_token}',
        'Content-Type': 'application/json'
    }
    response = test_client.get('/api/profile', headers=headers)
    assert response.status_code == 200
    assert b'username' in response.data

def test_user_profile(test_client, admin_access_token):
    user_name = "leetun2k2"
    headers = {
        'Authorization': f'Bearer {admin_access_token}',
        'Content-Type': 'application/json'
    }
    response = test_client.get(f'/api/user/{user_name}', headers=headers)
    assert response.status_code in [200, 404]

def test_get_all_users(test_client, admin_access_token):
    headers = {
        'Authorization': f'Bearer {admin_access_token}',
        'Content-Type': 'application/json'
    }
    response = test_client.get('/api/users', headers=headers)
    assert response.status_code == 200
    assert b'success' in response.data

def test_get_all_admins(test_client, admin_access_token):
    headers = {
        'Authorization': f'Bearer {admin_access_token}',
        'Content-Type': 'application/json'
    }
    response = test_client.get('/api/users/admins', headers=headers)
    assert response.status_code == 200
    assert b'success' in response.data


def test_toggle_status(test_client, admin_access_token):
    headers = {
        'Authorization': f'Bearer {admin_access_token}',
        'Content-Type': 'application/json'
    }
    user_id = '6661c884acf0d42985b70a28' 
    response = test_client.put(f'/api/users/{user_id}/status', headers=headers)
    assert response.status_code in [200, 400] 
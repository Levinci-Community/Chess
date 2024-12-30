import json
import pytest
from unittest.mock import patch, MagicMock

@pytest.fixture(scope='module')
def new_notification():
    return {
        "title": "New Notification",
        "description": "This is a new notification."
    }

def test_get_all_notifications(test_client, admin_access_token):
    headers = {
        'Authorization': f'Bearer {admin_access_token}',
        'Content-Type': 'application/json'
    }
    response = test_client.get('/api/notifications', headers=headers)
    assert response.status_code == 200
    assert "notifications" in response.json

def test_get_notification_by_id(test_client, admin_access_token):
    headers = {
        'Authorization': f'Bearer {admin_access_token}',
        'Content-Type': 'application/json'
    }
    response = test_client.get('/api/notifications/1', headers=headers)
    assert response.status_code == 500


@patch('services.notification.NotificationService.create')
def test_create_notification(mock_create, test_client, new_notification, admin_access_token):
    headers = {
        'Authorization': f'Bearer {admin_access_token}',
        'Content-Type': 'application/json'
    }
    mock_create.return_value = new_notification
    
    
    response = test_client.post('/api/notifications',
                                data=json.dumps(new_notification),
                                content_type='application/json',
                                headers=headers)
    
    assert response.status_code == 201

@patch('services.notification.NotificationService.update')
def test_update_notification(mock_update, test_client, admin_access_token):
    headers = {
        'Authorization': f'Bearer {admin_access_token}',
        'Content-Type': 'application/json'
    }
    mock_update.return_value = True
    
    update_data = {
        "title": "Updated Notification",
        "description": "This is an updated notification."
    }
    
    response = test_client.put('/api/notifications/1',
                               data=json.dumps(update_data),
                               content_type='application/json',
                               headers=headers)
    
    assert response.status_code == 200

@patch('services.notification.NotificationService.delete')
def test_delete_notification(mock_delete, test_client, admin_access_token):
    headers = {
        'Authorization': f'Bearer {admin_access_token}',
        'Content-Type': 'application/json'
    }
    mock_delete.return_value = True
    
    
    response = test_client.delete('/api/notifications/1',
                                  headers=headers)
    
    assert response.status_code == 200

def test_get_top_notifications(test_client, admin_access_token):
    headers = {
        'Authorization': f'Bearer {admin_access_token}',
        'Content-Type': 'application/json'
    }
    response = test_client.get('/api/notifications/top', headers=headers)
    assert response.status_code == 200
    assert "notifications" in response.json

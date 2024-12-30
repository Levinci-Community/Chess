from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.adminDashboard import AdminDashboardService

adminDashboard_bp = Blueprint('adminDashboard', __name__)
adminDashboard_service = AdminDashboardService()

@adminDashboard_bp.route('/api/dashboard/ajax_request_http_method', methods=['GET'])
def get_ajax_request_http_method():
    try:
        data = adminDashboard_service.get_ajax_request_http_method()
        return jsonify({
            "message": "success",
            "data": data
        }), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    

@adminDashboard_bp.route('/api/dashboard/ajax_request_hostname', methods=['GET'])
def get_ajax_request_hostname():
    try:
        data = adminDashboard_service.get_ajax_request_hostname()
        return jsonify({
            "message": "success",
            "data": data
        }), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    

@adminDashboard_bp.route('/api/dashboard/ajax_request_page_url', methods=['GET'])
def get_ajax_request_page_url():
    try:
        data = adminDashboard_service.get_ajax_request_page_url()
        return jsonify({
            "message": "success",
            "data": data
        }), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    

@adminDashboard_bp.route('/api/dashboard/browser_interaction', methods=['GET'])
def get_browser_interaction():
    try:
        data = adminDashboard_service.get_browser_interaction()
        return jsonify({
            "message": "success",
            "data": data
        }), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    

@adminDashboard_bp.route('/api/dashboard/ajax_request_http_response_code_hostname', methods=['GET'])
def get_ajax_request_http_response_code_hostname():
    try:
        data = adminDashboard_service.get_ajax_request_http_response_code_hostname()
        return jsonify({
            "message": "success",
            "data": data
        }), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    

@adminDashboard_bp.route('/api/dashboard/transaction_summary', methods=['GET'])
def get_transaction_summary():
    try:
        data = adminDashboard_service.get_transaction_summary()
        return jsonify({
            "message": "success",
            "data": data
        }), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    

@adminDashboard_bp.route('/api/dashboard/failed_transactions', methods=['GET'])
def get_failed_transactions():
    try:
        data = adminDashboard_service.get_failed_transactions()
        return jsonify({
            "message": "success",
            "data": data
        }), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    

@adminDashboard_bp.route('/api/dashboard/metric_summary', methods=['GET'])
def get_metric_summary():
    try:
        data = adminDashboard_service.get_metric_summary()
        return jsonify({
            "message": "success",
            "data": data
        }), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    

@adminDashboard_bp.route('/api/dashboard/apdex', methods=['GET'])
def get_apdex():
    try:
        data = adminDashboard_service.get_apdex()
        return jsonify({
            "message": "success",
            "data": data
        }), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    

@adminDashboard_bp.route('/api/dashboard/web_transaction_facet_name', methods=['GET'])
def get_web_transaction_facet_name():
    try:
        data = adminDashboard_service.get_web_transaction_facet_name()
        return jsonify({
            "message": "success",
            "data": data
        }), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    



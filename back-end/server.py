from flask import Flask
from flask_cors import CORS
from flask_mail import Mail
from flask_login import LoginManager
from flask_jwt_extended import JWTManager
from secrets import token_hex
from services.user import UserService
from datetime import timedelta
from flask_socketio import SocketIO

from controllers.index import index_bp
from controllers.auth import auth_bp
from controllers.test import test_bp
from controllers.user import user_bp
from controllers.game import game_bp
from controllers.lobby import lobby_bp
from controllers.auth_google import authgg_bp
from controllers.image import image_bp
from controllers.blog import blog_bp
from controllers.puzzle import puzzle_bp
from controllers.lessons import lesson_bp
from controllers.book import book_bp
from controllers.tournament import tournament_bp
from controllers.achievement import achievement_bp
from controllers.video import video_bp
from controllers.others import other_bp
from controllers.notification import notification_bp
from controllers.blitzTactics import blitztactic_bp
from controllers.adminDashboard import adminDashboard_bp
from controllers.ai_game import ai_game_bp
from controllers.banner import banner_bp
from controllers.tournament_game import tournament_game_bp

app = Flask(__name__)

# enable cors
CORS(app)
CORS(index_bp)
CORS(auth_bp)
CORS(test_bp)
CORS(user_bp)
CORS(game_bp)
CORS(lobby_bp)
CORS(authgg_bp)
CORS(image_bp)
CORS(blog_bp)
CORS(puzzle_bp)
CORS(lesson_bp)
CORS(book_bp)
CORS(tournament_bp)
CORS(achievement_bp)
CORS(video_bp)
CORS(other_bp)
CORS(notification_bp)
CORS(blitztactic_bp)
CORS(adminDashboard_bp)
CORS(ai_game_bp)
CORS(banner_bp)
CORS(tournament_game_bp)

app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SECRET_KEY'] = 'a' # token_hex()
app.config['JWT_SECRET_KEY'] = 'a' # token_hex()
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

# Register email service
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'letung109922@gmail.com'
app.config['MAIL_PASSWORD'] = 'lspjxfdsmfugwgfl'
app.config['MAIL_DEFAULT_SENDER'] = ("UTE CHESS CLUB", "clbcospkt@gmail.com")
mail = Mail(app)

# Register authentication service
login_manager = LoginManager(app)
jwt = JWTManager(app)
@login_manager.user_loader
def load_user(user_id):
    return UserService().get_by_id(user_id)

# Register API service
app.register_blueprint(test_bp)
app.register_blueprint(index_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(game_bp)
app.register_blueprint(lobby_bp)
app.register_blueprint(authgg_bp)
app.register_blueprint(image_bp)
app.register_blueprint(blog_bp)
app.register_blueprint(puzzle_bp)
app.register_blueprint(lesson_bp)
app.register_blueprint(book_bp)
app.register_blueprint(tournament_bp)
app.register_blueprint(achievement_bp)
app.register_blueprint(video_bp)
app.register_blueprint(other_bp)
app.register_blueprint(notification_bp)
app.register_blueprint(blitztactic_bp)
app.register_blueprint(adminDashboard_bp)
app.register_blueprint(ai_game_bp)
app.register_blueprint(banner_bp)
app.register_blueprint(tournament_game_bp)


socketio = SocketIO(app, cors_allowed_origins="*", transports=['websocket', 'polling'])

from sockets.game import *
@socketio.on('request_game')
def request_game_socket(data):
    request_game(data['user_id'], data['lobby_id'])

@socketio.on('join_game')
def join_game_socket(data):
    join_game(data['game_id'])
    
@socketio.on('send_move')
def send_move_socket(data):
    send_move(data['game_id'], data['fen'], data['move'], data['whiteTime'], data['blackTime'])

from database.mongodb import get_mongo
@app.get('/api/')
def index():
    try :
        mongodb = get_mongo()
        if mongodb:
            return "Connected to MongoDB"
    except Exception as e:
        print(e)
        return "Error connecting to MongoDB"
    
@socketio.on('offer_draw')
def offer_draw_socket(data):
    offer_draw(data['game_id'], data['player_offer_id'])

@socketio.on('accept_draw')
def accept_draw_socket(data):
    accept_draw(data['game_id'], data['player_accept_id'])

@socketio.on('reject_draw')
def reject_draw_socket(data):
    reject_draw(data['game_id'], data['player_reject_id'])

@socketio.on('resign')
def resign_socket(data):
    resign(data['game_id'], data["player_resign_id"])

@socketio.on('timeout')
def timeout_socket(data):
    timeout(data['game_id'], data["player_timeout_id"])

@socketio.on('checkmate')
def timeout_socket(data):
    checkmate(data['game_id'], data['winner_id'])

from sockets.tournament import *
@socketio.on('join_tournament')
def handle_join_tournament(data):
    join_tournament(data["tournament_id"], data["user_id"])

@socketio.on('leave_tournament')
def handle_leave_tournament(data):
    leave_tournament(data["tournament_id"], data["user_id"])

from sockets import tournament_game
@socketio.on('tournament_game_offer_draw')
def tournament_game_offer_draw_socket(data):
    tournament_game.offer_draw(data['game_id'], data['player_offer_id'])

@socketio.on('tournament_game_accept_draw')
def tournament_game_accept_draw_socket(data):
    tournament_game.accept_draw(data['game_id'], data['player_accept_id'])

@socketio.on('tournament_game_reject_draw')
def tournament_game_reject_draw_socket(data):
    tournament_game.reject_draw(data['game_id'], data['player_reject_id'])

@socketio.on('tournament_game_resign')
def tournament_game_resign_socket(data):
    tournament_game.resign(data['game_id'], data["player_resign_id"])

@socketio.on('tournament_game_timeout')
def tournament_game_timeout_socket(data):
    tournament_game.timeout(data['game_id'], data["player_timeout_id"])

@socketio.on('tournament_game_checkmate')
def tournament_game_timeout_socket(data):
    tournament_game.checkmate(data['game_id'], data['winner_id'])

@socketio.on('tournament_game_join_game')
def tournament_game_join_game_socket(data):
    tournament_game.join_game(data['game_id'])

@socketio.on('tournament_game_send_move')
def tournament_game_send_move_socket(data):
    tournament_game.send_move(data['game_id'], data['fen'], data['move'], data['whiteTime'], data['blackTime'])

if __name__ == '__main__':
    socketio.run(app,host='0.0.0.0', port=5000, debug=True)
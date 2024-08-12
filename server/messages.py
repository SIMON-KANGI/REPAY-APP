from config import create_app, db
from flask_restful import Api, Resource
from flask import request, jsonify, Blueprint
from models import User, Message, Reply
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from flask_socketio import SocketIO, emit

app = create_app()
api = Api(app)
socketio = SocketIO(app, cors_allowed_origins="*")
chat_blueprint = Blueprint('chat', __name__, url_prefix='/chat')
api = Api(chat_blueprint)

class Messages(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        if not current_user:
            return jsonify({"error": "Unauthorized"}), 401
        messages = [message.to_dict() for message in Message.query.all()]
        return messages, 200

    @jwt_required()
    def post(self):
        current_user = get_jwt_identity()
        if not current_user:
            return jsonify({"error": "Unauthorized"}), 401

        data = request.get_json()
        body = data.get('message')
        senderId = data.get('user_id')
        phone = data.get('contact')

        contact = User.query.filter(User.phone == phone).first()
        if not contact:
            return jsonify({"error": "Contact not found"}), 404

        ownerId = contact.id

        # Check if a message already exists for this ownerId
        existing_message = Message.query.filter_by(ownerId=ownerId).first()

        if existing_message:
            # Create a new reply if a message already exists
            new_reply = Reply(
                body=body,
                ownerId=ownerId,
                senderId=senderId,
                status="reply",
                message_id=existing_message.id
            )
            db.session.add(new_reply)
            db.session.commit()

            # Emit reply event to the client
            socketio.emit('receive_reply', new_reply.to_dict())

            return new_reply.to_dict(), 201

        else:
            # Create a new message if no message exists for this ownerId
            new_message = Message(
                body=body,
                ownerId=ownerId,
                senderId=senderId,
                status="sent"
            )
            db.session.add(new_message)
            db.session.commit()

            # Emit message event to the client
            socketio.emit('receive_message', new_message.to_dict())

            return new_message.to_dict(), 201

api.add_resource(Messages, '/messages')


class MessageId(Resource):
    @jwt_required()
    def get(self, id):
        current_user = get_jwt_identity()
        if current_user:
            message = Message.query.get(id)
            if message:
                return message.to_dict(), 200
            else:
                return {"error": "Message not found"}, 404

api.add_resource(MessageId, '/messages/<int:id>')

class Replies(Resource):
    
    def get(self):
       
            replies = [reply.to_dict() for reply in Reply.query.all()]
            return replies, 200

    @jwt_required()
    def post(self):
        current_user = get_jwt_identity()
        if current_user:
            data = request.get_json()
            message_id=data['message_id']
            message= Message.query.filter(Message.id==message_id).first()
            reply = Reply(
                body=data['body'],
                ownerId=data['ownerId'],
                status="sent",
                senderId=data['senderId'],
                message_id=data['message_id']
            )
            db.session.add(reply)
            db.session.commit()
            socketio.emit('receive_reply', reply.to_dict())
            return reply.to_dict(), 201

api.add_resource(Replies, '/replies')

@socketio.on('send_message')
def handle_send_message(data):
    body = data['body']
    senderId = data['senderId']
    ownerId = data['ownerId']
    new_message = Message(
        body=body,
        ownerId=ownerId,
        senderId=senderId,
        status="sent"
    )
    db.session.add(new_message)
    db.session.commit()
    emit('receive_message', new_message.to_dict(), broadcast=True)

@socketio.on('send_reply')
def handle_send_reply(data):
    body = data['body']
    senderId = data['senderId']
    ownerId = data['ownerId']
    message_id = data['message_id']
    new_reply = Reply(
        body=body,
        ownerId=ownerId,
        senderId=senderId,
        status="sent",
        message_id=message_id
    )
    db.session.add(new_reply)
    db.session.commit()
    emit('receive_reply', new_reply.to_dict(), broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)

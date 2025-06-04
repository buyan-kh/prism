from flask import Flask, request, jsonify
import json
import sqlite3
from datetime import datetime
import os
import traceback
from typing import Dict, Any, List

app = Flask(__name__)

WEBHOOK_SECRET = "my_webhook_secret"
DATABASE_PATH = "prism_data.db"

def init_database():
    """Initialize SQLite database with required tables"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Memory table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS memories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            memory_type TEXT,
            content TEXT,
            timestamp DATETIME,
            emotion TEXT,
            topic TEXT,
            importance INTEGER DEFAULT 1
        )
    ''')
    
    # Identity table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS identity_traits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            trait_name TEXT UNIQUE,
            trait_value TEXT,
            confidence_level REAL,
            last_updated DATETIME
        )
    ''')
    
    # Emotional context table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS emotional_context (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            emotion TEXT,
            topic TEXT,
            response_strategy TEXT,
            timestamp DATETIME,
            effectiveness_score INTEGER
        )
    ''')
    
    # Goals table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS goals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            goal_type TEXT,
            title TEXT,
            description TEXT,
            target_date DATE,
            progress INTEGER DEFAULT 0,
            status TEXT DEFAULT 'active',
            created_at DATETIME,
            updated_at DATETIME
        )
    ''')
    
    # Thoughts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS thoughts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            thought_type TEXT,
            content TEXT,
            context TEXT,
            outcome TEXT,
            timestamp DATETIME
        )
    ''')
    
    conn.commit()
    conn.close()

def verify_webhook_secret(request_data):
    """Verify webhook secret from Vapi"""
    # In production, implement proper webhook verification
    return True

def get_user_id_from_call(request_data):
    """Extract user ID from Vapi call data"""
    # This would extract user ID from the call context
    # For now, using a default user
    return request_data.get('call', {}).get('customer', {}).get('phoneNumber', 'default_user')

@app.route('/api/memory_manager', methods=['POST'])
def memory_manager():
    """Handle memory management requests"""
    try:
        print("=== MEMORY MANAGER DEBUG ===")
        print(f"Request headers: {dict(request.headers)}")
        print(f"Request method: {request.method}")
        print(f"Request content type: {request.content_type}")
        
        data = request.json
        print(f"Request data: {json.dumps(data, indent=2)}")
        
        if not verify_webhook_secret(data):
            return jsonify({"error": "Unauthorized"}), 401
        
        user_id = get_user_id_from_call(data)
        print(f"User ID: {user_id}")
        
        function_call = data.get('message', {}).get('functionCall', {})
        print(f"Function call: {function_call}")
        
        parameters = function_call.get('parameters', {})
        print(f"Parameters: {parameters}")
        
        action = parameters.get('action')
        memory_type = parameters.get('memory_type')
        content = parameters.get('content', {})
        query = parameters.get('query', '')
        
        print(f"Action: {action}, Memory Type: {memory_type}")
        
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        if action == 'store':
            cursor.execute('''
                INSERT INTO memories (user_id, memory_type, content, timestamp, emotion, topic)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                user_id,
                memory_type,
                json.dumps(content),
                datetime.now(),
                content.get('emotion', ''),
                content.get('topic', '')
            ))
            conn.commit()
            result = {"status": "stored", "message": "Memory saved successfully"}
            
        elif action == 'retrieve':
            if query:
                cursor.execute('''
                    SELECT memory_type, content, timestamp, emotion, topic
                    FROM memories 
                    WHERE user_id = ? AND (content LIKE ? OR topic LIKE ?)
                    ORDER BY timestamp DESC LIMIT 10
                ''', (user_id, f'%{query}%', f'%{query}%'))
            else:
                cursor.execute('''
                    SELECT memory_type, content, timestamp, emotion, topic
                    FROM memories 
                    WHERE user_id = ? AND memory_type = ?
                    ORDER BY timestamp DESC LIMIT 5
                ''', (user_id, memory_type))
            
            memories = cursor.fetchall()
            result = {
                "memories": [
                    {
                        "type": mem[0],
                        "content": json.loads(mem[1]) if mem[1] else {},
                        "timestamp": mem[2],
                        "emotion": mem[3],
                        "topic": mem[4]
                    }
                    for mem in memories
                ]
            }
        else:
            result = {"error": f"Unknown action: {action}"}
            
        conn.close()
        
        print(f"Result: {result}")
        return jsonify({
            "result": result
        })
        
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"ERROR in memory_manager: {str(e)}")
        print(f"Full traceback: {error_trace}")
        return jsonify({"error": str(e), "trace": error_trace}), 500

@app.route('/api/identity_tracker', methods=['POST'])
def identity_tracker():
    """Handle identity evolution tracking"""
    try:
        data = request.json
        function_call = data.get('message', {}).get('functionCall', {})
        parameters = function_call.get('parameters', {})
        
        action = parameters.get('action')
        
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        if action == 'get_identity':
            cursor.execute('SELECT trait_name, trait_value, confidence_level FROM identity_traits')
            traits = cursor.fetchall()
            result = {
                "identity": {
                    trait[0]: {
                        "value": trait[1],
                        "confidence": trait[2]
                    }
                    for trait in traits
                }
            }
            
        elif action == 'update_trait':
            trait = parameters.get('trait')
            adjustment = parameters.get('adjustment', {})
            
            cursor.execute('''
                INSERT OR REPLACE INTO identity_traits (trait_name, trait_value, confidence_level, last_updated)
                VALUES (?, ?, ?, ?)
            ''', (
                trait,
                json.dumps(adjustment),
                adjustment.get('confidence', 0.5),
                datetime.now()
            ))
            conn.commit()
            result = {"status": "updated", "trait": trait}
            
        elif action == 'reflect':
            reflection = parameters.get('reflection')
            # Store reflection as a special memory
            cursor.execute('''
                INSERT INTO memories (user_id, memory_type, content, timestamp)
                VALUES (?, ?, ?, ?)
            ''', ('system', 'self_reflection', json.dumps({'reflection': reflection}), datetime.now()))
            conn.commit()
            result = {"status": "reflected", "message": "Self-reflection recorded"}
            
        conn.close()
        
        return jsonify({"result": result})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/emotion_analyzer', methods=['POST'])
def emotion_analyzer():
    """Handle emotional context analysis"""
    try:
        data = request.json
        user_id = get_user_id_from_call(data)
        function_call = data.get('message', {}).get('functionCall', {})
        parameters = function_call.get('parameters', {})
        
        action = parameters.get('action')
        
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        if action == 'store_emotional_memory':
            user_emotion = parameters.get('user_emotion')
            topic = parameters.get('topic')
            response_strategy = parameters.get('response_strategy')
            
            cursor.execute('''
                INSERT INTO emotional_context (user_id, emotion, topic, response_strategy, timestamp)
                VALUES (?, ?, ?, ?, ?)
            ''', (user_id, user_emotion, topic, response_strategy, datetime.now()))
            conn.commit()
            
            result = {"status": "stored", "message": "Emotional context saved"}
            
        elif action == 'get_emotional_history':
            cursor.execute('''
                SELECT emotion, topic, response_strategy, timestamp
                FROM emotional_context
                WHERE user_id = ?
                ORDER BY timestamp DESC LIMIT 10
            ''', (user_id,))
            
            history = cursor.fetchall()
            result = {
                "emotional_history": [
                    {
                        "emotion": row[0],
                        "topic": row[1],
                        "strategy": row[2],
                        "timestamp": row[3]
                    }
                    for row in history
                ]
            }
            
        conn.close()
        
        return jsonify({"result": result})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/goal_tracker', methods=['POST'])
def goal_tracker():
    """Handle goal tracking and progress"""
    try:
        data = request.json
        user_id = get_user_id_from_call(data)
        function_call = data.get('message', {}).get('functionCall', {})
        parameters = function_call.get('parameters', {})
        
        action = parameters.get('action')
        
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        if action == 'set_goal':
            goal_data = parameters.get('goal_data', {})
            goal_type = parameters.get('goal_type')
            
            cursor.execute('''
                INSERT INTO goals (user_id, goal_type, title, description, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                user_id,
                goal_type,
                goal_data.get('title', ''),
                goal_data.get('description', ''),
                datetime.now(),
                datetime.now()
            ))
            conn.commit()
            
            result = {"status": "created", "message": "Goal set successfully"}
            
        elif action == 'get_goals':
            cursor.execute('''
                SELECT title, description, goal_type, progress, status, created_at
                FROM goals
                WHERE user_id = ? AND status = 'active'
                ORDER BY created_at DESC
            ''', (user_id,))
            
            goals = cursor.fetchall()
            result = {
                "active_goals": [
                    {
                        "title": goal[0],
                        "description": goal[1],
                        "type": goal[2],
                        "progress": goal[3],
                        "created": goal[5]
                    }
                    for goal in goals
                ]
            }
            
        conn.close()
        
        return jsonify({"result": result})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/thought_logger', methods=['POST'])
def thought_logger():
    """Handle internal thought logging"""
    try:
        data = request.json
        function_call = data.get('message', {}).get('functionCall', {})
        parameters = function_call.get('parameters', {})
        
        thought_type = parameters.get('thought_type')
        thought_content = parameters.get('thought_content')
        context = parameters.get('context', {})
        outcome = parameters.get('outcome', '')
        
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO thoughts (thought_type, content, context, outcome, timestamp)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            thought_type,
            thought_content,
            json.dumps(context),
            outcome,
            datetime.now()
        ))
        conn.commit()
        conn.close()
        
        return jsonify({
            "result": {
                "status": "logged",
                "message": "Thought process recorded"
            }
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": datetime.now()})

if __name__ == '__main__':
    # Initialize database on startup
    init_database()
    
    # Run the server
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True)

import requests
import json
import sqlite3
import os
from dotenv import load_dotenv
load_dotenv()

VAPI_API_KEY = os.getenv("VAPI_API_KEY")
VAPI_BASE_URL = "https://api.vapi.ai"

headers = {
    "Authorization": f"Bearer {VAPI_API_KEY}",
    "Content-Type": "application/json"
}

# Tool 1: Memory Manager
memory_manager_tool = {
    "type": "function",
    "server": {
        "url": "https://a31d-2601-647-4d80-fc30-48ea-5d14-ce0c-f818.ngrok-free.app/api/memory_manager",
        "secret": "my_webhook_secret"
    },
    "function": {
        "name": "memory_manager",
        "description": "Store and retrieve memories about users, conversations, and learnings",
        "parameters": {
            "type": "object",
            "properties": {
                "action": {
                    "type": "string",
                    "enum": ["store", "retrieve", "update"],
                    "description": "Action to perform on memory"
                },
                "memory_type": {
                    "type": "string",
                    "enum": ["user_preference", "conversation_context", "emotional_state", "goal_tracking", "learning"],
                    "description": "Type of memory to manage"
                },
                "content": {
                    "type": "object",
                    "description": "Memory content with metadata"
                },
                "query": {
                    "type": "string",
                    "description": "Search query for retrieving memories"
                }
            },
            "required": ["action"]
        }
    }
}

# Tool 2: Identity Tracker
identity_tracker_tool = {
    "type": "function",
    "server": {
        "url": "https://a31d-2601-647-4d80-fc30-48ea-5d14-ce0c-f818.ngrok-free.app/api/identity_tracker",
        "secret": "my_webhook_secret"
    },
    "function": {
        "name": "identity_tracker",
        "description": "Track and evolve PRISM's personality traits",
        "parameters": {
            "type": "object",
            "properties": {
                "action": {
                    "type": "string",
                    "enum": ["get_identity", "update_trait", "reflect", "get_growth_insights"],
                    "description": "Identity management action"
                },
                "trait": {
                    "type": "string",
                    "description": "Personality trait to update"
                },
                "adjustment": {
                    "type": "object",
                    "description": "How to adjust the trait"
                },
                "reflection": {
                    "type": "string",
                    "description": "Self-reflection notes"
                }
            },
            "required": ["action"]
        }
    }
}

# Tool 3: Emotion Analyzer
emotion_analyzer_tool = {
    "type": "function",
    "server": {
        "url": "https://a31d-2601-647-4d80-fc30-48ea-5d14-ce0c-f818.ngrok-free.app/api/emotion_analyzer",
        "secret": "my_webhook_secret"
    },
    "function": {
        "name": "emotion_analyzer",
        "description": "Analyze emotional context and store emotional memories",
        "parameters": {
            "type": "object",
            "properties": {
                "action": {
                    "type": "string",
                    "enum": ["analyze_current", "store_emotional_memory", "get_emotional_history"],
                    "description": "Emotion analysis action"
                },
                "user_emotion": {
                    "type": "string",
                    "description": "Detected user emotion"
                },
                "topic": {
                    "type": "string",
                    "description": "Topic that triggered emotion"
                },
                "response_strategy": {
                    "type": "string",
                    "description": "Response strategy for this emotion"
                }
            },
            "required": ["action"]
        }
    }
}

# Tool 4: Goal Tracker
goal_tracker_tool = {
    "type": "function",
    "server": {
        "url": "https://a31d-2601-647-4d80-fc30-48ea-5d14-ce0c-f818.ngrok-free.app/api/goal_tracker",
        "secret": "my_webhook_secret"
    },
    "function": {
        "name": "goal_tracker",
        "description": "Track user goals and progress over time",
        "parameters": {
            "type": "object",
            "properties": {
                "action": {
                    "type": "string",
                    "enum": ["set_goal", "update_progress", "get_goals", "suggest_next_step"],
                    "description": "Goal management action"
                },
                "goal_type": {
                    "type": "string",
                    "enum": ["learning", "career", "personal_development", "project"],
                    "description": "Type of goal"
                },
                "goal_data": {
                    "type": "object",
                    "description": "Goal information"
                },
                "progress_update": {
                    "type": "object",
                    "description": "Progress update information"
                }
            },
            "required": ["action"]
        }
    }
}

# Tool 5: Thought Logger
thought_logger_tool = {
    "type": "function",
    "server": {
        "url": "https://a31d-2601-647-4d80-fc30-48ea-5d14-ce0c-f818.ngrok-free.app/api/thought_logger",
        "secret": "my_webhook_secret"
    },
    "function": {
        "name": "thought_logger",
        "description": "Log internal thought processes and decisions",
        "parameters": {
            "type": "object",
            "properties": {
                "thought_type": {
                    "type": "string",
                    "enum": ["reasoning", "memory_recall", "response_planning", "identity_check", "emotional_assessment"],
                    "description": "Type of thought process"
                },
                "thought_content": {
                    "type": "string",
                    "description": "The actual thought or reasoning"
                },
                "context": {
                    "type": "object",
                    "description": "Context that triggered this thought"
                },
                "outcome": {
                    "type": "string",
                    "description": "Result or decision made"
                }
            },
            "required": ["thought_type", "thought_content"]
        }
    }
}

def create_tool(tool_data):
    """Create a tool in Vapi"""
    response = requests.post(
        f"{VAPI_BASE_URL}/tool",
        headers=headers,
        json=tool_data
    )
    
    if response.status_code == 201:
        tool = response.json()
        tool_name = tool_data['function']['name']
        print(f"✅ Created tool: {tool_name} (ID: {tool['id']})")
        return tool['id']
    else:
        tool_name = tool_data['function']['name']
        print(f"❌ Failed to create tool: {tool_name}")
        print(f"Error: {response.text}")
        return None

# Create all tools
tools = [
    memory_manager_tool,
    identity_tracker_tool,
    emotion_analyzer_tool,
    goal_tracker_tool,
    thought_logger_tool
]

tool_ids = []
for tool in tools:
    tool_id = create_tool(tool)
    if tool_id:
        tool_ids.append(tool_id)

print(f"\n🎉 Created {len(tool_ids)} tools successfully!")
print(f"Tool IDs: {tool_ids}")

# Update PRISM assistant to use these tools
if tool_ids:
    assistant_update = {
        "toolIds": tool_ids
    }
    
    response = requests.patch(
        f"{VAPI_BASE_URL}/assistants/0b8f2c33-f659-4741-8574-50e2bd92a932",
        headers=headers,
        json=assistant_update
    )
    
    if response.status_code == 200:
        print("✅ Updated PRISM assistant with new tools!")
    else:
        print(f"❌ Failed to update assistant: {response.text}")

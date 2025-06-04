import requests
import json
from typing import Dict, List, Optional
import asyncio

class MCPClient:
    def __init__(self, server_url: str):
        self.server_url = server_url.rstrip('/')
        self.available_tools: Dict = {}

    async def connect(self) -> bool:
        try:
            response = requests.get(f"{self.server_url}/tools")
            if response.status_code == 200:
                self.available_tools = response.json()
                return True
            return False
        except Exception as e:
            print(f"Failed to connect to MCP server: {e}")
            return False

    async def execute_tool(self, tool_name: str, params: Dict) -> Dict:
        if tool_name not in self.available_tools:
            raise ValueError(f"Tool {tool_name} not available")

        try:
            response = requests.post(
                f"{self.server_url}/execute/{tool_name}",
                json=params,
                headers={"Content-Type": "application/json"}
            )
            return response.json()
        except Exception as e:
            raise Exception(f"Failed to execute tool {tool_name}: {e}")

    def get_available_tools(self) -> Dict:
        return self.available_tools

class VapiMCPIntegration:
    def __init__(self, mcp_config: Dict):
        """Initialize Vapi MCP integration with configuration."""
        self.server_url = mcp_config.get("server", {}).get("url")
        if not self.server_url:
            raise ValueError("mcp server url fail")
        self.client = MCPClient(self.server_url)
        self.tools_config: List[Dict] = []

    async def initialize(self):
        connected = await self.client.connect()
        if not connected:
            raise ConnectionError("mcp server fail")
        
        available_tools = self.client.get_available_tools()
        self.tools_config = self._transform_tools(available_tools)

    def _transform_tools(self, tools: Dict) -> List[Dict]:
        transformed = []
        for tool_name, tool_config in tools.items():
            transformed.append({
                "type": "function",
                "name": tool_name,
                "description": tool_config.get("description", ""),
                "parameters": tool_config.get("parameters", {}),
                "returns": tool_config.get("returns", {})
            })
        return transformed

    async def execute_tool(self, tool_name: str, params: Dict) -> Dict:
        return await self.client.execute_tool(tool_name, params)

    def get_tools_config(self) -> List[Dict]:
        return self.tools_config

# Example usage
async def main():
    # Initialize with config
    mcp_config = {
        "server": {
            "url": "http://localhost:8000"  # Replace with your MCP server URL
        }
    }
    
    # Create integration instance
    integration = VapiMCPIntegration(mcp_config)
    
    try:
        # Initialize connection and fetch tools
        await integration.initialize()
        
        # Get available tools
        tools = integration.get_tools_config()
        print("Available tools:", tools)
        
        # Example tool execution
        result = await integration.execute_tool(
            "example_tool",  # Replace with actual tool name
            {"param1": "value1"}  # Replace with actual parameters
        )
        print("Tool execution result:", result)
        
    except Exception as e:
        print(f"Error: {e}")

# Run the example
if __name__ == "__main__":
    asyncio.run(main())

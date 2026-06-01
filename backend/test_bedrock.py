from services.bedrock_service import (
    ask_claude
)

response = ask_claude(

    "Say hello and confirm you work."

)

print(response)
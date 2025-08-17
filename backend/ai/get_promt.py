import json
from routers.websocket_utils import Commands
from database.db_get_filters import get_themes_by_ai_generate, get_actions_by_ai_generate

with open("./ai/promts/step-initial.md", "r") as f:
    temp_initial = f.read()

with open("./ai/promts/step-motivation.md", "r") as f:
    temp_motivation = f.read()

with open("./ai/promts/step-subtasks.md", "r") as f:
    temp_subtasks = f.read()

with open("./ai/promts/step-risk.md", "r") as f:
    temp_risk = f.read()

with open("./ai/promts/step-theme.md", "r") as f:
    temp_theme = f.read()

with open("./ai/promts/step-actions.md", "r") as f:
    actions = get_actions_by_ai_generate()
    actions_json = json.dumps(actions, ensure_ascii=False)
    temp_actions = f.read().replace('%%%ACTION-TYPES%%%', actions_json)

def get_prompt(task, command, user_id):
    try:
        task_json = json.dumps(task, ensure_ascii=False)
        temp = temp_initial.replace('%%%DATA-INPUT%%%', task_json)

        match command:
            case Commands.GEN_MOTIVE:
                temp += temp_motivation.replace('%%%STEP%%%', str(2))
            case Commands.GEN_STEPS:
                temp += temp_subtasks.replace('%%%STEP%%%', str(2))
            case Commands.GEN_RISK:
                temp += temp_risk.replace('%%%STEP%%%', str(2))
            case Commands.GEN_THEME:
                themes = get_themes_by_ai_generate(user_id)
                themes_json = json.dumps(themes, ensure_ascii=False)
                temp += temp_theme.replace('%%%STEP%%%', str(2)).replace('%%%USER-THEMES%%%', themes_json)
            case Commands.GEN_ACTION:
                temp += temp_actions.replace('%%%STEP%%%', str(2))

        return temp
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Ошибка: {str(e)}")
        return None


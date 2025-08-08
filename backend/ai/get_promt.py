import json
from routers.ws_response_and_status import Commands

with open("./ai/promts/step-initial.md", "r") as f:
    temp_initial = f.read()

with open("./ai/promts/step-motivation.md", "r") as f:
    temp_motivation = f.read()

# with open("./ai/promts/step-data-output.md", "r") as f:
#     temp_output = f.read()

with open("./ai/promts/step-subtasks.md", "r") as f:
    temp_subtasks = f.read()

with open("./ai/promts/step-risk.md", "r") as f:
    temp_risk = f.read()


def get_prompt(task, command):
    try:
        string = json.dumps(task, ensure_ascii=False)
        temp = temp_initial.replace('%%%DATA-INPUT%%%', string)

        match command:
            case Commands.GEN_MOTIVE:
                temp += temp_motivation.replace('%%%STEP%%%', str(2))
            case Commands.GEN_STEPS:
                temp += temp_subtasks.replace('%%%STEP%%%', str(2))
            case Commands.GEN_RISK:
                temp += temp_risk.replace('%%%STEP%%%', str(2))

        # temp += temp_output.replace('%%%STEP%%%', str(3))
        return temp
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Ошибка: {str(e)}")
        return None


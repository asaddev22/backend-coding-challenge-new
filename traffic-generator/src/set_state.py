import os
import sys

STATE_MAP = {
    0: "NOISY",
    1: "REGULAR",
    2: "LOW",
    3: "FAULTY"
}

try:
    state_code = int(sys.argv[1])
    state = STATE_MAP[state_code]
except Exception as ex:
    state_code = 0
    state = STATE_MAP[state_code]
    print(f"Error selecting state {ex}, defaulting to [{state}]")


with open(os.environ.get("STATE_FILE_PATH"), "w") as state_file:
    state_file.write(f"{state_code},{state}")

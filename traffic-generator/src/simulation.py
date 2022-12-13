import paho.mqtt.client as mqtt
import random
import os
import time
import csv

mqttBroker = os.environ.get("BROKER_URL")

client = mqtt.Client(os.environ.get("DEVICE_NAME"))
client.connect(mqttBroker, int(os.environ.get("BROKER_PORT")))


def regular_simulation():
    return (50 - random.random()), "OK"


def low_frequency_simulation():
    return (40 - (2 * random.random()) + (2 * random.random())), "OK"


def faulty_simulation():
    return -1.0, "ERROR"


def noisy_simulation():
    random_state = random.random()
    if random_state < 0.1:
        return faulty_simulation()
    elif random_state < 0.3:
        return low_frequency_simulation()
    else:
        return regular_simulation()


generators = {
    "NOISY": noisy_simulation,
    "REGULAR": regular_simulation,
    "LOW": low_frequency_simulation,
    "FAULTY": faulty_simulation
}

if __name__ == "__main__":
    while True:
        random.seed(time.time())
        with open(os.environ.get("STATE_FILE_PATH"), "r") as state_file:
            state = next(csv.reader(state_file))[1]
        (reading, status) = generators[state]()
        client.publish(f"dummylink/{os.environ.get('DEVICE_NAME')}/data/status", status)
        client.publish(f"dummylink/{os.environ.get('DEVICE_NAME')}/data/frequency", reading)
        time.sleep(1)

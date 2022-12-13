import paho.mqtt.client as mqtt
import random
import os
import time

mqttBroker = os.environ.get("BROKER_URL")

client = mqtt.Client(os.environ.get("DEVICE_NAME"))
client.connect(mqttBroker, int(os.environ.get("BROKER_PORT")))


def regular_simulation():
    return (50 - random.random()), "OK"


def low_frequency_simulation():
    return (43 - (2 * random.random()) + (2 * random.random())), "OK"


def faulty_simulation():
    return -1.0, "ERROR"


generators = {
    "regular": regular_simulation,
    "low_frequency": low_frequency_simulation,
    "faulty": faulty_simulation
}

if __name__ == "__main__":
    while True:
        random.seed(time.time())
        (reading, status) = generators["regular"]()
        client.publish(f"dummylink/{os.environ.get('DEVICE_NAME')}/data/status", status)
        client.publish(f"dummylink/{os.environ.get('DEVICE_NAME')}/data/frequency", reading)
        time.sleep(1)

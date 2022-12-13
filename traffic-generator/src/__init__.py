import paho.mqtt.client as mqtt
from random import randrange, uniform
from datetime import datetime
from statistics import median
import time

mqttBroker ="0.0.0.0"

client = mqtt.Client("Dummylink")
client.connect(mqttBroker, 1883)

devices = ["DL-1", "DL-2", "DL-3", "DL-4"]

def read_watts():
    watts_p1 = uniform(800000.0, 1000000.0)
    watts_p2 = uniform(800000.0, 1000000.0)
    watts_p3 = uniform(800000.0, 1000000.0)
    return WattsMeasurement(
        payload=WattsMeasurement.WattsAvg(
            timesource="NTP",
            timestamp=int(datetime.now().timestamp()),
            wattsP1=watts_p1,
            wattsP2 =watts_p2,
            wattsP3=watts_p3,
            wattsTotal=watts_p1 + watts_p2 + watts_p3,
            eventOccurred=None
    ))

def read_frequency():
    freq_p1 = uniform(47.0, 53.0)
    freq_p2 = uniform(47.0, 53.0)
    freq_p3 = uniform(47.0, 53.0)
    return FrequencyMeasurement(
        payload=FrequencyMeasurement.FrequencyAvg(
            timesource="NTP",
            timestamp=int(datetime.now().timestamp()),
            freqP1=freq_p1,
            freqP2 =freq_p2,
            freqP3=freq_p3,
            freqMedian=median([freq_p1, freq_p2, freq_p3]),
            freqCombined=sum([freq_p1, freq_p2, freq_p3])/3,
            eventOccurred=None
    ))


while True:
    for dev in devices:
        watts_reading = read_watts()
        frequency_reading = read_frequency()
        print(watts_reading)
        print(frequency_reading)
        client.publish(f"dummylink/{dev}/data/4/22", watts_reading.SerializeToString())
        client.publish(f"dummylink/{dev}/data/4/19", frequency_reading.SerializeToString())
    time.sleep(1)

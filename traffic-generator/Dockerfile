FROM python:3.7-alpine

RUN mkdir -p /opt/device
WORKDIR /opt/device
RUN echo "/opt/device" > .venv
ENV PYTHONPATH "/opt/device/lib/python3.7/site-packages"
RUN pip install --no-cache-dir pipenv
COPY Pipfile ./Pipfile
RUN pipenv lock
RUN pipenv sync

COPY src ./src
COPY state ./state
CMD python /opt/device/src/simulation.py
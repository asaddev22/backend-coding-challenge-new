backend-up:
	@docker-compose up --remove-orphans -d mqtt mqtt-panel frequency-api

backend-down:
	@docker-compose stop mqtt mqtt-panel frequency-api

device-up:
	@if test -z "$(device)"; then docker-compose up -d device1 device2 device3 device4 device5; else docker-compose up -d "device$(device)"; fi

device-down:
	@if test -z "$(device)"; then docker-compose stop device1 device2 device3 device4 device5; else docker-compose stop "device$(device)"; fi

get-state:
	@if test -z "$(device)"; then echo "Please specify a device"; exit 1; fi
	@docker-compose exec "device$(device)" /bin/sh -c "cat /opt/device/state";

set-state:
	@if test -z "$(device)"; then echo "Please specify a device"; exit 1; fi
	@if test -z "$(state)"; then echo "Please specify a state"; exit 1; fi
	@docker-compose exec "device$(device)" /bin/sh -c "python /opt/device/src/set_state.py ${state}"

simulation-up: backend-up device-up

simulation-down: backend-down device-down

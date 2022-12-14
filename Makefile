backend-up:
	@docker-compose up --remove-orphans -d mqtt frequency-api

backend-down:
	@docker-compose stop mqtt frequency-api

device-up:
	@if test -z "$(d)"; then docker-compose up -d device1 device2 device3; else docker-compose up -d $(d); fi

device-down:
	@if test -z "$(d)"; then docker-compose stop device1 device2 device3; else docker-compose stop $(d); fi

device-get-status:
	@if test -z "$(d)"; then echo "Please specify a device"; exit 1; fi
	@docker-compose exec $(d) /bin/sh -c "cat /opt/device/state";

device-set-status:
	@if test -z "$(d)"; then echo "Please specify a device"; exit 1; fi
	@if test -z "$(s)"; then echo "Please specify a state"; exit 1; fi
	@docker-compose exec $(d) /bin/sh -c "python /opt/device/src/set_state.py ${s}"

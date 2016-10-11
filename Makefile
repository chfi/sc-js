SRC = $(wildcard src/*.js)
LIB = $(SRC:src/%.js=lib/%.es6)


# lint:
# 	node_modules/.bin/eslint --env es6 lib/

babel:
	node_modules/.bin/babel lib/ -d src/

# lib: $(LIB)
# lib/%.es6: src/%.js .babelrc
# 	mkdir -p $(@D)
# 	node_modules/.bin/babel $< -o $@


# all:
# 	node_modules/.bin/babel lib/ -d src/

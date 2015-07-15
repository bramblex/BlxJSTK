
source_file = $(shell ls src/)
objects = $(foreach o, $(source_file), $(subst .js, ,$(o)))
target_files = $(foreach o, $(objects), dist/$(o).js)
mini_target_files = $(foreach o, $(objects), dist/min/$(o).min.js)

.PHONY: all 
all: modules

dist:
	@mkdir -p dist

dist/min: dist
	@mkdir -p dist/min

.PHONY: modules
modules: dist $(target_files) 

.PHONY: minify
minify: dist/min $(mini_target_files) 

$(target_files):dist/%.js:src/%.js
	tools/UMDT/umdt $< $@

$(mini_target_files):dist/min/%.min.js:dist/%.js
	java -jar tools/compiler/compiler.jar $< --js_output_file=$@

.PHONY: clean
clean:
	rm -r dist

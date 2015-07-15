
source_file = $(shell ls src/)
objects = $(foreach o, $(source_file), $(subst .js, ,$(o)))
target_files = $(foreach o, $(objects), dist/$(o).js)
mini_target_files = $(foreach o, $(objects), dist/$(o).min.js)

.PHONY: all 
all: dist/min modules minify

dist/min:
	@mkdir -p dist/min

.PHONY: modules
modules: $(target_files) 

.PHONY: minify
minify: $(mini_target_files) 
	mv dist/*.min.js dist/min

$(target_files):dist/%.js:src/%.js
	tools/UMDT/umdt $< $@

$(mini_target_files):dist/%.min.js:dist/%.js
	java -jar tools/compiler/compiler.jar $< --js_output_file=$@

.PHONY: clean
clean:
	rm -r dist

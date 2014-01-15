#!/bin/sh
java -jar ../lib/compiler.jar --compilation_level=SIMPLE_OPTIMIZATIONS --js=../src/sm.core.js --js=../src/ontologies/sm.properties.js --js_output_file=../sm.library.min.js

java -jar ../lib/compiler.jar --compilation_level=WHITESPACE_ONLY --formatting=pretty_print --js=../src/sm.core.js --js=../src/ontologies/sm.properties.js --js_output_file=../sm.library.js

java -jar ../lib/compiler.jar --compilation_level=SIMPLE_OPTIMIZATIONS --js=../src/sm.core.js --js=../src/ontologies/sm.properties.js --js=../src/ontologies/sm.channels.js --js=../src/behaviors/sm.Channel.js --js=../src/behaviors/sm.Extension.js --js=../src/ontologies/sm.nodes.js --js=../src/ontologies/sm.flowchart.js --js=../src/ontologies/sm.raphaeljs.js --js=../src/ontologies/sm.sammyjs.js --js_output_file=../sm.library-all.min.js

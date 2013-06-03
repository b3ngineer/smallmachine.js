REM requires https://developers.google.com/closure/compiler/ 

java -jar lib/compiler.jar --compilation_level=SIMPLE_OPTIMIZATIONS --js=src/sm.core.js --js=src/sm.eventTree.js --js_output_file=sm.library.min.js

java -jar lib/compiler.jar --compilation_level=WHITESPACE_ONLY --formatting=pretty_print --js=src/sm.core.js --js=src/sm.eventTree.js --js_output_file=sm.library.js

pause

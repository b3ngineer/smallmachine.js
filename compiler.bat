REM requires https://developers.google.com/closure/compiler/ 
"C:\Program Files (x86)\Java\jre7\bin\java.exe" -jar lib/compiler.jar --compilation_level=SIMPLE_OPTIMIZATIONS --js=src/sm.core.js --js=src/ontologies/sm.properties.js --js_output_file=sm.library.min.js

"C:\Program Files (x86)\Java\jre7\bin\java.exe" -jar lib/compiler.jar --compilation_level=WHITESPACE_ONLY --formatting=pretty_print --js=src/sm.core.js --js=src/ontologies/sm.properties.js --js_output_file=sm.library.js

"C:\Program Files (x86)\Java\jre7\bin\java.exe" -jar lib/compiler.jar --compilation_level=SIMPLE_OPTIMIZATIONS --js=src/sm.core.js --js=src/ontologies/sm.properties.js --js=src/ontologies/sm.channels.js --js=src/behaviors/sm.Channel.js --js_output_file=packages/channels/sm.library.min.js

"C:\Program Files (x86)\Java\jre7\bin\java.exe" -jar lib/compiler.jar --compilation_level=SIMPLE_OPTIMIZATIONS --js=src/sm.core.js --js=src/ontologies/sm.properties.js --js=src/ontologies/sm.channels.js --js=src/behaviors/sm.Channel.js --js_output_file=packages/nodes/sm.library.min.js

"C:\Program Files (x86)\Java\jre7\bin\java.exe" -jar lib/compiler.jar --compilation_level=WHITESPACE_ONLY --js=src/sm.core.js --js=src/ontologies/sm.properties.js --js=src/ontologies/sm.channels.js --js=src/behaviors/sm.Channel.js --js=src/ontologies/sm.nodes.js --js=src/ontologies/sm.raphaeljs.js --js=src/ontologies/sm.sammyjs.js --js_output_file=packages/all/sm.library.min.js

xcopy /s "C:\Users\bharris\Documents\GitHub\smallmachine.js\packages\all\sm.library.min.js" "D:\TFS\Engineering\Trunk\Internal\Services\Dsi.Ict\src\dsi.ict.ual\inc\control\sm.library.min.js"
pause

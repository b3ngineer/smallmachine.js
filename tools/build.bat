REM requires https://developers.google.com/closure/compiler/ 
"C:\Program Files\Java\jre7\bin\java.exe" -jar ../lib/compiler.jar --compilation_level=SIMPLE_OPTIMIZATIONS --js=../src/sm.core.js --js=../src/ontologies/sm.properties.js --js_output_file=../sm.library.min.js

"C:\Program Files\Java\jre7\bin\java.exe" -jar ../lib/compiler.jar --compilation_level=WHITESPACE_ONLY --formatting=pretty_print --js=../src/sm.core.js --js=../src/ontologies/sm.properties.js --js_output_file=../sm.library.js

"C:\Program Files\Java\jre7\bin\java.exe" -jar ../lib/compiler.jar --compilation_level=SIMPLE_OPTIMIZATIONS --js=../src/sm.core.js --js=../src/ontologies/sm.properties.js --js=../src/ontologies/sm.channels.js --js=../src/behaviors/sm.Channel.js --js=../src/behaviors/sm.Extension.js --js=../src/behaviors/sm.ChannelExtension.js --js=../src/behaviors/sm.Restrictions.js --js=../src/ontologies/sm.nodes.js --js=../src/ontologies/sm.treelayout.js --js=../src/ontologies/sm.raphaeljs.js --js=../src/ontologies/sm.sammyjs.js --js=../src/plugins/sm.StateQueryModel.js --js_output_file=../sm.library-all.min.js

"C:\Program Files\Java\jre7\bin\java.exe" -jar ../lib/compiler.jar --compilation_level=SIMPLE_OPTIMIZATIONS --js=../src/sm.core.js --js=../src/ontologies/sm.properties.js --js=../src/ontologies/sm.channels.js --js=../src/behaviors/sm.Channel.js --js=../src/behaviors/sm.Extension.js --js=../src/behaviors/sm.ChannelExtension.js --js=../src/behaviors/sm.Restrictions.js --js_output_file=../sm.library-channels.min.js

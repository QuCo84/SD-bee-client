REM Build minimised version of editor
uglifyjs ../app/*.js ../app/helpers/*.js ../app/calculator/*.js ../app/modules-autoload/*.js ../app/$$$/*.js -o ../ude-min.js -c -m
REM debug/*.js browser/dom.js browser/domcursor.js browser/domvalue.js api/*.js ud-view-model/*.js ude-view/*.js ud-utilities/*.js modules/editors/udetext.js modules/tools/zone.js
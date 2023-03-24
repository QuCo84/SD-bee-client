REM "& ^" to continue after error "&& ^" to stop after error
REM Unit tests
call test ud-view-model ud.php
call test ud-view-model udelement.php
call test ud-view-model udcommands.php
call test ud-view-model udpager.php
call test modules/editors udtable.php
call test modules/editors udlist.php
call test modules/editors udtext.php
call test modules/editors udgraphic.php
call test modules/editors udhtml.php
call test modules/connectors udconnector.php
call test modules/connectors udcdropzone.php
call test modules/connectors udcdocument.php
call test modules/connectors udcservice.php
call test modules/players udvideo.php
call test modules/udchart udchart.php
call test ud-utilities udutilities.php
call test ud-utilities udutilityfunctions.php
call test ud-utilities udresources.php
call test services/email emailservice.php
call test services/email udsmailchimp.php
call test services/email udsmailjet.php
call testjs browser dom.js
call testjs browser domvalue.js
call testjs browser domcursor.js
call testjs browser udajax.js
call testjs ud-view-model udconstants.js
call testjs ud-view-model ud.js
REM call testjs ud-view-model udmodules.js
call testjs ude-view udeconstants.js
call testjs ude-view ude.js
call testjs ude-view udecalc.js
call testjs ude-view udecalc_css.js
call testjs ude-view udemenu.js
call testjs ude-view udeideas.js
call testjs ude-view udelayout.js
call testjs modules/editors udelist.js
call testjs modules/editors udetable.js
call testjs modules/editors udetext.js
call testjs modules/editors udedraw.js
call testjs modules/editors udehtml.js
call testjs modules/connectors udeconnector.js
call testjs modules/connectors udcsiteextract.js
call testjs modules/players udevideo.js
call testjs modules/tools clipboarder.js
call testjs modules/tools inserter.js
call testjs modules/tools rollbacker.js
call testjs modules/tools styler4editor.js
call testjs modules/udchart udechart.js
call testjs ud-utilities udjson.js
call testjs ud-utilities udutilities.js
call testjs api udapi.js
call testjs api apiset1.js
call testjs api udmodule.js buildpage.js
call testjs api udmodule.js taskman.js
call testpy services/NLP keywordsservice.py
REM call testpy services/search gsretrieve.py
REM Integrated tests
call test tests udviewmodeltest.php
call testjs tests udeviewtest.js
call testjs tests udviewmodeltest.js
call checktests
echo Test result %errorlevel%
timeout /t 60
if %errorlevel% GTR 1 exit /b %errorlevel%
call doc
REM 2DO MINIMISE JS
REM SASS 2 CSS
call dosass &
REM ES5 JS
call buildes5 &
call quality
echo Quality result %errorlevel%
REM if %errorlevel% GTR 1 exit /b %errorlevel%
call checktests

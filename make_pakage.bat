@echo off


SET   backupFrom="*"
SET   backupName=package

SET PATH=c:\Program Files\7-Zip;c:\Program Files (x86)\7-Zip;%PATH%
SET PATH=d:\Program Files\7-Zip;d:\Program Files (x86)\7-Zip;%PATH%
SET PATH=e:\Program Files\7-Zip;e:\Program Files (x86)\7-Zip;%PATH%
SET PATH=f:\Program Files\7-Zip;f:\Program Files (x86)\7-Zip;%PATH%
SET PATH=f:\port_programs\archiv\7-Zip;f:\pp\archiv\7-Zip;%PATH%     
SET PATH=e:\port_programs\archiv\7-Zip;e:\pp\archiv\7-Zip;%PATH%     
SET PATH=c:\port_programs\archiv\7-Zip;c:\pp\archiv\7-Zip;%PATH%     
SET PATH=d:\port_programs\archiv\7-Zip;d:\pp\archiv\7-Zip;%PATH%     

del "%backupName%.zip" /q
@echo ====================================================
@7z.exe a -tZip "%backupName%.zip" %backupFrom% -m"m=Deflate" -x!"_backup" -x!".git*" -x!"make_pakage.bat"
::-x@"%~dp0make_backup__exclude_files.txt" 
::-i@"%~dp0make_backup__include_files.txt"
@echo ====================================================
@echo end:
@echo %backupName%.zip


if "%1"=="no_pause" GOTO end

@pause

:end

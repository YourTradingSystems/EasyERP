@echo off
start "mongoServer" "c:\mongodb\bin\mongod.exe"
start "mongoShell" "c:\mongodb\bin\mongo.exe"
start "Hotnode Server" /d "D:\DOCUMENTS\Projects\EasyERP" hotnode server.js
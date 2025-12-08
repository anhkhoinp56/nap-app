@echo off
set /p version=<.nvmrc
nvm use %version%

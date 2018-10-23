@echo off

if not exist "dist" mkdir "dist"
bestzip dist/ksgmet-downloader.zip src/ index.js node_modules/ LICENSE package.json

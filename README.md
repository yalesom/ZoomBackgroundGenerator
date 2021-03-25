# ZoomBackgroundGenerator

Use this tool to generate a personalized virtual background for use in classroom Zoom sessions. The backgrounds are designed to make your name visible even in Zoom’s grid view.

This tool was developed by the University of Virginia Darden School of Business and is adapted by Yale School of Management with permission.

<b>Build Docker Image:</b><br>
<code>docker build -t zoombackgroundgenerator:latest .</code>
<br>
<br>
<b>Run Docker Container:</b><br>
<code>docker run -d -p 8080:80 --name zoombackgroundgenerator zoombackgroundgenerator:latest</code><br>
<br>App will run at http://localhost:8080<br><br>
<b>Stop Docker Container:</b><br>
<code>docker stop zoombackgroundgenerator</code>

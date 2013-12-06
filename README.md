p2p-app
=======

Our app is based on HTML 5 technologies. This allows to deploy the app
both as a mobile web app and as multi-platform smartphone application
, with the help of [Phonegap](http://phonegap.com/). Our app depends
on the [AngularJS](http://www.angularjs.org/) framework, which
provides a  powerful way of creating dynamic and responsive
web applications.

Deploying the application with Phonegap
------
To deploy the application with the Phonegap requires you to [install
and setup Phonegap](http://phonegap.com/install/), it also requires you to install the development
environment for the desired platform. For example if you want to
generate an Android application you must first install and setup an
Android development environment. In the
[Phonegap Platform Guides](http://docs.phonegap.com/en/edge/guide_platforms_index.md.html)
they explain how to setup the different supported development
environments e.g. Blackberry, Windows Phone and iOS.

In the next steps we will explain the basic commands to integrate our
p2p-app codebase into a Phonegap project and run and deploy the app to
an Android based device. The instructions are specific to *nix based
operating systems:

1. Create a Phonegap project with:
```bash
phonegap create p2p-app-runner org.p2pga.qanda 'P2P-QandA'
```

2. Move into the newly created directory:
```bash
cd p2p-app-runner
```

3. Install any necessary Phonegap modules, currently the only module
   necessary is the camera module.
```bash
phonegap local plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-camera.git
```

4. Rename the www folder to something else:
```bash
mv www www-old
```

5. Link the www to app directory within the p2p-app repository:
```bash
ln -s ../p2p-app/app/ www
```

6. Point the app to the necessary backend server. Modify the file
   `p2p-app/app/js/services.js` so that all URLs point the required
   backend server.

7. Attached the Android device to your computer. Make sure all
   necessary drivers have been installed and that you have properly
   configured the Android development environment.

8. Compile, deploy and run the App.
```bash
phonegap run andoid
```

Deploying the application as a mobile web app
------

By default the application is currently being served by the server as
a mobile web app. Although that doesn't inhibit the server from also
serving it's REST API so that it can also serve the Phonegap apps. The
AngularJS based mobile web app also utilizes the REST API for the
functionality. The main difference is that upon asking for the default
route on the server '/', it serves all of the resources associated
with the app.

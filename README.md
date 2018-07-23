# equirectangular-gallery-component
Display a diaporama of equirectangular photos as a configurable AFrame component

![screenshot](https://fabien.benetou.fr/pub/home/360s/screenshot.jpg)

Live examples :
* server side previews https://fabien.benetou.fr/pub/home/360s/gallery.html?json-file=Hornu_July2018/files.json
* client side previews (heavy!) https://fabien.benetou.fr/pub/home/360s/client-side-preview.html?json-file=Hornu_July2018%2Ffiles.json

Note the bash script for batch 360 conversion and preview.

URL parameters :
* `json-file` to point the the JSON file with the different images (array with relative path)
* `disable-timer` to disable the diaporama
* `interval` to add in seconds until the next image
* `enable-preview` to enable in VR preview of the next image

Thanks to :
* Yann Ael for the feedback
* Roland Dubois for the quality CSS

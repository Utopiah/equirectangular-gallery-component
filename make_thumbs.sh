mkdir thumb
cp *JPG thumb/
cd thumb/
mogrify -resize 30% *.JPG 
mogrify -crop 560x450+1000+200 *.JPG

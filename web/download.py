import urllib.request
import os

base_url = "https://casa-paradiso.hotelsgoaonline.com"
images = [
    ("/data/Pics/OriginalPhoto/10839/1083958/1083958486/casa-paradiso-panaji-pic-1.JPEG", "property-1.jpg"),
    ("/data/Pics/OriginalPhoto/10839/1083958/1083958885/casa-paradiso-panaji-pic-2.JPEG", "property-2.jpg"),
    ("/data/Pics/OriginalPhoto/10839/1083959/1083959005/casa-paradiso-panaji-pic-3.JPEG", "property-3.jpg"),
    ("/data/Pics/OriginalPhoto/10839/1083958/1083958696/casa-paradiso-panaji-pic-4.JPEG", "property-4.jpg"),
    ("/data/Pics/OriginalPhoto/2526/252689/252689761/casa-paradiso-panaji-pic-5.JPEG", "property-5.jpg"),
    ("/data/Pics/OriginalPhoto/2526/252689/252689813/casa-paradiso-panaji-pic-18.JPEG", "property-6.jpg")
]

os.makedirs('assets', exist_ok=True)

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}

for path, name in images:
    try:
        url = base_url + path
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response:
            with open(f"assets/{name}", 'wb') as f:
                f.write(response.read())
        print(f"Successfully downloaded {name}")
    except Exception as e:
        print(f"Failed to download {name}: {e}")

from PIL import Image

img = Image.open("SITO/pwa/icon/2.png").convert("RGBA")

datas = img.getdata()
new_data = []
for r, g, b, a in datas:
    if r > 250 and g > 250 and b > 250:
        new_data.append((255, 255, 255, 0))
    else:
        new_data.append((r, g, b, a))
img.putdata(new_data)

img.save("SITO/pwa/icon/LOGO_LERRI.png")

icon_sizes = [(16,16),(32,32),(48,48),(64,64),(128,128),(256,256)]
img.save("SITO/pwa/icon/favicon.ico", format="ICO", sizes=icon_sizes)
img.resize((512,512), Image.Resampling.LANCZOS).save("SITO/pwa/icon/icon-512.png")
img.resize((192,192), Image.Resampling.LANCZOS).save("SITO/pwa/icon/icon-192.png")

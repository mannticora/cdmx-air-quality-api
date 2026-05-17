from PIL import Image

images = [
    '/mnt/e/cdmx air/get.png',
    '/mnt/e/cdmx air/post.png',
    '/mnt/e/cdmx air/Screenshot 2026-05-16 005533.png',
]

for path in images:
    img = Image.open(path)
    img_resized = img.resize((1280, 800))
    img_resized.save(path.replace('.png', '_upwork.png'))
    print(f'Listo: {path}')

#!/usr/bin/env python3
"""
生成像素英语世界的PWA应用图标
Minecraft风格图标
"""

from PIL import Image, ImageDraw
import os

def generate_icon(size, output_path):
    """生成指定尺寸的像素风格图标"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    border = size // 8  # 内边距
    content_size = size - 2 * border
    
    # 背景：草方块风格
    # 上半部分：草地绿
    grass_height = content_size * 3 // 5
    for y in range(grass_height):
        t = y / grass_height
        r = int(100 + t * 20)
        g = int(180 - t * 30)
        b = int(70 - t * 10)
        draw.line([(border, border + y), (size - border - 1, border + y)], fill=(r, g, b, 255))
    
    # 下半部分：泥土棕
    for y in range(grass_height, content_size):
        t = (y - grass_height) / (content_size - grass_height)
        r = int(139 - t * 30)
        g = int(90 - t * 20)
        b = int(43 - t * 10)
        draw.line([(border, border + y), (size - border - 1, border + y)], fill=(r, g, b, 255))
    
    # 像素化草边
    grass_detail = content_size // 10
    for i in range(0, content_size, grass_detail):
        if (i // grass_detail) % 2 == 0:
            draw.rectangle(
                [border + i, border + grass_height - grass_detail//2,
                 border + i + grass_detail - 1, border + grass_height + grass_detail//2],
                fill=(93, 158, 58, 255)
            )
    
    # 边框：深色像素边框
    # 顶部亮边
    draw.rectangle([border, border, size - border - 1, border + size//32], fill=(120, 200, 80, 255))
    # 左侧亮边
    draw.rectangle([border, border, border + size//32, size - border - 1], fill=(80, 140, 50, 255))
    # 右侧暗边
    draw.rectangle([size - border - size//32, border, size - border - 1, size - border - 1], fill=(50, 90, 30, 255))
    # 底部暗边
    draw.rectangle([border, size - border - size//32, size - border - 1, size - border - 1], fill=(40, 70, 25, 255))
    
    # 中央金色像素字母 E
    letter_size = content_size // 2
    letter_x = border + (content_size - letter_size) // 2
    letter_y = border + (content_size - letter_size) // 3
    
    pixel = letter_size // 8  # 像素大小
    
    # E字母像素图案 (8x8)
    e_pattern = [
        "########",
        "########",
        "##....##",
        "##......",
        "####....",
        "##......",
        "##....##",
        "########",
    ]
    
    # 阴影
    for row_idx, row in enumerate(e_pattern):
        for col_idx, char in enumerate(row):
            if char == '#':
                x = letter_x + col_idx * pixel + pixel // 2
                y = letter_y + row_idx * pixel + pixel // 2
                draw.rectangle(
                    [x, y, x + pixel - 1, y + pixel - 1],
                    fill=(139, 105, 20, 255)
                )
    
    # 主字母
    for row_idx, row in enumerate(e_pattern):
        for col_idx, char in enumerate(row):
            if char == '#':
                x = letter_x + col_idx * pixel
                y = letter_y + row_idx * pixel
                draw.rectangle(
                    [x, y, x + pixel - 1, y + pixel - 1],
                    fill=(255, 215, 0, 255)
                )
    
    # 高光
    for row_idx in range(2):
        for col_idx in range(2):
            if row_idx < len(e_pattern) and col_idx < len(e_pattern[row_idx]):
                if e_pattern[row_idx][col_idx] == '#':
                    x = letter_x + col_idx * pixel
                    y = letter_y + row_idx * pixel
                    draw.rectangle(
                        [x, y, x + pixel//2 - 1, y + pixel//2 - 1],
                        fill=(255, 255, 200, 200)
                    )
    
    # 保存
    img.save(output_path, 'PNG')
    print(f"生成图标: {output_path} ({size}x{size})")

def main():
    icon_sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    output_dir = '/app/data/所有对话/主对话/像素英语世界_APP/icons'
    
    os.makedirs(output_dir, exist_ok=True)
    
    for size in icon_sizes:
        output_path = os.path.join(output_dir, f'icon-{size}x{size}.png')
        generate_icon(size, output_path)
    
    # 同时生成一个大尺寸的screenshot
    screenshot_path = os.path.join(output_dir, 'screenshot1.png')
    img = Image.new('RGB', (1024, 768), (135, 206, 235))
    img.save(screenshot_path, 'PNG')
    print(f"生成截图: {screenshot_path}")
    
    print("\n✅ 所有图标生成完成！")

if __name__ == '__main__':
    main()
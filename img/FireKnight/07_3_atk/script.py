import os
import re

def try_int(s):
    try:
        return int(s)
    except ValueError:
        return s

def alphanum_key(s):
    return [try_int(c) for c in re.split('([0-9]+)', s)]

def rename_png_files():
    folder_path = os.path.dirname(os.path.abspath(__file__))
    png_files = [file for file in os.listdir(folder_path) if file.endswith('.png')]
    png_files.sort(key=alphanum_key)

    for index, file_name in enumerate(png_files):
        new_name = '9' * (index + 1) + '.png'  # Use a sequence of '9' based on the index
        old_path = os.path.join(folder_path, file_name)
        new_path = os.path.join(folder_path, new_name)

        os.rename(old_path, new_path)
        print(f'Renamed: {file_name} -> {new_name}')

if __name__ == "__main__":
    rename_png_files()

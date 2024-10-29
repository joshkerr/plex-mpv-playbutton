# Plex MPV Button

A browser extension that adds a native-looking MPV playback button to the Plex web interface. This button does not launch the selected movie or TV show in MPV, it simply formats a command and copies it to your clipboard. You will still need to paste it into your terminal to launch MPV. I prefer MPV to the built in Plex video player, but the link I need is buried in a submenu and I find tracking it down more difficult than just clicking a button. I also want the item to appear as "Watched" on plex after playing it in MPV. So I created this Chrome plugin to solve my problem. 

## Features

- Adds an MPV button next to Plex's native play button
- Seamlessly matches Plex's UI design
- Automatically copies MPV playback command to clipboard
- Marks media as watched after launching
- Works with movies and TV shows

## Installation

1. Clone this repository
2. Open Chrome/Firefox and navigate to extensions
3. Enable Developer Mode
4. Load unpacked extension and select the cloned directory

## Usage

1. Navigate to any movie or TV show in Plex Web
2. Click the "MPV" button next to the play button
3. The MPV command will be copied to your clipboard
4. Paste the command in your terminal to start playback
5. The item will be automatically marked as watched in Plex

## Requirements

- A working Plex server
- MPV media player installed on your system
- Chrome or Firefox browser

## How It Works

The extension injects a button into the Plex web interface that:
1. Retrieves the direct stream URL from Plex
2. Formats it into an MPV command
3. Copies the command to your clipboard
4. Marks the media as watched in Plex

## Screenshots

![screenshot](https://github.com/joshkerr/plex-mpv-playbutton/blob/main/screenshot.png)

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)

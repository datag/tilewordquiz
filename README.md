# TileWordQuiz

TileWordQuiz is a simple kids quiz for finding the matching tile for a (German) word.

## Building

* https://v2.tauri.app/start/prerequisites/#rust
* https://v2.tauri.app/start/prerequisites/#android

```shell
cargo tauri android init
cargo tauri icon src/assets/logo.svg
cargo tauri dev
cargo tauri android dev
cargo tauri android build --target=aarch64
apksigner sign --min-sdk-version 33 --ks /path/to/store.keystore --ks-key-alias alias --in "/path/to/release.aab" --out "/path/to/release-signed.aab"
```


## Credits

### Used font "Grundschrift"

> Copyright 2011 Grundschulverband e.V. und Wissenschaftliche Einrichtung der Laborschule Bielefeld

See https://grundschulverband.de/die-grundschrift-fuer-den-computer/

### Used sounds

* https://freesound.org/people/NenadSimic/sounds/171697/
* https://freesound.org/people/BMacZero/sounds/96124/


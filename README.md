# TileWordQuiz

TileWordQuiz is a simple kids quiz for finding the matching tile for a (German) word.

## Bulding

```shell
cargo tauri android init
cargo tauri dev
cargo tauri android dev
cargo tauri android build --target=aarch64
apksigner sign --min-sdk-version 33 --ks /path/to/store.keystore --ks-key-alias alias --in "/path/to/release.aab" --out "/path/to/release-signed.aab"
```

## Used font "Grundschrift"

https://grundschulverband.de/die-grundschrift-fuer-den-computer/

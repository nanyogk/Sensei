# Bazel/Blaze build rules for the sidesensei Chrome extension.
#
# Build targets:
# blaze build //experimental/users/hyanagida/misc/sidesensei:sidesensei

load("//javascript/chrome/builddefs:build_defs.bzl", "chrome_extension", "chrome_extension_manifest")

FILESETENTRY = FilesetEntry(
    files = [
        "README.md",
        "_locales/de/messages.json",
        "_locales/en/messages.json",
        "_locales/es/messages.json",
        "_locales/fr/messages.json",
        "_locales/ja/messages.json",
        "_locales/pt/messages.json",
        "ai_client.js",
        "background.js",
        "chat_handler.js",
        "idiom_manager.js",
        "img/icon128.png",
        "img/icon16.png",
        "img/icon32.png",
        "img/icon48.png",
        "installer_sensei.html",
        "scraper.js",
        "sensei128.png",
        "settings_manager.js",
        "side_panel.css",
        "side_panel.html",
        "side_panel.js",
        "state_manager.js",
        "ui_renderer.js",
        "vocab_manager.js",
    ],
)

chrome_extension_manifest(
    name = "manifest_sidesensei",
    src = "manifest.json",
)

chrome_extension(
    name = "sidesensei",
    entries = [
        FILESETENTRY,
    ],
    manifest = ":manifest_sidesensei",
)

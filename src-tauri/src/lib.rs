mod ollama;
mod rss;

use ollama::call_ollama;
use rss::{fetch_rss_feed, guess_location_from_text};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            call_ollama,
            fetch_rss_feed,
            guess_location_from_text
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

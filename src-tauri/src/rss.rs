use serde::{Deserialize, Serialize};
use feed_rs::parser;
use reqwest;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct RSSItem {
    pub title: String,
    pub description: String,
    pub link: String,
    pub published: String,
    pub lat: Option<f64>,
    pub lng: Option<f64>,
}

#[tauri::command]
pub async fn fetch_rss_feed(url: String) -> Result<Vec<RSSItem>, String> {
    let client = reqwest::Client::new();
    
    let response = client
        .get(&url)
        .send()
        .await
        .map_err(|e| format!("Failed to fetch RSS feed: {}", e))?;
    
    let content = response
        .text()
        .await
        .map_err(|e| format!("Failed to read RSS feed content: {}", e))?;
    
    let feed = parser::parse(content.as_bytes())
        .map_err(|e| format!("Failed to parse RSS feed: {}", e))?;
    
    let items: Vec<RSSItem> = feed
        .entries
        .iter()
        .take(10) // Get the newest 10 items
        .map(|entry| {
            let title = entry.title.as_ref()
                .map(|t| t.content.clone())
                .unwrap_or_else(|| "Untitled".to_string());
            
            let description = entry.summary.as_ref()
                .map(|s| s.content.clone())
                .unwrap_or_else(|| "No description".to_string());
            
            let link = entry.links.first()
                .map(|l| l.href.clone())
                .unwrap_or_else(|| "".to_string());
            
            let published = entry.published.as_ref()
                .map(|p| p.to_rfc3339())
                .unwrap_or_else(|| chrono::Utc::now().to_rfc3339());
            
            // Try to extract geolocation from entry
            let (lat, lng) = extract_geolocation(&entry);
            
            RSSItem {
                title,
                description,
                link,
                published,
                lat,
                lng,
            }
        })
        .collect();
    
    Ok(items)
}

fn extract_geolocation(entry: &feed_rs::model::Entry) -> (Option<f64>, Option<f64>) {
    // Try to extract geo coordinates from entry metadata
    // This is a simplified version - real implementation would check various geo formats
    
    // Check for geo:lat and geo:long in extensions
    // For now, return None - geolocation will be guessed from title/content
    (None, None)
}

#[tauri::command]
pub async fn guess_location_from_text(text: String) -> Result<(f64, f64), String> {
    // This is a simplified location guesser
    // In a real implementation, you would use a geocoding API or local database
    
    let text_lower = text.to_lowercase();
    
    // Simple keyword matching for major locations
    if text_lower.contains("washington") || text_lower.contains("dc") || text_lower.contains("white house") {
        return Ok((38.8951, -77.0364)); // Washington DC
    } else if text_lower.contains("new york") || text_lower.contains("nyc") {
        return Ok((40.7128, -74.0060)); // New York
    } else if text_lower.contains("london") {
        return Ok((51.5074, -0.1278)); // London
    } else if text_lower.contains("paris") {
        return Ok((48.8566, 2.3522)); // Paris
    } else if text_lower.contains("moscow") {
        return Ok((55.7558, 37.6173)); // Moscow
    } else if text_lower.contains("beijing") || text_lower.contains("china") {
        return Ok((39.9042, 116.4074)); // Beijing
    } else if text_lower.contains("ukraine") || text_lower.contains("kyiv") || text_lower.contains("kiev") {
        return Ok((50.4501, 30.5234)); // Kyiv
    } else if text_lower.contains("israel") || text_lower.contains("jerusalem") {
        return Ok((31.7683, 35.2137)); // Jerusalem
    } else if text_lower.contains("gaza") {
        return Ok((31.5, 34.4667)); // Gaza
    } else if text_lower.contains("iran") || text_lower.contains("tehran") {
        return Ok((35.6892, 51.3890)); // Tehran
    }
    
    // Default to Atlantic Ocean if no location found
    Ok((30.0, -30.0))
}

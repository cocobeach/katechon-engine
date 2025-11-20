use serde::{Deserialize, Serialize};
use reqwest;

#[derive(Debug, Serialize, Deserialize)]
struct OllamaRequest {
    model: String,
    prompt: String,
    stream: bool,
}

#[derive(Debug, Serialize, Deserialize)]
struct OllamaResponse {
    response: String,
}

#[tauri::command]
pub async fn call_ollama(
    url: String,
    model: String,
    system_prompt: String,
    user_message: String,
) -> Result<String, String> {
    let client = reqwest::Client::new();
    
    // Combine system prompt and user message
    let full_prompt = format!("{}\n\nUser: {}\n\nAssistant:", system_prompt, user_message);
    
    let request_body = OllamaRequest {
        model,
        prompt: full_prompt,
        stream: false,
    };
    
    let api_url = format!("{}/api/generate", url);
    
    let response = client
        .post(&api_url)
        .json(&request_body)
        .send()
        .await
        .map_err(|e| format!("Failed to connect to Ollama: {}", e))?;
    
    if !response.status().is_success() {
        return Err(format!("Ollama API returned error: {}", response.status()));
    }
    
    let ollama_response: OllamaResponse = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse Ollama response: {}", e))?;
    
    Ok(ollama_response.response)
}

use reqwest::{
    header::{HeaderMap, HeaderValue},
    Method,
};
use rocket::serde::json::Value;

pub async fn get(
    url: &str,
    headers: Option<HeaderMap<HeaderValue>>,
    cookies: Option<&str>,
) -> Result<Value, Box<dyn std::error::Error>> {
    let res = request(Method::GET, url, headers, cookies).await?;
    Ok(res)
}

async fn request(
    method: Method,
    url: &str,
    headers: Option<HeaderMap<HeaderValue>>,
    cookies: Option<&str>,
) -> Result<Value, Box<dyn std::error::Error>> {
    let client = reqwest::Client::builder()
        .cookie_store(true)
        .build()
        .unwrap();

    let req = client.request(method, url);
    let req = match cookies {
        Some(v) => req.header("cookie", v),
        None => req,
    };

    let req = match headers {
        Some(data) => req.headers(data),
        None => req,
    };
    let res = req.send().await?.json().await?;
    Ok(res)
}

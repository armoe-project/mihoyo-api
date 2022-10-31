use std::error::Error;

use rocket::http::CookieJar;
use ureq::{json, serde_json::Value};

use super::common;
use crate::utils::request;

pub fn index(uid: &str, server: &str, cookies: &CookieJar<'_>) -> Result<Value, Box<dyn Error>> {
    let host = common::get_host(server, true);
    let parms = format!("role_id={}&server={}", uid, server);
    let url = format!("{}/game_record/app/genshin/api/index?{}", host, parms);
    let headers = common::get_headers(Some(&parms), None, server);
    let cookies = common::cookies_to_string(cookies);
    let result = request::get(&url, Some(headers), Some(&cookies))?;
    Ok(result)
}

pub fn spiral_abyss(
    uid: &str,
    schedule_type: u8,
    server: &str,
    cookies: &CookieJar<'_>,
) -> Result<Value, Box<dyn Error>> {
    let host = common::get_host(server, true);
    let parms = format!(
        "role_id={}&schedule_type={}&server={}",
        uid, schedule_type, server
    );
    let url = format!("{}/game_record/app/genshin/api/spiralAbyss?{}", host, parms);
    let headers = common::get_headers(Some(&parms), None, server);
    let cookies = common::cookies_to_string(cookies);
    let result = request::get(&url, Some(headers), Some(&cookies))?;
    Ok(result)
}

pub fn character(
    uid: &str,
    server: &str,
    cookies: &CookieJar<'_>,
) -> Result<Value, Box<dyn Error>> {
    let host = common::get_host(server, true);
    let body = json!({
        "role_id": uid,
        "server": server
    });
    let url = format!("{}/game_record/app/genshin/api/character", host);
    let headers = common::get_headers(None, Some(body.clone()), server);
    let cookies = common::cookies_to_string(cookies);
    let result = request::post(&url, Some(headers), body, Some(&cookies))?;
    Ok(result)
}

pub fn daily_note(
    uid: &str,
    server: &str,
    cookies: &CookieJar<'_>,
) -> Result<Value, Box<dyn Error>> {
    let host = common::get_host(server, true);
    let parms = format!("role_id={}&server={}", uid, server);
    let url = format!("{}/game_record/app/genshin/api/dailyNote?{}", host, parms);
    let headers = common::get_headers(Some(&parms), None, server);
    let cookies = common::cookies_to_string(cookies);
    let result = request::get(&url, Some(headers), Some(&cookies))?;
    Ok(result)
}

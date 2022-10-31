use std::error::Error;

use super::common;
use crate::utils::request;
use rocket::{http::CookieJar, serde::json::Value};

pub fn index(uid: &str, server: &str, cookies: &CookieJar<'_>) -> Result<Value, Box<dyn Error>> {
    println!("{uid} {server}");
    let host = common::get_host(server, true);
    let parms = format!("role_id={}&server={}", uid, server);
    let url = format!("{}/game_record/app/genshin/api/index?{}", host, parms);
    let headers = common::get_headers(Some(&parms), None, server);
    let cookies = common::cookies_to_string(cookies);
    let result = request::get(&url, Some(headers), Some(&cookies))?;
    Ok(result)
}

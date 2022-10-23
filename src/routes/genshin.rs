use rocket::{http::CookieJar, serde::json::Value};

use crate::{
    api::genshin,
    utils::{common, request, result},
};

#[get("/index/<uid>?<server>")]
pub async fn index(cookies: &CookieJar<'_>, uid: &str, server: Option<&str>) -> Value {
    let server = match server {
        Some(v) => {
            if v.is_empty() {
                "cn_gf01"
            } else {
                v
            }
        }
        None => "cn_gf01",
    };
    let result = genshin::index(uid, server, cookies).await;
    match result {
        Ok(data) => result::success(Some(data)),
        Err(_) => result::error("Failed to get character information!"),
    }
}

#[get("/enka/<uid>")]
pub async fn enka(uid: &str) -> Value {
    if !common::check_uid(uid) {
        return result::error("UID format error!");
    }
    let url = format!("https://enka.network/u/{}/__data.json", uid);
    let result = request::get(&url, None, None).await;
    match result {
        Ok(data) => {
            if data.get("uid").is_none() {
                return result::error(format!("No data found for UID: {}!", uid).as_str());
            }
            return result::success(Some(data));
        }
        Err(err) => result::error(err.to_string().as_str()),
    }
}

use rocket::{http::CookieJar, serde::json::Value};

use crate::{
    api::genshin,
    utils::{common, request, result},
};

#[get("/index/<uid>?<server>")]
pub fn index(cookies: &CookieJar<'_>, uid: &str, server: Option<&str>) -> Value {
    if !common::check_uid(uid) {
        return result::error("UID格式错误, 应为9位整数!");
    }

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

    let result = genshin::index(uid, server, cookies);
    match result {
        Ok(data) => {
            let code = data.get("retcode").unwrap().as_i64().unwrap();
            println!("{}", code);
            if code != 0 {
                return result::error(data.get("message").unwrap().as_str().unwrap());
            }
            result::success(Some(data.get("data")))
        }
        Err(_) => result::error("无法获取角色信息!"),
    }
}

#[get("/enka/<uid>")]
pub async fn enka(uid: &str) -> Value {
    if !common::check_uid(uid) {
        return result::error("UID格式错误, 应为9位整数!");
    }
    let url = format!("https://enka.network/u/{}/__data.json", uid);
    let result = request::get(&url, None, None);
    match result {
        Ok(data) => {
            if data.get("uid").is_none() {
                return result::error(format!("未查询到UID为 {} 的数据!", uid).as_str());
            }
            return result::success(Some(data));
        }
        Err(err) => result::error(err.to_string().as_str()),
    }
}

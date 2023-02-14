use rocket::{http::CookieJar, serde::json::Value};

use crate::{
    api::{common::get_server, genshin},
    utils::{common, request, result},
};

#[get("/index/<uid>")]
pub fn index(cookies: &CookieJar<'_>, uid: &str) -> Value {
    if !common::check_uid(uid) {
        return result::error("UID格式错误, 应为9位整数!");
    }

    let server = get_server(uid);

    let result = genshin::index(uid, server, cookies);
    match result {
        Ok(data) => {
            let code = data.get("retcode").unwrap().as_i64().unwrap();
            if code != 0 {
                return result::error(data.get("message").unwrap().as_str().unwrap());
            }
            result::success(Some(data.get("data")))
        }
        Err(_) => result::error("无法获取首页数据!"),
    }
}

#[get("/spiral_abyss/<uid>?<schedule_type>")]
pub fn spiral_abyss(cookies: &CookieJar<'_>, uid: &str, schedule_type: Option<u8>) -> Value {
    if !common::check_uid(uid) {
        return result::error("UID格式错误, 应为9位整数!");
    }

    let schedule_type = schedule_type.unwrap_or_else(|| 1);

    let server = get_server(uid);

    let result = genshin::spiral_abyss(uid, schedule_type, server, cookies);
    match result {
        Ok(data) => {
            let code = data.get("retcode").unwrap().as_i64().unwrap();
            if code != 0 {
                return result::error(data.get("message").unwrap().as_str().unwrap());
            }
            result::success(Some(data.get("data")))
        }
        Err(_) => result::error("无法获取深渊数据!"),
    }
}

#[get("/character/<uid>")]
pub fn character(cookies: &CookieJar<'_>, uid: &str) -> Value {
    if !common::check_uid(uid) {
        return result::error("UID格式错误, 应为9位整数!");
    }

    let server = get_server(uid);

    let result = genshin::character(uid, server, cookies);
    match result {
        Ok(data) => {
            let code = data.get("retcode").unwrap().as_i64().unwrap();
            if code != 0 {
                return result::error(data.get("message").unwrap().as_str().unwrap());
            }
            result::success(Some(data.get("data")))
        }
        Err(_) => result::error("无法获取角色详情!"),
    }
}

#[get("/daily_note/<uid>")]
pub fn daily_note(cookies: &CookieJar<'_>, uid: &str) -> Value {
    if !common::check_uid(uid) {
        return result::error("UID格式错误, 应为9位整数!");
    }

    let server = get_server(uid);

    let result = genshin::daily_note(uid, server, cookies);
    match result {
        Ok(data) => {
            let code = data.get("retcode").unwrap().as_i64().unwrap();
            if code != 0 {
                return result::error(data.get("message").unwrap().as_str().unwrap());
            }
            result::success(Some(data.get("data")))
        }
        Err(_) => result::error("无法获取便签数据!"),
    }
}

#[get("/enka/<uid>")]
pub fn enka(uid: &str) -> Value {
    if !common::check_uid(uid) {
        return result::error("UID格式错误, 应为9位整数!");
    }
    let url = format!("https://enka.network/api/uid/{}/", uid);
    let headers = vec![(
        "user-agent".to_string(),
        format!("mihoyo-api/{}", common::app_version()),
    )];
    let result = request::get(&url, Some(headers), None);
    match result {
        Ok(data) => result::success(Some(data)),
        Err(_) => result::error(format!("未查询到UID为 {} 的数据!", uid).as_str()),
    }
}

#[get("/enka/<uid>/info")]
pub fn enka_info(uid: &str) -> Value {
    if !common::check_uid(uid) {
        return result::error("UID格式错误, 应为9位整数!");
    }
    let url = format!("https://enka.network/api/uid/{}/?info", uid);
    let headers = vec![(
        "user-agent".to_string(),
        format!("mihoyo-api/{}", common::app_version()),
    )];
    let result = request::get(&url, Some(headers), None);
    match result {
        Ok(data) => result::success(Some(data)),
        Err(_) => result::error(format!("未查询到UID为 {} 的数据!", uid).as_str()),
    }
}

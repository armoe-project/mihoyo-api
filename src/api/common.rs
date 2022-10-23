use rand::{thread_rng, Rng};
use reqwest::header::HeaderMap;
use rocket::http::CookieJar;

use crate::utils::{common, crypto::md5};

pub fn get_headers(query: Option<&str>, body: Option<&str>) -> HeaderMap {
    let mut headers = reqwest::header::HeaderMap::new();

    let app_version = "2.37.1";
    let cleint_type = "5";
    let ds = get_ds(query, body);
    let device = md5(query.unwrap_or_else(|| "no query"));

    let ua = format!("Mozilla/5.0 (Linux; Android 12; {}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.73 Mobile Safari/537.36 miHoYoBBS/{}", device, app_version);

    // 米游社相关
    headers.insert("x-rpc-app_version", app_version.parse().unwrap());
    headers.insert("x-rpc-client_type", cleint_type.parse().unwrap());
    headers.insert("ds", ds.parse().unwrap());

    // 常规请求头
    headers.insert("user-agent", ua.parse().unwrap());

    return headers;
}

fn get_ds(query: Option<&str>, body: Option<&str>) -> String {
    let query = query.unwrap_or_else(|| "");
    let body = body.unwrap_or_else(|| "");

    let salt = "xV8v4Qu54lUKrEYFZkJhB8cuOh9Asafs";
    let time = common::timestamp() / 1000;
    let random = thread_rng().gen_range(100000..999999);
    let params = format!(
        "salt={}&t={}&r={}&b={}&q={}",
        salt, time, random, body, query
    );
    let ds = md5(&params);

    format!("{},{},{}", time, random, ds)
}

pub fn cookies_to_string(cookies: &CookieJar<'_>) -> String {
    let mut cookie = String::new();

    for ele in cookies.iter() {
        cookie.push_str(format!("{}={};", ele.name(), ele.value()).as_str());
    }

    cookie
}

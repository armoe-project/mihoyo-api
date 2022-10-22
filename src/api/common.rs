use rand::{thread_rng, Rng};
use reqwest::header::HeaderMap;
use rocket::http::CookieJar;

use crate::utils::{common, crypto::md5};

pub fn get_headers(query: Option<&str>, body: Option<&str>) -> HeaderMap {
    let ua = "Mozilla/5.0 (Linux; Android 12; 8e3a2698-fb02-4131-9cfb-5a4e36074027) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.73 Mobile Safari/537.36 miHoYoBBS/2.37.1";
    let mut headers = reqwest::header::HeaderMap::new();

    let app_version = "2.37.1";
    let cleint_type = "5";
    let ds = get_ds(query, body);

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
    let ltoken = cookies.get_pending("ltoken");
    let ltuid = cookies.get_pending("ltuid");
    let cookie_token = cookies.get_pending("cookie_token");
    let account_id = cookies.get_pending("account_id");

    let mut cookie = String::new();
    if ltoken.is_some() {
        cookie.push_str(format!("{};", ltoken.unwrap().to_string()).as_str());
    }
    if ltuid.is_some() {
        cookie.push_str(format!("{};", ltuid.unwrap().to_string()).as_str());
    }
    if cookie_token.is_some() {
        cookie.push_str(format!("{};", cookie_token.unwrap().to_string()).as_str());
    }
    if account_id.is_some() {
        cookie.push_str(format!("{};", account_id.unwrap().to_string()).as_str());
    }
    println!("{}", cookie);
    cookie
}

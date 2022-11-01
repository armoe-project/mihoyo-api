use rand::{thread_rng, Rng};
use rocket::http::CookieJar;
use ureq::{json, serde_json::Value};

use crate::utils::{common, crypto::md5};

pub fn get_server(uid: &str) -> &str {
    match uid[0..1].parse().unwrap() {
        5 => "cn_qd01",         // 渠道服
        6 => "os_usa",          // 美服
        7 => "os_euro",         // 欧服
        8 => "os_asia",         // 亚服
        9 => "os_cht",          // 港澳台服
        1 | 2 | _ => "cn_gf01", // 官服
    }
}

pub fn get_host(server: &str, record: bool) -> &str {
    match server {
        // 国际服
        "os_usa" | "os_euro" | "os_asia" | "os_cht" => {
            if record {
                "https://bbs-api-os.mihoyo.com"
            } else {
                "https://api-os-takumi.mihoyo.com"
            }
        }
        // 国服
        "cn_gf01" | "cn_qd01" | _ => {
            if record {
                "https://api-takumi-record.mihoyo.com"
            } else {
                "https://api-takumi.mihoyo.com"
            }
        }
    }
}

pub fn get_headers(
    query: Option<&str>,
    body: Option<Value>,
    server: &str,
) -> Vec<(String, String)> {
    let mut headers = Vec::new();
    let app_version;
    let client_type;
    let requested_with;
    let origin;
    let referer;
    match server {
        // 国际服
        "os_usa" | "os_euro" | "os_asia" | "os_cht" => {
            app_version = "2.9.0";
            client_type = "2";
            requested_with = "com.mihoyo.hoyolab";
            origin = "https://webstatic-sea.hoyolab.com";
            referer = "https://webstatic-sea.hoyolab.com";
        }
        // 国服
        "cn_gf01" | "cn_qd01" | _ => {
            app_version = "2.37.1";
            client_type = "5";
            requested_with = "com.mihoyo.hyperion";
            origin = "https://webstatic.mihoyo.com";
            referer = "https://webstatic.mihoyo.com";
        }
    };

    let ds = get_ds(query, body, server);
    // 米游社相关
    headers.push(("x-rpc-app_version".to_string(), app_version.to_string()));
    headers.push(("x-rpc-client_type".to_string(), client_type.to_string()));
    headers.push(("x-requested_with".to_string(), requested_with.to_string()));
    headers.push(("origin".to_string(), origin.to_string()));
    headers.push(("referer".to_string(), referer.to_string()));
    headers.push(("ds".to_string(), ds));

    return headers;
}

fn get_ds(query: Option<&str>, body: Option<Value>, server: &str) -> String {
    let query = query.unwrap_or_else(|| "");
    let body = body.unwrap_or_else(|| json!({}));

    let salt = match server {
        // 国际服
        "os_usa" | "os_euro" | "os_asia" | "os_cht" => "okr4obncj8bw5a65hbnn5oo6ixjc3l9w",
        // 国服
        "cn_gf01" | "cn_qd01" | _ => "xV8v4Qu54lUKrEYFZkJhB8cuOh9Asafs",
    };
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

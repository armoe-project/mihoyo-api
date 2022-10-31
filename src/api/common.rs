use rand::{thread_rng, Rng};
use rocket::http::CookieJar;

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

pub fn get_headers(query: Option<&str>, body: Option<&str>, server: &str) -> Vec<(String, String)> {
    let mut headers = Vec::new();

    let app_version = "2.37.1";
    let cleint_type = "5";
    let ds = get_ds(query, body, server);
    let device = md5(query.unwrap_or_else(|| "no query"));

    let ua = format!("Mozilla/5.0 (Linux; Android 12; {}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.73 Mobile Safari/537.36 miHoYoBBS/{}", device, app_version);

    // 米游社相关
    headers.push(("x-rpc-app_version".to_string(), app_version.to_string()));
    headers.push(("x-rpc-client_type".to_string(), cleint_type.to_string()));
    headers.push(("ds".to_string(), ds));

    // 常规请求头
    headers.push(("user-agent".to_string(), ua));

    return headers;
}

fn get_ds(query: Option<&str>, body: Option<&str>, server: &str) -> String {
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

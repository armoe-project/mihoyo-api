use chrono::Local;

pub fn timestamp() -> i64 {
    Local::now().timestamp_millis()
}

pub fn check_uid(uid: &str) -> bool {
    let num: u64 = match uid.parse() {
        Ok(n) => n,
        Err(_) => return false,
    };
    if num.to_string().len() != 9 {
        return false;
    }
    true
}

pub fn app_version() -> &'static str {
    env!("CARGO_PKG_VERSION")
}

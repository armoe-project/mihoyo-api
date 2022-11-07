use ureq::{json, serde_json::Value};

use crate::utils::{common, result};

#[get("/")]
pub fn get_index() -> Value {
    index()
}

#[post("/")]
pub fn post_index() -> Value {
    index()
}

fn index() -> Value {
    result::success(Some(json!({
        "name": "mihoyo-api",
        "author": "ZhenXin",
        "license": "GPL-3.0",
        "version": common::app_version(),
        "homepage": "https://github.com/armoe-project/mihoyo-api"
    })))
}

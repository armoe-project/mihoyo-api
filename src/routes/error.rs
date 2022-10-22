use rocket::{
    http::Status,
    request::Request,
    serde::json::{serde_json::json, Value},
};

use crate::utils::{common, result};

#[catch(default)]
pub fn default(status: Status, req: &Request<'_>) -> Value {
    json!({
        "code": status.code,
        "msg": "Unknown Error",
        "data": {
            "uri": req.uri(),
            "timestamp": common::timestamp()
        }
    })
}

#[catch(404)]
pub fn not_found(req: &Request<'_>) -> Value {
    result::build(
        404,
        "404 Not Found",
        Some(json!({
            "uri": req.uri(),
            "timestamp": common::timestamp()
        })),
    )
}

#[catch(500)]
pub fn internal_server_error(req: &Request<'_>) -> Value {
    result::build(
        500,
        "500 Internal Server Error",
        Some(json!({
            "uri": req.uri(),
            "timestamp": common::timestamp()
        })),
    )
}

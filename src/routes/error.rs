use crate::utils::{common, result};
use rocket::{http::Status, Request};
use ureq::{json, serde_json::Value};

#[catch(default)]
pub fn default(status: Status, req: &Request<'_>) -> Value {
    result::build(
        status.code,
        "Unknown Error",
        Some(json!({
            "uri": req.uri(),
            "timestamp": common::timestamp()
        })),
    )
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

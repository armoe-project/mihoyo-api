use rocket::serde::{
    json::{serde_json::json, Value},
    Serialize,
};

pub fn success<T: Serialize>(data: Option<T>) -> Value {
    match data {
        Some(data) => json!({
            "code": 200,
            "msg": "success",
            "data": data
        }),
        None => {
            json!({
                "code": 200,
                "msg": "success"
            })
        }
    }
}

pub fn error(msg: &str) -> Value {
    json!({
        "code": 422,
        "msg": msg
    })
}

pub fn build<T: Serialize>(code: u16, msg: &str, data: Option<T>) -> Value {
    match data {
        Some(data) => json!({
            "code": code,
            "msg": msg,
            "data": data
        }),
        None => json!({
            "code": code,
            "msg": msg
        }),
    }
}
